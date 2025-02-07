import {createFileRoute} from '@tanstack/react-router'
import {useAuthStore} from "@hooks/authStore";
import { useQuery} from "@tanstack/react-query";
import {SerialKiller} from "@entities/Models";
import {ButtonPropsArray} from "@components/layout/pageContainer/ButtonPropsBuilder";
import {Crumbs} from "@components/layout/pageContainer/BreadcrumbBuilder";
import PageView from "@components/layout/pageContainer/PageView";
import SerialKillerQueries from "@apis/resources/SerialKillerQueries";
import SerialKillersForm from "@components/forms/SerialKillersForm";
import QuestionAnswerForm from "@components/forms/QuestionAnswerForm";

export const Route = createFileRoute('/_authenticated/serial-killers/edit/$id')(
    {
        component: RouteComponent,
    },
)

function RouteComponent() {
    const {id} = Route.useParams()
    const {user} = useAuthStore()

    // Fetch the serial killer details using TanStack Query.
    const viewQuery = useQuery<SerialKiller>(SerialKillerQueries.view(id));

    const title = viewQuery.data?.name;
    const buttonProps: ButtonPropsArray = !user
        ? []
        : [
            {sm: true, info: true, children: 'View', to: '/serial-killers/$id', params: {id}}
        ];
    const crumbs: Crumbs = [
        {name: 'Home', uri: '/'},
        {name: 'Serial Killers', uri: '/serial-killers'},
    ];
    if (viewQuery.data && viewQuery.data?.name) {
        crumbs.push({
            name: viewQuery.data.name,
            uri: '/serial-killers/' + id
        })
    }
    const errorText = !viewQuery.error
        ? undefined
        : `Error loading data: ${(viewQuery.error as Error).message}`
    const contentLoading = viewQuery.isLoading;
    const pageViewProps = {title, buttonProps, crumbs, errorText, contentLoading};
    return (
        <PageView {...pageViewProps}>
            {!viewQuery.data && <div>No data found.</div>}
            {!!viewQuery.data && (
                <SerialKillersForm entity={viewQuery.data}/>
            )}
            <hr/>
            <QuestionAnswerForm serialKillerId={id}/>
        </PageView>
    );
}
