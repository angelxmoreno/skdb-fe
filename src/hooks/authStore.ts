import { create, type StateCreator } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { AuthResponse, AuthUser, SUCCESS } from '@entities/Auth';

// Define the expected payload structure for your JWT.
// Typically, the expiration is stored in the "exp" field as a UNIX timestamp.
interface TokenPayload {
    exp: number;
}

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

// Module-level variable to track the logout timeout.
let logoutTimerId: ReturnType<typeof setTimeout> | null = null;

/**
 * Helper function that decodes the JWT, calculates the timeout duration,
 * and schedules a logout action when the token expires.
 *
 * @param token - The JWT token string.
 * @param logOutAction - The logout function from the store.
 * @param getState - A function that returns the current store state.
 * @returns A timer ID if scheduled, or null.
 */
const scheduleLogoutFromToken = (
    token: string,
    logOutAction: () => void,
    getState: () => { token: string | null }
): ReturnType<typeof setTimeout> | null => {
    try {
        const decoded = jwtDecode<TokenPayload>(token);
        const expTime = decoded.exp * 1000; // Convert seconds to milliseconds.
        const now = Date.now();
        const timeoutDuration = expTime - now;

        if (timeoutDuration > 0) {
            return setTimeout(() => {
                // Ensure the token hasn't changed before logging out.
                if (getState().token === token) {
                    logOutAction();
                }
            }, timeoutDuration);
        } else {
            // Token already expired, log out immediately.
            logOutAction();
            return null;
        }
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        logOutAction();
        return null;
    }
};

const stateCreator: StateCreator<Store> = (set, get) => ({
    ...initialState,

    /**
     * Sets the authentication response.
     * If successful, decodes the JWT and schedules a logout when it expires.
     */
    setAuthResponse: (response: AuthResponse) => {
        // Clear any previously scheduled logout.
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

            // Schedule logout based on token expiration.
            logoutTimerId = scheduleLogoutFromToken(response.jwt, get().logOutAction, get);
        } else {
            // On failure, clear the state.
            set({
                user: null,
                token: null,
                authMessage: response.message,
            });
        }
    },

    /**
     * Logs out the user by clearing stored data and any scheduled logout timer.
     */
    logOutAction: () => {
        if (logoutTimerId) {
            clearTimeout(logoutTimerId);
            logoutTimerId = null;
        }
        set({ user: null, token: null, authMessage: null });
    },
});

// Define the persist configuration.
// onRehydrateStorage's callback receives a raw state object;
// here, we delay its execution using setTimeout to allow useAuthStore to be initialized.
const persistedStorage = persist(stateCreator, {
    name: 'auth-storage',
    storage: createJSONStorage(() => sessionStorage),
    onRehydrateStorage: () => {
        setTimeout(() => {
            // Now it is safe to reference useAuthStore.
            const { token, logOutAction } = useAuthStore.getState();
            if (token) {
                logoutTimerId = scheduleLogoutFromToken(token, logOutAction, useAuthStore.getState);
            }
        }, 0);
    },
});

// Create and export the store.
export const useAuthStore = create<Store>()(persistedStorage);
