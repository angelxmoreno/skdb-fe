// DatePickerInput.tsx
import { FC } from "react";
import { Form } from "react-bootstrap";
import { Controller, useFormContext } from "react-hook-form";

type DatePickerInputProps = {
    name: string;
    label: string;
};

const DatePickerInput: FC<DatePickerInputProps> = ({ name, label }) => {
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
                    <Form.Control
                        type="date"
                        value={
                            field.value instanceof Date
                                ? field.value.toISOString().split("T")[0]
                                : ""
                        }
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
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

export default DatePickerInput;
