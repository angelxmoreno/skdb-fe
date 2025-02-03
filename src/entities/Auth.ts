import {BaseEntity} from "@entities/Server";

export const SUCCESS = 'SUCCESS';

export interface AuthResponse {
    status: string
    message: string | undefined
    user: AuthUser | undefined
    jwt: string | undefined
}

export interface AuthUser extends BaseEntity{
    name: string
    email: string
    profile_pic: string | null
    is_active: boolean
}
