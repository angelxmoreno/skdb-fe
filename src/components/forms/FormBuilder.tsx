import {DefaultValues, FieldValues, FormProvider, Resolver, useForm,} from "react-hook-form";
import {ObjectSchema} from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import LoadingButton, {LoadingButtonProps} from "@components/layout/nav/LoadingButton";
import FormRenderer from "@components/forms/FormRenderer";

// Generic FieldConfig type, where "name" is constrained to be a key of TFormValues.
export interface FieldConfig<TFormValues> {
    name: keyof TFormValues;
    label: string;
    type:
        | "text"
        | "textarea"
        | "date"
        | "boolean"
        | "radio"
        | "select"
        | "checkbox"
        | "upload"; // new field type for file uploads
    placeholder?: string;
    options?: Array<{ label: string; value: string }>;
    rows?: number;
    className?: string;
    initPreviewUrl?: string; // for file uploads
}

// FormBuilderProps type for our configuration-driven form builder.
// TFormValues is constrained to FieldValues.
// validationSchema is typed as ObjectSchema<TFormValues>.
export type FormBuilderProps<TFormValues extends FieldValues> = {
    // An array of field configurations.
    formSchema: FieldConfig<TFormValues>[];

    // Yup schema for validating the form values.
    validationSchema: ObjectSchema<TFormValues>;

    // Default values for the form fields.
    defaultValues: DefaultValues<TFormValues>;

    // Submit function that receives the form data and the form methods.
    onSubmit: (
        data: TFormValues,
        methods: ReturnType<typeof useForm<TFormValues>>
    ) => Promise<void> | void;

    // Optional CSS class name for the <form> element.
    formClassName?: string;

    // Props for the submit button.
    submitButtonProps: LoadingButtonProps;
};

// The FormBuilder component.
const FormBuilder = <TFormValues extends FieldValues>({
                                                          formSchema,
                                                          validationSchema,
                                                          defaultValues,
                                                          onSubmit,
                                                          formClassName,
                                                          submitButtonProps,
                                                      }: FormBuilderProps<TFormValues>) => {
    // Double cast the resolver to avoid explicit any, using object as the context type.
    const resolver = yupResolver(validationSchema) as unknown as Resolver<TFormValues, object>;

    const methods = useForm<TFormValues>({
        resolver,
        defaultValues,
    });

    return (
        <FormProvider {...methods}>
            <form
                className={formClassName}
                onSubmit={methods.handleSubmit((data) => onSubmit(data, methods))}
                noValidate
            >
                <FormRenderer formSchema={formSchema}/>
                <LoadingButton
                    {...submitButtonProps}
                    type="submit"
                    isLoading={methods.formState.isSubmitting}
                />
            </form>
        </FormProvider>
    );
};

export default FormBuilder;
