import {createRootRoute, Outlet} from '@tanstack/react-router'
import AppHeader from "@components/layout/AppHeader";
import {Container} from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import React from "react";

const TanStackRouterDevtools =
    import.meta.env.MODE === 'production'
        ? () => null // Render nothing in production
        : React.lazy(() =>
            // Lazy load in development
            import('@tanstack/router-devtools').then((res) => ({
                default: res.TanStackRouterDevtools,
                // For Embedded Mode
                // default: res.TanStackRouterDevtoolsPanel
            })),
        )

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