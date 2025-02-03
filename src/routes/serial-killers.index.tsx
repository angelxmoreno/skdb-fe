import {createFileRoute} from '@tanstack/react-router'
import {useQuery, UseQueryOptions} from '@tanstack/react-query'
import {ListResponse} from "@entities/Server";
import {SerialKiller} from "@entities/SerialKiller";
import SerialKillersApi from "@apis/SerialKillersApi";
import ProfileCard from "@components/cards/ProfileCard";
import {Col, Row, Spinner} from "react-bootstrap";

const keyName = 'SerialKiller';
type Entity = SerialKiller;
const api = SerialKillersApi;


const listQuery: UseQueryOptions<ListResponse<Entity>> = {
    queryKey: [`${keyName}List`],
    queryFn: () => api.list(),
    staleTime: 1000 * 60 * 2,
}

export const Route = createFileRoute('/serial-killers/')({
    component: RouteComponent,
})

function RouteComponent() {
    const { data, isLoading, error } = useQuery<ListResponse<Entity>>(listQuery);


    return (
        <>
            <h1>Serial Killers</h1>
            {isLoading && (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )}            {error && <div>Error loading data: {(error as Error).message}</div>}

            <Row xs={1} md={2} className="g-4">
                {data?.items.map((entity, idx) => (
                    <Col key={idx}>
                        <ProfileCard  serialKiller={entity}/>
                    </Col>
                ))}
            </Row>
        </>
    )
}
