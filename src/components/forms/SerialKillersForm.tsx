import * as yup from "yup";
import {LoadingButtonProps} from "@components/layout/nav/LoadingButton";
import {SerialKiller} from "@entities/SerialKiller";
import {FC} from "react";
import {useMutation} from "@tanstack/react-query";
import SerialKillerQueries from "@apis/resources/SerialKillerQueries";
import {showError, showSuccess} from "@hooks/toastService";
import {useNavigate} from "@tanstack/react-router";
import {setErrorsFromValidationError} from "@entities/ValidationError";
import {UseFormReturn} from "react-hook-form";
import FormBuilder, {FieldConfig} from "@components/forms/FormBuilder";

// --------------------------
// Types & Default Values
// --------------------------
export type SerialKillerFormValues = {
    name: string;
    date_of_birth: Date | null;
    photo: File | null;
};

const defaultValues: SerialKillerFormValues = {
    name: "",
    date_of_birth: null,
    photo: null,
};

// --------------------------
// Validation Schema
// --------------------------
const validationSchema = yup
    .object({
        name: yup.string().required("Name is required"),
        date_of_birth: yup.date().nullable().default(null),
        photo: yup.mixed<File>().nullable().default(null),
    })
    .required();

// --------------------------
// Component Props
// --------------------------
type SerialKillerFormProps = {
    entity?: SerialKiller;
    forEdit?: boolean;
};

/**
 * SerialKillerForm is a generic form component for creating or updating a Serial Killer.
 * It uses FormBuilder internally and leverages react-hook-form for form state management.
 *
 * If an entity is provided and forEdit is true, the form is used for updating;
 * otherwise, it is used for creating a new record.
 */
const SerialKillerForm: FC<SerialKillerFormProps> = ({entity, forEdit = true}) => {
    const saveMutation = useMutation(SerialKillerQueries.save);

    const submitButtonProps: LoadingButtonProps = {
        variant: "primary",
        text: `${forEdit ? "Update" : "Create"} Serial Killer profile`,
    };

    const navigate = useNavigate();

    const onSubmit = async (
        data: SerialKillerFormValues,
        methods: UseFormReturn<SerialKillerFormValues>
    ) => {
        console.log("Form submitted:", {data});

        await saveMutation.mutateAsync(data, {
            onSuccess: async (result) => {
                showSuccess(`Serial Killer profile ${forEdit ? "update" : "create"} success`);
                await navigate({
                    to: "/serial-killers/$id",
                    params: {id: String(result.id)},
                });
            },
            onError: (error) => {
                showError(`Serial Killer profile ${forEdit ? "update" : "create"} failed`);
                setErrorsFromValidationError<SerialKiller, SerialKillerFormValues>(error, methods.setError);
            },
        });
    };

    // Build default values. For file upload, leave the photo as null but optionally pass along an existing URL as preview.
    const formDefaultValues: SerialKillerFormValues = entity
        ? {
            name: entity.name,
            date_of_birth: entity.date_of_birth,
            photo: null,
        }
        : defaultValues;

    // Build the form schema.
    const formSchema: FieldConfig<SerialKillerFormValues>[] = [
        {
            name: "name",
            label: "Name",
            type: "text",
            placeholder: "Enter name",
        },
        {
            name: "date_of_birth",
            label: "Date of Birth",
            type: "date",
        },
        {
            name: "photo",
            label: "Photo",
            type: "upload",
            // If an entity is provided and it has a photo URL, pass it along as preview.
            initPreviewUrl: entity?.photo_url as string | undefined,
        },
    ];

    return (
        <FormBuilder<SerialKillerFormValues>
            formSchema={formSchema}
            validationSchema={validationSchema}
            defaultValues={formDefaultValues}
            onSubmit={onSubmit}
            formClassName="serial-killer-form"
            submitButtonProps={submitButtonProps}
        />
    );
};

export default SerialKillerForm;
