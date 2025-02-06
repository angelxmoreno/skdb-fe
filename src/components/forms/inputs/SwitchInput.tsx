// SwitchInput.tsx
import { FC } from "react";
import { Form } from "react-bootstrap";
import { Controller, useFormContext } from "react-hook-form";

type SwitchInputProps = {
    name: string;
    label: string;
};

const SwitchInput: FC<SwitchInputProps> = ({ name, label }) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    return (
        <Form.Group controlId={name}>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Form.Check
                        type="switch"
                        label={label}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
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

export default SwitchInput;
