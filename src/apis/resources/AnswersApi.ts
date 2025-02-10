import {CrudApi} from "@apis/CrudApi";
import {Answer} from "@entities/Models";
import {buildQueries} from "@apis/buildQueries";
import {BeValidationException, isBeValidationError} from "@entities/ValidationError";

class AnswersApiClass extends CrudApi<Answer> {
    constructor() {
        super('answers');
    }

    async save(data: Partial<Answer>): Promise<Answer | BeValidationException> {
        // Determine if we are updating (if an id exists) or creating.
        const isUpdate = !!data.id;
        const headers = this.getHeaders(isUpdate ? "update" : "create");
        const postData = this.prepareDataForPost(data);
        const serialKillerId = data.profile_id;

        try {
            const url = isUpdate
                ? `/api/serial-killers/${serialKillerId}/answers/${this.resourcePath}/${data.id}`
                : `/api/serial-killers/${serialKillerId}/answers`;

            const response = await this.axiosInstance.post<Answer>(url, postData, {headers});
            return response.data;
        } catch (err: unknown) {
            if (isBeValidationError<Answer>(err)) {
                return err.response.data;
            }
            throw err;
        }
    }
}

export const AnswersApi = new AnswersApiClass();
export const AnswersQueries = buildQueries<Answer>('Answer', AnswersApi)
