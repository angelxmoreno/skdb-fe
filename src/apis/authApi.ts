import {AuthResponse} from "@entities/Auth";
import {createAxiosDateTransformer} from "axios-date-transformer";
import appConfig from "@config/index";
import {AxiosError} from "axios";

const http = createAxiosDateTransformer({
    baseURL: appConfig.API_BASE_URL,
});
const extractAuthResponseFromError = (error: AxiosError, statusCodes: number[] = [401]) => {
    const errorStatus = error?.response?.status || error.status;
    if (errorStatus && statusCodes.includes(errorStatus) && error.response) {
        return error.response.data as AuthResponse;
    }
    return {
        status: "ERROR",
        message: error.message,
        user: undefined,
        jwt: undefined,
    };
};

/**
 * Logs in a user by posting email and password.
 *
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A promise that resolves to an AuthResponse.
 */
export const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await http.post<AuthResponse>("/api/auth/login", {email, password});
        return response.data;
    } catch (error: unknown) {
        return extractAuthResponseFromError(error as AxiosError)
    }
};

/**
 * Registers a new user by posting email and password.
 *
 * @param name - The new user's name
 * @param email - The new user's email address.
 * @param password - The new user's password.
 * @returns A promise that resolves to an AuthResponse.
 */
export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await http.post<AuthResponse>("/api/auth/register", {name, email, password});
        return response.data;
    } catch (error: unknown) {
        return extractAuthResponseFromError(error as AxiosError, [400, 401])
    }
};

/**
 * Logs out a user by sending a POST request to /api/auth/logout.
 * The request includes the JWT in the Authorization header.
 *
 * @param jwt - The JWT token to be used for authentication.
 * @returns A promise that resolves to an AuthResponse.
 */
export const logout = async (jwt: string): Promise<void> => {
    const response = await http.post(
        "/api/auth/logout",
        null, // No request body needed for logout.
        {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        }
    );
    return response.data;
};
