import {CrudApi} from "@apis/CrudApi";
import { SerialKiller} from "@entities/SerialKiller";

class SerialKillersApiClass extends CrudApi<SerialKiller> {
    constructor() {
        super('serial-killers');
    }
}

const SerialKillersApi = new SerialKillersApiClass();
export default SerialKillersApi;