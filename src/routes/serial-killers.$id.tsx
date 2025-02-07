import {createFileRoute} from '@tanstack/react-router';
import {useQuery} from '@tanstack/react-query';
import {Card} from 'react-bootstrap';
import {SerialKiller} from '@entities/SerialKiller';
import {ButtonPropsArray} from "@components/layout/pageContainer/ButtonPropsBuilder";
import {Crumbs} from "@components/layout/pageContainer/BreadcrumbBuilder";
import {useAuthStore} from "@hooks/authStore";
import PageView from "@components/layout/pageContainer/PageView";
import SerialKillerQueries from "@apis/resources/SerialKillerQueries";

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
            {sm: true, success: true, children: 'Edit', to: '/serial-killers/edit/$id', params:{id}}
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
                    </Card.Body>
                </Card>
            )}
        </PageView>
    );
}

export default SerialKillerViewRoute;
