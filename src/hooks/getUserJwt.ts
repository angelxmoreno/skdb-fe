import {useAuthStore} from "@hooks/authStore";

const {getState} = useAuthStore;

const getUserJwt = (): string | null => getState().token

export default getUserJwt;