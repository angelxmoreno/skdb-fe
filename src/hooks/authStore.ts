import { create, type StateCreator } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {jwtDecode} from 'jwt-decode';
import { AuthResponse, AuthUser, SUCCESS } from '@entities/Auth';

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

// Define the expected payload structure for your JWT.
// Typically, the expiration is stored in the "exp" field as a UNIX timestamp.
interface TokenPayload {
    exp: number;
}

const initialState: State = {
    user: null,
    token: null,
    authMessage: null,
};

// A module-level variable to track the logout timeout.
// This allows us to clear any pending logout when a new token is set.
let logoutTimerId: ReturnType<typeof setTimeout> | null = null;

const stateCreator: StateCreator<Store> = (set, get) => ({
    ...initialState,

    /**
     * Sets the authentication response.
     *
     * If the response indicates success, the user and token are stored. The JWT is decoded to determine
     * when it expires. A timeout is then scheduled that will call logOutAction when the token expires.
     * If a previous logout timeout exists, it is cleared.
     *
     * @param response - The authentication response containing the JWT and user data.
     */
    setAuthResponse: (response: AuthResponse) => {
        // Clear any previously scheduled logout
        if (logoutTimerId) {
            clearTimeout(logoutTimerId);
            logoutTimerId = null;
        }

        if (response.status === SUCCESS && response.user && response.jwt) {
            set({
                user: response.user,
                token: response.jwt,
                authMessage: null,
            });

            try {
                // Decode the token to extract the expiration time.
                const decoded = jwtDecode<TokenPayload>(response.jwt);
                const expTime = decoded.exp * 1000; // convert from seconds to milliseconds
                const now = Date.now();
                const timeoutDuration = expTime - now;

                // Only schedule a logout if the expiration is in the future.
                if (timeoutDuration > 0) {
                    logoutTimerId = setTimeout(() => {
                        // Optionally, you can check if the token is still the same.
                        if (get().token === response.jwt) {
                            get().logOutAction();
                        }
                    }, timeoutDuration);
                } else {
                    // If the token is already expired, log out immediately.
                    get().logOutAction();
                }
            } catch (error) {
                console.error('Failed to decode JWT:', error);
                // In case of any error decoding the token, sign the user out.
                get().logOutAction();
            }
        } else {
            // If the authentication is not successful, clear any stored values.
            set({
                user: null,
                token: null,
                authMessage: response.message,
            });
        }
    },

    /**
     * Logs out the user by clearing user data, token, and auth messages.
     * Any scheduled logout timer is also cleared.
     */
    logOutAction: () => {
        // Clear any pending logout timer.
        if (logoutTimerId) {
            clearTimeout(logoutTimerId);
            logoutTimerId = null;
        }
        set({ user: null, token: null, authMessage: null });
    },
});

const persistedStorage = persist(stateCreator, {
    name: 'auth-storage',
    storage: createJSONStorage(() => sessionStorage),
});

export const useAuthStore = create<Store>()(persistedStorage);
