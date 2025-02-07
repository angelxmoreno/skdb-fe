import {CrudApi} from "@apis/CrudApi";
import {Section} from "@entities/Models";
import {buildQueries} from "@apis/buildQueries";

class SectionsApiClass extends CrudApi<Section> {
    constructor() {
        super('sections');
    }
}

export const SectionsApi = new SectionsApiClass();
export const SectionsQueries = buildQueries<Section>('Section', SectionsApi)
