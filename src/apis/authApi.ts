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

/*
i am going to have a series of api calls that use CRUD conventions. I will do this for several different resources. some endpoints require a JWT and others do not. I was thinking of creating a generic TS Class that could be inherited to be reusable for different resources. error handling and response bodies will be the same across diferent CRUD endpoints.

GET /api/{resource} - list: returns {pagination:BEPagination, items:Resource[]}
GET /api/{resource}/{id} - view: returns Resource
POST /api/{resource} - create: sends a CreateResource interface and returns Resource
PATCH /api/{resource}/{id} - update: sends a UpdateResource interface and returns Resource

you will notice that I omitted deletes since the FE should not have any deletes for now.
I would like you to help me develop this.
do you have any questions?

all list responses have {pagination:BEPagination, items:Resource[]}
all view, successful create and successful updates return the resource interface
all create and updates that fail BE validation have this structure and a 400 http response:

{
    "message": string,
    "errors": {
        "resource-property 1": {
            "error code 1": "error message1",
            "error code 2": "error message2"
        },
        "resource-property 2": {
            "error code 1": "error message3",
        }
    }
}

all other errors from the BE will have this structure and can respond various http codes from 401 - 5xx:

{
    "message": "some message",
}
 */