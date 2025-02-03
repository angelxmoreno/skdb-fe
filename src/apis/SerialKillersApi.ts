import {CrudApi} from "@apis/CrudApi";
import {CreateSerialKiller, SerialKiller, UpdateSerialKiller} from "@entities/SerialKiller";

class SerialKillersApiClass extends CrudApi<SerialKiller, CreateSerialKiller, UpdateSerialKiller> {
    constructor() {
        super('serial-killers');
    }
}

const SerialKillersApi = new SerialKillersApiClass();
export default SerialKillersApi;