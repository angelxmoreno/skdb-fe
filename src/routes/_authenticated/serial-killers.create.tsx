import {createFileRoute} from '@tanstack/react-router'
import {Crumbs} from '@components/layout/pageContainer/BreadcrumbBuilder'
import PageView from '@components/layout/pageContainer/PageView'
import {ButtonPropsArray} from "@components/layout/pageContainer/ButtonPropsBuilder";
import SerialKillersForm from "@components/forms/SerialKillersForm";

export const Route = createFileRoute('/_authenticated/serial-killers/create')({
    component: RouteComponent,
})

function RouteComponent() {
    const title = 'Create Serial Killer profile';
    const buttonProps: ButtonPropsArray =
        [
            {sm: true, info: true, children: 'view all', to: '/serial-killers'}
        ];

    const crumbs: Crumbs = [
        {name: 'Home', uri: '/'},
        {name: 'Serial Killers', uri: '/serial-killers'},
        'create'
    ];

    const pageViewProps = {title, buttonProps, crumbs};
    return (
        <PageView {...pageViewProps}>
            <SerialKillersForm forEdit={false}/>
        </PageView>
    );
}
