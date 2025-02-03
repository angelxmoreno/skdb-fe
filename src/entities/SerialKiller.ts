import {BaseEntity} from "@entities/Server";

export interface SerialKiller extends BaseEntity {
    name: string
    date_of_birth: Date|null
    photo_url: string|null
}

export interface CreateSerialKiller{
    name: string
    date_of_birth?: Date
}

export interface UpdateSerialKiller  {
    name?: string
    date_of_birth?: Date
}
