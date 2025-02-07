import {createFileRoute} from '@tanstack/react-router';
import {useQuery} from '@tanstack/react-query';
import {Card} from 'react-bootstrap';
import {Question, Section, SerialKiller} from '@entities/Models';
import {ButtonPropsArray} from "@components/layout/pageContainer/ButtonPropsBuilder";
import {Crumbs} from "@components/layout/pageContainer/BreadcrumbBuilder";
import {useAuthStore} from "@hooks/authStore";
import PageView from "@components/layout/pageContainer/PageView";
import SerialKillerQueries from "@apis/resources/SerialKillerQueries";

const structureAnswers = (serialKiller?: SerialKiller): Section[] => {
    if (!serialKiller?.answers) return [];

    return Object.values(
        serialKiller.answers.reduce<Record<number, Section & { questions: Question[] }>>(
            (sectionsMap, answer) => {
                if (!answer.question || !answer.question.section) return sectionsMap;

                const {section, ...questionData} = answer.question;
                const {id: sectionId, name: sectionName, created: sectionCreated, modified: sectionModified} = section;

                // Ensure the section exists
                if (!sectionsMap[sectionId]) {
                    sectionsMap[sectionId] = {
                        id: sectionId,
                        name: sectionName,
                        created: sectionCreated,
                        modified: sectionModified,
                        questions: [], // ✅ Correctly initialized as an array
                    };
                }

                const sectionRef = sectionsMap[sectionId];

                // Find existing question within the section
                let questionRef = sectionRef.questions.find(q => q.id === questionData.id);

                // If the question doesn't exist, add it
                if (!questionRef) {
                    questionRef = {
                        id: questionData.id,
                        type: questionData.type,
                        prompt: questionData.prompt,
                        section_id: sectionId,
                        answers: [], // ✅ Now guaranteed to exist
                        created: questionData.created,
                        modified: questionData.modified,
                    };
                    sectionRef.questions.push(questionRef);
                }

                // ✅ Ensure answers array exists before pushing (solves TS18048)
                questionRef.answers = questionRef.answers || [];

                // Add the answer to the corresponding question
                questionRef.answers.push({
                    id: answer.id,
                    body: answer.body,
                    profile_id: answer.profile_id,
                    question_id: answer.question_id,
                    created: answer.created,
                    modified: answer.modified,
                });

                return sectionsMap;
            },
            {} as Record<number, Section & { questions: Question[] }> // ✅ Type-safe initialization
        )
    );
};


export const Route = createFileRoute('/serial-killers/$id')({
    component: SerialKillerViewRoute,
});

function SerialKillerViewRoute() {
    const {id} = Route.useParams()
    const {user} = useAuthStore()

    // Fetch the serial killer details using TanStack Query.
    const {data, isLoading, error} = useQuery<SerialKiller>(SerialKillerQueries.view(id));

    const title = data?.name;
    const buttonProps: ButtonPropsArray = !user
        ? []
        : [
            {sm: true, success: true, children: 'Edit', to: '/serial-killers/edit/$id', params: {id}}
        ];
    const crumbs: Crumbs = [
        {name: 'Home', uri: '/'},
        {name: 'Serial Killers', uri: '/serial-killers'},
    ];
    if (data && data?.name) {
        crumbs.push(data.name)
    }
    const errorText = !error
        ? undefined
        : `Error loading data: ${(error as Error).message}`
    const contentLoading = isLoading;
    const pageViewProps = {title, buttonProps, crumbs, errorText, contentLoading};
    const sections = structureAnswers(data)
    return (
        <PageView {...pageViewProps}>
            {!data && <div>No data found.</div>}
            {!!data && (
                <Card className="my-4">
                    {data.photo_url && (
                        <Card.Img
                            variant="top"
                            src={data.photo_url}
                            alt={data.name}
                            style={{height: '300px', width: '100%', objectFit: 'cover'}}
                        />
                    )}
                    <Card.Body>
                        <Card.Title>{data.name}</Card.Title>
                        <Card.Text>
                            <strong>Date of
                                Birth:</strong> {!!data?.date_of_birth && data.date_of_birth.toLocaleString()}
                            <br/>
                            <strong>Created:</strong> {new Date(data.created).toLocaleString()} <br/>
                            <strong>Modified:</strong> {new Date(data.modified).toLocaleString()}
                        </Card.Text>
                        <hr/>
                        {sections.map(section => (
                            <section key={`section-${section.id}`}>
                                <h2>{section.name}</h2>
                                {section.questions?.map(question => (
                                    <section key={`question-${question.id}`}>
                                        <h5>{question.prompt}</h5>
                                        {question.answers?.map(answer => (
                                            <p key={`answer-${answer.id}`} className="lead">
                                                {String(answer.body)}
                                            </p>
                                        ))}
                                    </section>
                                ))}
                            </section>
                        ))}
                    </Card.Body>
                </Card>
            )}
        </PageView>
    );
}

export default SerialKillerViewRoute;
