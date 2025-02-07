import {StrictMode} from 'react'
import ReactDOM from 'react-dom/client'
import {createRouter, RouterProvider} from '@tanstack/react-router'
import {QueryClientProvider} from '@tanstack/react-query'
import {routeTree} from "./routeTree.gen";
import {queryClient} from "@config/index";
import './index.css'
const router = createRouter({routeTree})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router}/>
            </QueryClientProvider>
        </StrictMode>,
    )
}