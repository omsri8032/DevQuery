import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Models } from "appwrite";

interface AuthState {
    user: Models.User<Models.Preferences> | null;
    session: Models.Session | null;
    setAuth: (user: Models.User<Models.Preferences>, session: Models.Session) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            session: null,
            setAuth: (user, session) => set({ user, session }),
            logout: () => set({ user: null, session: null }),
        }),
        {
            name: "auth-storage",
        }
    )
);
