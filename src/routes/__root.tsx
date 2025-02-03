import {createRootRoute, Outlet} from '@tanstack/react-router'
import {TanStackRouterDevtools} from '@tanstack/router-devtools'
import AppHeader from "@components/layout/AppHeader";
import {Container} from "react-bootstrap";

export const Route = createRootRoute({
    component: () => (
        <>
            <AppHeader/>
            <Container className="py-2">
                <Outlet/>
            </Container>
            <TanStackRouterDevtools/>
        </>
    ),
})