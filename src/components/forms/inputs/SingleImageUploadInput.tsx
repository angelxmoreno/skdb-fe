import  { FC, useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Form, Image } from "react-bootstrap";

type SingleImageUploadInputProps = {
    name: string;
    label: string;
    className?: string;
    /** Optional URL to be used as the preview (e.g. when editing an existing entity) */
    initPreviewUrl?: string;
};

const SingleImageUploadInput: FC<SingleImageUploadInputProps> = ({
                                                                     name,
                                                                     label,
                                                                     className,
                                                                     initPreviewUrl,
                                                                 }) => {
    const {
        control,
        watch,
        formState: { errors },
    } = useFormContext();

    // Watch the current value for the file input.
    const fileValue = watch(name);

    // Use the provided initPreviewUrl as the initial preview if available.
    const [previewUrl, setPreviewUrl] = useState<string | null>(initPreviewUrl || null);

    useEffect(() => {
        // If a file is selected, create a preview URL.
        if (fileValue instanceof File) {
            const url = URL.createObjectURL(fileValue);
            setPreviewUrl(url);
            return () => {
                URL.revokeObjectURL(url);
            };
        } else if (typeof fileValue === "string") {
            // In case fileValue is already a URL string.
            setPreviewUrl(fileValue);
        } else if (!fileValue) {
            // If no file is selected, fall back to the provided initPreviewUrl (if any).
            setPreviewUrl(initPreviewUrl || null);
        }
    }, [fileValue, initPreviewUrl]);

    return (
        <Form.Group controlId={name} className={className}>
            <Form.Label>{label}</Form.Label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Form.Control
                        type="file"
                        onChange={(e) => {
                            const target = e.target as HTMLInputElement;
                            const files = target.files;
                            // For a single image upload, pass only the first file.
                            field.onChange(files ? files[0] : null);
                        }}
                    />
                )}
            />
            {previewUrl && (
                <div className="mt-2">
                    <Image
                        src={previewUrl}
                        alt="Image preview"
                        thumbnail
                        style={{ maxHeight: "200px" }}
                    />
                </div>
            )}
            {errors[name] && (
                <Form.Text className="text-danger">
                    {errors[name]?.message as string}
                </Form.Text>
            )}
        </Form.Group>
    );
};

export default SingleImageUploadInput;
