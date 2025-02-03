import { create, type StateCreator } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {AuthResponse, AuthUser, SUCCESS} from "@entities/Auth";

interface State {
    user: AuthUser | null;
    token: string | null;
    authMessage: string | null;
}

interface Actions {
    setAuthResponse: (response: AuthResponse) => void | Promise<void>;
    logOutAction: () => void | Promise<void>;
}

type Store = State & Actions;

const initialState: State = {
    user: null,
    token: null,
    authMessage: null,
};

const stateCreator: StateCreator<Store> = set => ({
    ...initialState,
    setAuthResponse: (response: AuthResponse) => {
        if (response.status === SUCCESS && !!response.user && !!response.jwt) {
            set({
                user: response.user,
                token: response.jwt,
                authMessage: null,
            });
        } else {
            set({
                user: null,
                token: null,
                authMessage: response.message,
            });
        }
    },
    logOutAction: () => set({ user: null, token: null, authMessage: null }),
});

const persistedStorage = persist(stateCreator, {
    name: 'auth-storage',
    storage: createJSONStorage(() => sessionStorage),
});

export const useAuthStore = create<Store>()(persistedStorage);
