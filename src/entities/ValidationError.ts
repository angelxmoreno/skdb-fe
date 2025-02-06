import {BaseEntity, BeError} from "@entities/Server";
import {FieldValues, Path, UseFormSetError} from "react-hook-form";
import {AxiosError, AxiosResponse, isAxiosError} from "axios";

export interface BeValidationException<Entity extends BaseEntity = BaseEntity> extends BeError {
    errors?: {
        [K in keyof Entity]?: {  // K is constrained to the keys of the Entity
            [errorCode: string]: string;  // Error codes are dynamic strings
        };
    };
}

export interface BeValidationError<Entity extends BaseEntity = BaseEntity> extends AxiosError {
    response: AxiosResponse<BeValidationException<Entity>>;
}

export const isBeValidationError = <Entity extends BaseEntity = BaseEntity>(
    error: unknown,
): error is BeValidationError<Entity> => {
    if (!isAxiosError(error)) {
        return false;
    }

    if (
        !error.response?.data ||
        typeof error.response.data.message !== 'string' ||
        !Array.isArray(error.response.data.errors)
    ) {
        return false;
    }

    return true;
};

export const setErrorsFromValidationError = <Entity extends BaseEntity, FormValues extends FieldValues>(
    error: BeValidationException<Entity>,
    setError: UseFormSetError<FormValues>
) => {
    if (error.errors) {
        // Iterate over each field in the errors object
        Object.entries(error.errors).forEach(([field, fieldErrors]) => {
            // Iterate over each error code for the field
            Object.entries(fieldErrors).forEach(([errorCode, errorMessage]) => {
                // Set the error on the corresponding field in React Hook Form
                setError(field as Path<FormValues>, {
                    type: errorCode,  // You can use errorCode to store the specific type of error
                    message: String(errorMessage),  // Set the error message
                });
            });
        });
    }
};