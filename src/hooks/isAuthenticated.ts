import {useAuthStore} from "@hooks/authStore";

const {getState} = useAuthStore;

const isAuthenticated = (): boolean => !!getState().token

export default isAuthenticated;