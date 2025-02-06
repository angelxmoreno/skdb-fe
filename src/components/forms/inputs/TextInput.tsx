import { FC } from "react";
import { Form } from "react-bootstrap";
import { Controller, useFormContext } from "react-hook-form";

type TextInputProps = {
    name: string;
    label: string;
    placeholder?: string;
};

const TextInput: FC<TextInputProps> = ({ name, label, placeholder }) => {
    // Use the form context from React Hook Form
    const { control, formState: { errors } } = useFormContext();

    return (
        <Form.Group controlId={name}>
            <Form.Label>{label}</Form.Label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Form.Control type="text" placeholder={placeholder} {...field} />
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

export default TextInput;
