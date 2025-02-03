import {createFileRoute} from '@tanstack/react-router';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';
import {Alert, Card, Spinner} from 'react-bootstrap';
import SerialKillersApi from '@apis/SerialKillersApi';
import {SerialKiller} from '@entities/SerialKiller';

const keyName = 'SerialKiller';
type Entity = SerialKiller;
const api = SerialKillersApi;

const viewQueryFunc =  (id:string|number): UseQueryOptions<Entity>=> ({
    queryKey: [keyName, String(id)],
    queryFn: () => api.read(id),
})

export const Route = createFileRoute('/serial-killers/$id')({
    component: SerialKillerViewRoute,
});

function SerialKillerViewRoute() {
    const {id} = Route.useParams()

    // Fetch the serial killer details using TanStack Query.
    const {data, isLoading, error} = useQuery<SerialKiller>(viewQueryFunc(id));

    // Loading state.
    if (isLoading) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    // Error state.
    if (error) {
        return <Alert variant="danger">Error loading serial killer details.</Alert>;
    }

    // Fallback in case no data is returned.
    if (!data) {
        return <div>No data found.</div>;
    }

    // Display the serial killer details in a Card.
    return (
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
                    <strong>Date of Birth:</strong> {!!data?.date_of_birth && data.date_of_birth.toLocaleString()} <br/>
                    <strong>Created:</strong> {new Date(data.created).toLocaleString()} <br/>
                    <strong>Modified:</strong> {new Date(data.modified).toLocaleString()}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default SerialKillerViewRoute;
