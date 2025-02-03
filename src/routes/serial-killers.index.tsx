import {createFileRoute} from '@tanstack/react-router'
import {useQuery, UseQueryOptions} from '@tanstack/react-query'
import {ListResponse} from "@entities/Server";
import {SerialKiller} from "@entities/SerialKiller";
import SerialKillersApi from "@apis/SerialKillersApi";
import ProfileCard from "@components/cards/ProfileCard";
import {Col, Row} from "react-bootstrap";
import PageView from "@components/layout/pageContainer/PageView";
import {useAuthStore} from "@hooks/authStore";
import {Crumbs} from "@components/layout/pageContainer/BreadcrumbBuilder";
import {ButtonPropsArray} from "@components/layout/pageContainer/ButtonPropsBuilder";

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
    const {data, isLoading, error} = useQuery<ListResponse<Entity>>(listQuery);
    const {user} = useAuthStore()

    const title = 'Serial Killers';
    const subtitle = 'a list of serial killers'
    const buttonProps: ButtonPropsArray = !user
        ? []
        : [
            {sm: true, success: true, children: 'New', to: '/'}
        ];
    const crumbs: Crumbs = [{name: 'Home', uri: '/'}, 'Serial Killers'];
    const errorText = !error
        ? undefined
        : `Error loading data: ${(error as Error).message}`
    const contentLoading = isLoading;
    const pageViewProps = {title, subtitle, buttonProps, crumbs, errorText, contentLoading};

    return (
        <PageView {...pageViewProps}>
            <Row xs={1} md={2} className="g-4">
                {data?.items.map((entity, idx) => (
                    <Col key={idx}>
                        <ProfileCard serialKiller={entity}/>
                    </Col>
                ))}
            </Row>
        </PageView>
    )
}
