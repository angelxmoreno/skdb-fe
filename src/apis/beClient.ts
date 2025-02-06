import {createAxiosDateTransformer} from "axios-date-transformer";
import appConfig from "@config/index";
import {InternalAxiosRequestConfig} from "axios";
import httpCache from "@apis/httpCache";

const beClient = createAxiosDateTransformer({
    baseURL: appConfig.API_BASE_URL,
});

beClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const cached = await httpCache.getFromCache(config);

    if (cached?.eTag) {
        config.headers["If-None-Match"] = cached.eTag;
    }

    if (cached?.lastModified) {
        config.headers["If-Modified-Since"] = cached.lastModified;
    }

    return config;
});

// Response Interceptor: Store response in IndexedDB
beClient.interceptors.response.use(async (response) => {
    await httpCache.saveToCache(response);
    return response;
}, async (error) => {
    if (error.response?.status === 304) {
        const cached = await httpCache.getFromCache(error.config);
        if (cached) {
            return Promise.resolve({
                data: cached.data,
                status: 200,
                statusText: 'OK',
                headers: cached.headers,
                config: error.config,
                request: null,
            });
        }
    }
    return Promise.reject(error);
});


export default beClient;