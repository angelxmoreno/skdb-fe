import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Form } from "react-bootstrap";

type UploadInputProps = {
    name: string;
    label: string;
    multiple?: boolean;
    className?: string;
};

const UploadInput: FC<UploadInputProps> = ({
                                               name,
                                               label,
                                               multiple = false,
                                               className,
                                           }) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    return (
        <Form.Group controlId={name} className={className}>
            <Form.Label>{label}</Form.Label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Form.Control
                        type="file"
                        multiple={multiple}
                        onChange={(e) => {
                            const target = e.target as HTMLInputElement;
                            const files = target.files;
                            field.onChange(multiple ? files : files?.[0]);
                        }}
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

export default UploadInput;
