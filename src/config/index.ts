import {QueryClient} from "@tanstack/react-query";

export interface AppConfig {
    API_BASE_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
}

const appConfig: AppConfig = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    NODE_ENV: (import.meta.env.MODE as 'development' | 'production' | 'test') || 'development',
};

export default appConfig;

// Create a new QueryClient instance for TanStack Query
export const queryClient = new QueryClient()