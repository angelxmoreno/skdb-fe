import {CrudApi} from "@apis/CrudApi";
import {Answer, SerialKiller} from "@entities/Models";

class SerialKillersApiClass extends CrudApi<SerialKiller> {
    constructor() {
        super('serial-killers');
    }

    /**
     * Answer get the answer for the given profile and question id
     * GET /api/serial-killers/{id}/answers/{question_id}
     */
    async answer(id: number | string, question_id: number | string): Promise<Answer> {
        const headers = this.getHeaders("update");
        const url = `/api/${this.resourcePath}/${id}/answers/${question_id}`
        const response = await this.axiosInstance.get<Answer>(url, {headers});
        return response.data;
    }
}

const SerialKillersApi = new SerialKillersApiClass();
export default SerialKillersApi;