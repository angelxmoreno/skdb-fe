import {AxiosError, AxiosInstance} from 'axios';
import {createAxiosDateTransformer} from "axios-date-transformer";
import {BEValidationError, ListResponse} from "@entities/Server";
import getUserJwt from "@hooks/getUserJwt";
import appConfig from "@config/index";

/**
 * Generic CRUD API class.
 *
 * T: The type of the resource.
 * CreateT: The type of the payload for creating the resource.
 * UpdateT: The type of the payload for updating the resource.
 *
 * The jwtGetter is a function that returns the current JWT (or undefined if not set).
 */
export class CrudApi<T, CreateT, UpdateT> {
    protected axiosInstance: AxiosInstance;
    protected resourcePath: string;
    /**
     * Map that determines whether a given CRUD action requires a JWT.
     * Default is:
     * {
     *    list: false,
     *    read: false,
     *    create: true,
     *    update: true,
     * }
     *
     * Child classes may override this.
     */
    protected jwtRequired: { list: boolean; read: boolean; create: boolean; update: boolean } = {
        list: false,
        read: false,
        create: true,
        update: true,
    };

    protected jwtGetter?: () => (string | null);

    /**
     * @param resourcePath - The resource name that will be used in the URL (e.g., "users").
     * @param axiosInstance - Optional. An Axios instance. If not provided, a default instance is created.
     * @param jwtGetter - Optional. A callable that returns the current JWT.
     */
    constructor(
        resourcePath: string,
        axiosInstance?: AxiosInstance,
        jwtGetter?: () => string | null
    ) {
        this.resourcePath = resourcePath;
        this.axiosInstance =
            axiosInstance ||
            createAxiosDateTransformer({
                baseURL: appConfig.API_BASE_URL || '', // Adjust as needed
            });
        this.jwtGetter = jwtGetter ?? getUserJwt;
    }

    /**
     * Internal helper to get headers based on whether the action requires a JWT.
     */
    protected getHeaders(action: 'list' | 'read' | 'create' | 'update'): Record<string, string> {
        const headers: Record<string, string> = {};
        if (this.jwtRequired[action] && this.jwtGetter) {
            const token = this.jwtGetter();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return headers;
    }

    /**
     * List resources.
     * GET /api/{resource}
     */
    async list(): Promise<ListResponse<T>> {
        const headers = this.getHeaders('list');
        const response = await this.axiosInstance.get<ListResponse<T>>(`/api/${this.resourcePath}`, {headers});
        return response.data;
    }

    /**
     * Read (view) a single resource.
     * GET /api/{resource}/{id}
     */
    async read(id: number | string): Promise<T> {
        const headers = this.getHeaders('read');
        const response = await this.axiosInstance.get<T>(`/api/${this.resourcePath}/${id}`, {headers});
        return response.data;
    }

    /**
     * Create a new resource.
     * POST /api/{resource}
     *
     * On success returns the created resource.
     * On BE validation failure (HTTP 400), returns the validation error.
     */
    async create(data: CreateT): Promise<T | BEValidationError> {
        const headers = this.getHeaders('create');
        try {
            const response = await this.axiosInstance.post<T>(`/api/${this.resourcePath}`, data, {headers});
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (error.response && error.response?.status === 400) {
                return error.response?.data as BEValidationError;
            }
            throw err;
        }
    }

    /**
     * Update an existing resource.
     * PATCH /api/{resource}/{id}
     *
     * On success returns the updated resource.
     * On BE validation failure (HTTP 400), returns the validation error.
     */
    async update(id: number | string, data: UpdateT): Promise<T | BEValidationError> {
        const headers = this.getHeaders('update');
        try {
            const response = await this.axiosInstance.patch<T>(`/api/${this.resourcePath}/${id}`, data, {headers});
            return response.data;
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (error.response && error.response?.status === 400) {
                return error.response?.data as BEValidationError;
            }
            throw err;
        }
    }

    // Child classes can add additional endpoints/methods as needed.
}
