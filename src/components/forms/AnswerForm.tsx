import * as yup from "yup";
import {LoadingButtonProps} from "@components/layout/nav/LoadingButton";
import {Answer, Question} from "@entities/Models";
import {FC} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {showError, showSuccess} from "@hooks/toastService";
import {setErrorsFromValidationError} from "@entities/ValidationError";
import {UseFormReturn} from "react-hook-form";
import FormBuilder, {FieldConfig} from "@components/forms/core/FormBuilder";
import {AnswersQueries} from "@apis/resources/AnswersApi";
import SerialKillerQueries from "@apis/resources/SerialKillerQueries";
import {Spinner} from "react-bootstrap";
import {queryClient} from "@config/index";

export type FormValues = {
    body: string;
};

const validationSchema = yup
    .object({
        body: yup.string().optional().default(''),
    })
    .required();

type AnswerFormProps = {
    question: Question;
    profileId: string | number
};

const AnswerForm: FC<AnswerFormProps> = ({question, profileId}) => {
    const saveMutation = useMutation(AnswersQueries.save);
    const answerQuery = useQuery(SerialKillerQueries.answer(profileId, question.id));

    const defaultValues: FormValues = {
        body: answerQuery.data?.body || "",
    };

    const submitButtonProps: LoadingButtonProps = {
        variant: "primary",
        text: `Save Answer`,
    };

    const onSubmit = async (
        data: FormValues,
        methods: UseFormReturn<FormValues>
    ) => {
        console.log("Form submitted:", {data});
        const answer: Partial<Answer> = {
            profile_id: Number(profileId),
            question_id: question.id,
            body: data.body,
        }
        await saveMutation.mutateAsync(answer, {
            onSuccess: async () => {
                showSuccess(`Answer saved`);
                await queryClient.invalidateQueries({
                    queryKey: [
                        'SerialKillerAnswer', `id:${profileId}::question:${question.id}`
                    ]
                });
                await queryClient.invalidateQueries({
                    queryKey: [
                        `SerialKiller`, String(profileId)
                    ]
                });
            },
            onError: (error) => {
                showError(`Unable to save answer`);
                setErrorsFromValidationError<Answer, FormValues>(error, methods.setError);
            },
        });
    };

    // Build the form schema.
    const formSchema: FieldConfig<FormValues>[] = [
        {
            name: "body",
            label: `${question.prompt}`,
            type: "textarea",
        },
    ];

    return (
        <>
            {answerQuery.isLoading && <Spinner/>}
            {answerQuery.data && (
                <FormBuilder<FormValues>
                    formSchema={formSchema}
                    validationSchema={validationSchema}
                    defaultValues={defaultValues}
                    onSubmit={onSubmit}
                    submitButtonProps={submitButtonProps}
                    formClassName={'answer-form'}
                />
            )}
            <hr/>
        </>

    );
};

export default AnswerForm;
