import {createFileRoute} from '@tanstack/react-router'
import {useQuery} from '@tanstack/react-query'
import ProfileCard from "@components/cards/ProfileCard";
import {Col, Row} from "react-bootstrap";
import PageView from "@components/layout/pageContainer/PageView";
import {useAuthStore} from "@hooks/authStore";
import {Crumbs} from "@components/layout/pageContainer/BreadcrumbBuilder";
import {ButtonPropsArray} from "@components/layout/pageContainer/ButtonPropsBuilder";
import SerialKillerQueries from "@apis/resources/SerialKillerQueries";
import PaginationCounter from "@components/pagination-counter/PaginationCounter";

export const Route = createFileRoute('/serial-killers/')({
    component: RouteComponent,
})

function RouteComponent() {
    const {data, isLoading, error} = useQuery(SerialKillerQueries.list({page: 1}));
    const {user} = useAuthStore()

    const title = 'Serial Killers';
    const subtitle = 'a list of serial killers'
    const buttonProps: ButtonPropsArray = !user
        ? []
        : [
            {sm: true, success: true, children: 'New', to: '/serial-killers/create'}
        ];
    const crumbs: Crumbs = [{name: 'Home', uri: '/'}, 'Serial Killers'];
    const errorText = !error
        ? undefined
        : `Error loading data: ${(error as Error).message}`
    const contentLoading = isLoading;
    const pageViewProps = {title, subtitle, buttonProps, crumbs, errorText, contentLoading};

    return (
        <PageView {...pageViewProps}>
                <PaginationCounter bePagination={data?.pagination}/>
            <Row xs={1} md={3} lg={4} className="g-4">
                {data?.items.map((entity, idx) => (
                    <Col key={idx}>
                        <ProfileCard serialKiller={entity}/>
                    </Col>
                ))}
            </Row>
        </PageView>
    )
}
