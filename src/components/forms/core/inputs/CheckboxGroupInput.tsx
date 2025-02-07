// CheckboxGroupInput.tsx
import { FC } from "react";
import { Form } from "react-bootstrap";
import { Controller, useFormContext } from "react-hook-form";

type Option = {
    label: string;
    value: string;
};

type CheckboxGroupInputProps = {
    name: string;
    label: string;
    options: Option[];
};

const CheckboxGroupInput: FC<CheckboxGroupInputProps> = ({ name, label, options }) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    return (
        <Form.Group controlId={name}>
            <Form.Label>{label}</Form.Label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => {
                    // field.value should be an array of selected values.
                    const selectedValues: string[] = field.value || [];
                    const handleChange = (optionValue: string) => {
                        if (selectedValues.includes(optionValue)) {
                            field.onChange(selectedValues.filter((val) => val !== optionValue));
                        } else {
                            field.onChange([...selectedValues, optionValue]);
                        }
                    };

                    return (
                        <div>
                            {options.map((option) => (
                                <Form.Check
                                    key={option.value}
                                    type="checkbox"
                                    label={option.label}
                                    value={option.value}
                                    checked={selectedValues.includes(option.value)}
                                    onChange={() => handleChange(option.value)}
                                />
                            ))}
                        </div>
                    );
                }}
            />
            {errors[name] && (
                <Form.Text className="text-danger">
                    {errors[name]?.message as string}
                </Form.Text>
            )}
        </Form.Group>
    );
};

export default CheckboxGroupInput;
