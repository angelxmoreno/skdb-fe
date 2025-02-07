import { AxiosInstance} from "axios";
import {BaseEntity, ListResponse} from "@entities/Server";
import getUserJwt from "@hooks/getUserJwt";
import beClient from "@apis/beClient";
import {BeValidationException, isBeValidationError} from "@entities/ValidationError";
import formHelpers from "@apis/formHelpers";

/**
 * Generic CRUD API class.
 *
 * T: The type of the resource.
 *
 * The jwtGetter is a function that returns the current JWT (or undefined if not set).
 */
export class CrudApi<T extends BaseEntity> {
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

    protected jwtGetter?: () => string | null;

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
        this.axiosInstance = axiosInstance || beClient;
        this.jwtGetter = jwtGetter ?? getUserJwt;
    }

    /**
     * Internal helper to get headers based on whether the action requires a JWT.
     */
    protected getHeaders(action: "list" | "read" | "create" | "update"): Record<string, string> {
        const headers: Record<string, string> = {};
        if (this.jwtRequired[action] && this.jwtGetter) {
            const token = this.jwtGetter();
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
        }
        return headers;
    }

    /**
     * Recursively inspects the given data for any File objects.
     * If at least one File is found, converts the entire payload into a FormData object.
     * Otherwise, returns the original data.
     *
     * @param data - The payload to be sent in a POST or PATCH request.
     * @returns The original data or a FormData instance if a File was found.
     */
    protected prepareDataForPost(data: unknown): unknown | FormData {
        if (!formHelpers.containsFile(data)) {
            return data;
        }
        const formData = new FormData();
        formHelpers.appendFormData(formData, data);
        return formData;
    }

    /**
     * List resources.
     * GET /api/{resource}
     */
    async list(): Promise<ListResponse<T>> {
        const headers = this.getHeaders("list");
        const response = await this.axiosInstance.get<ListResponse<T>>(`/api/${this.resourcePath}`, {
            params: {page: 1},
            headers,
        });
        return response.data;
    }

    /**
     * Read (view) a single resource.
     * GET /api/{resource}/{id}
     */
    async read(id: number | string): Promise<T> {
        const headers = this.getHeaders("read");
        const response = await this.axiosInstance.get<T>(`/api/${this.resourcePath}/${id}`, {headers});
        return response.data;
    }

    /**
     * Save a resource.
     *
     * If the provided data has an `id`, an update (PATCH) is performed.
     * Otherwise, a create (POST) is performed.
     *
     * On success returns the resource.
     * On BE validation failure (HTTP 400), returns the validation error.
     *
     * @param data - The data to save (a Partial<T>).
     * @returns A promise resolving to the saved resource or a validation error.
     */
    async save(data: Partial<T>): Promise<T | BeValidationException> {
        // Determine if we are updating (if an id exists) or creating.
        const isUpdate = !!data.id;
        const headers = this.getHeaders(isUpdate ? "update" : "create");
        const postData = this.prepareDataForPost(data);

        try {
            const url = isUpdate
                ? `/api/${this.resourcePath}/${data.id}`
                : `/api/${this.resourcePath}`;

            const response = await this.axiosInstance.post<T>(url, postData, {headers});
            return response.data;
        } catch (err: unknown) {
            if(isBeValidationError<T>(err)) {
                return err.response.data;
            }
            throw err;
        }
    }
}
