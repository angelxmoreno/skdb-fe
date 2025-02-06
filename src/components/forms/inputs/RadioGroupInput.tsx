// RadioGroupInput.tsx
import { FC } from "react";
import { Form } from "react-bootstrap";
import { Controller, useFormContext } from "react-hook-form";

type Option = {
    label: string;
    value: string;
};

type RadioGroupInputProps = {
    name: string;
    label: string;
    options: Option[];
};

const RadioGroupInput: FC<RadioGroupInputProps> = ({ name, label, options }) => {
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
                    <div>
                        {options.map((option) => (
                            <Form.Check
                                key={option.value}
                                type="radio"
                                label={option.label}
                                value={option.value}
                                checked={field.value === option.value}
                                onChange={() => field.onChange(option.value)}
                                inline
                            />
                        ))}
                    </div>
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

export default RadioGroupInput;
