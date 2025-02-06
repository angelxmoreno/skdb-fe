import {createRootRoute, Outlet} from '@tanstack/react-router'
import {TanStackRouterDevtools} from '@tanstack/router-devtools'
import AppHeader from "@components/layout/AppHeader";
import {Container} from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const Route = createRootRoute({
    component: () => (
        <>
            <AppHeader/>
            <Container className="py-2">
                <Outlet/>
            </Container>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <TanStackRouterDevtools/>
        </>
    ),
})