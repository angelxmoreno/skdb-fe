import {openDB} from "idb";
import {AxiosRequestConfig, AxiosResponse} from "axios";

type HttpCacheItem = {
    eTag?: string;
    lastModified?: string;
    data: object;
    headers: object;
    timestamp: number
}

const DB_NAME = "httpCacheDB";
const STORE_NAME = "apiResponses";

/**
 * Recursively sorts the keys of an object.
 * @param obj - The object whose keys should be sorted.
 * @returns A new object with sorted keys.
 */
function sortObject(obj: Record<string, unknown>): Record<string, unknown> {
    return Object.keys(obj)
        .sort()
        .reduce((acc, key) => {
            const value = obj[key];
            if (value !== null && typeof value === "object") {
                if (Array.isArray(value)) {
                    // For arrays, sort each object item if applicable.
                    acc[key] = value.map((item) =>
                        item !== null && typeof item === "object"
                            ? sortObject(item as Record<string, unknown>)
                            : item
                    );
                } else {
                    acc[key] = sortObject(value as Record<string, unknown>);
                }
            } else {
                acc[key] = value;
            }
            return acc;
        }, {} as Record<string, unknown>);
}

/**
 * Converts an object (or any value) to a string in a consistent way by
 * sorting object keys before calling JSON.stringify.
 * @param obj - The value to stringify.
 * @returns A JSON string representation with sorted keys for objects.
 */
function objToStr(obj: unknown): string {
    if (obj === null || typeof obj !== "object") {
        return JSON.stringify(obj);
    }
    if (Array.isArray(obj)) {
        // For arrays, process each item (sorting if it's an object)
        const normalizedArray = obj.map((item) =>
            item !== null && typeof item === "object" ? sortObject(item as Record<string, unknown>) : item
        );
        return JSON.stringify(normalizedArray);
    }
    // For plain objects, sort the keys first.
    return JSON.stringify(sortObject(obj as Record<string, unknown>));
}

/**
 * Generates a unique cache key based on the Axios request configuration.
 *
 * The key is constructed by concatenating the `baseURL`, `url`, and a stringified
 * version of the `params` from the request configuration. This key can be used to
 * uniquely identify the cached response for the given request.
 *
 * @param config - The Axios request configuration object.
 * @returns A string representing the unique cache key.
 */
const keyFromConfig = (config: AxiosRequestConfig): string =>
    `${config.baseURL}${config.url}::${objToStr(config.params)}::${config?.headers ? config?.headers['Authorization'] : ''}`;

const cacheItemFromResponse = (response: AxiosResponse): HttpCacheItem => ({
    eTag: response.headers.etag,
    lastModified: response.headers['last-modified'],
    data: response.data,
    headers: response.headers,
    timestamp: Date.now(),
})

const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        },
    });
};

const saveToCache = async (response: AxiosResponse): Promise<void> => {
    try {
        const config = response.config;
        if (!config?.method || config.method.toLowerCase() !== 'get') {
            return;
        }
        const key = keyFromConfig(config);
        const cacheItem = cacheItemFromResponse(response)

        const db = await initDB();
        await db.put(STORE_NAME, cacheItem, key);
    } catch (e) {
        console.error('Error saving to cache: ' + (e as Error).message)
    }
};

const getFromCache = async (config: AxiosRequestConfig): Promise<HttpCacheItem | null> => {
    try {
        if (!config?.method || config.method.toLowerCase() !== 'get') {
            return null;
        }
        const key = keyFromConfig(config);
        const db = await initDB();
        return db.get(STORE_NAME, key);
    } catch (e) {
        console.error('Error getting from cache: ' + (e as Error).message);
        return null;
    }
};

const clearCache = async (): Promise<void> => {
    try {
        const db = await initDB();
        await db.clear(STORE_NAME);
    } catch (e) {
        console.error('Error clearing cache: ' + (e as Error).message)
    }
};

const httpCache = {getFromCache, saveToCache, clearCache}
export default httpCache;