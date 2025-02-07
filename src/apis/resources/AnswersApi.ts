import {CrudApi} from "@apis/CrudApi";
import {Answer} from "@entities/Models";
import {buildQueries} from "@apis/buildQueries";

class AnswersApiClass extends CrudApi<Answer> {
    constructor() {
        super('answers');
    }
}

export const AnswersApi = new AnswersApiClass();
export const AnswersQueries = buildQueries<Answer>('Answer', AnswersApi)
