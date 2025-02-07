// TextareaInput.tsx
import { FC } from "react";
import { Form } from "react-bootstrap";
import { Controller, useFormContext } from "react-hook-form";

type TextareaInputProps = {
    name: string;
    label: string;
    placeholder?: string;
    rows?: number;
};

const TextareaInput: FC<TextareaInputProps> = ({ name, label, placeholder, rows = 3 }) => {
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
                    <Form.Control as="textarea" rows={rows} placeholder={placeholder} {...field} />
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

export default TextareaInput;
