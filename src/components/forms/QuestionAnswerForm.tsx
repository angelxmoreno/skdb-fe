import {FC} from "react";
import {useQuery} from "@tanstack/react-query";
import {SectionsQueries} from "@apis/resources/SectionsApi";
import {Alert, Spinner} from "react-bootstrap";
import AnswerForm from "@components/forms/AnswerForm";

type QuestionAnswerFormProps = {
    serialKillerId: number | string;
}
const QuestionAnswerForm: FC<QuestionAnswerFormProps> = ({serialKillerId}) => {
    const {data, error, isLoading} = useQuery(SectionsQueries.list({page: 1}))
    return (
        <div>
            {isLoading && <Spinner/>}
            {!!error && (
                <Alert>
                    {error.message}
                </Alert>
            )}
            {!!data && data.items.map(section => (
                <section key={`question-section-${section.id}`}>
                    <h2>{section.name}</h2>
                    {section.questions?.map(question => (
                        <AnswerForm key={`answer-form-${serialKillerId}-${question.id}`} question={question} profileId={serialKillerId} />
                    ))}
                </section>
            ))}
        </div>
    )
}

export default QuestionAnswerForm;