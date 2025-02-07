import TextInput from "@components/forms/core/inputs/TextInput";
import TextareaInput from "@components/forms/core/inputs/TextareaInput";
import DatePickerInput from "@components/forms/core/inputs/DatePickerInput";
import SwitchInput from "@components/forms/core/inputs/SwitchInput";
import RadioGroupInput from "@components/forms/core/inputs/RadioGroupInput";
import SelectInput from "@components/forms/core/inputs/SelectInput";
import CheckboxGroupInput from "@components/forms/core/inputs/CheckboxGroupInput";
import SingleImageUploadInput from "@components/forms/core/inputs/SingleImageUploadInput";
import {FieldConfig} from "@components/forms/core/FormBuilder";
import {FieldValues} from "react-hook-form";

type FormRendererProps<TFormValues extends FieldValues> = {
    formSchema: FieldConfig<TFormValues>[];

}
const FormRenderer = <TFormValues extends FieldValues>({formSchema}: FormRendererProps<TFormValues>) => {

    // Helper function to render an input based on the field configuration.
    const renderField = (field: FieldConfig<TFormValues>) => {
        const commonProps = {
            name: field.name as string, // our input components expect name as a string.
            label: field.label,
            placeholder: field.placeholder,
            className: field.className,
        };

        switch (field.type) {
            case "text":
                return <TextInput key={String(field.name)} {...commonProps} />;
            case "textarea":
                return <TextareaInput key={String(field.name)} {...commonProps} rows={field.rows} />;
            case "date":
                return <DatePickerInput key={String(field.name)} {...commonProps} />;
            case "boolean":
                return <SwitchInput key={String(field.name)} {...commonProps} />;
            case "radio":
                return (
                    <RadioGroupInput
                        key={String(field.name)}
                        {...commonProps}
                        options={field.options || []}
                    />
                );
            case "select":
                return (
                    <SelectInput
                        key={String(field.name)}
                        {...commonProps}
                        options={field.options || []}
                    />
                );
            case "checkbox":
                return (
                    <CheckboxGroupInput
                        key={String(field.name)}
                        {...commonProps}
                        options={field.options || []}
                    />
                );
            case "upload":
                return (
                    <SingleImageUploadInput
                        key={String(field.name)}
                        {...commonProps}
                        initPreviewUrl={field.initPreviewUrl}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            {formSchema.map((field) => renderField(field))}
        </>
    )
}

export default FormRenderer;