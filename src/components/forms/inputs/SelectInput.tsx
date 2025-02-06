// SelectInput.tsx
import { FC } from "react";
import { Form } from "react-bootstrap";
import { Controller, useFormContext } from "react-hook-form";

type Option = {
    label: string;
    value: string;
};

type SelectInputProps = {
    name: string;
    label: string;
    options: Option[];
};

const SelectInput: FC<SelectInputProps> = ({ name, label, options }) => {
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
                render={({ field }) => (
                    <Form.Control as="select" {...field}>
                        <option value="">Select an option</option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Form.Control>
                )}
            />
            {errors[name] && (
                <Form.Text className="text-danger">
                    {errors[name]?.message as string}
                </Form.Text>
            )}
        </Form.Group>
    );
};

export default SelectInput;
