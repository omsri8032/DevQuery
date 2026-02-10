import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Models } from "appwrite";
import { account } from "@/lib/appwrite";

interface AuthState {
    user: Models.User<Models.Preferences> | null;
    session: Models.Session | null;
    loading: boolean;
    setAuth: (user: Models.User<Models.Preferences>, session: Models.Session) => void;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            session: null,
            loading: true,
            setAuth: (user, session) => set({ user, session }),
            logout: async () => {
                try {
                    await account.deleteSession("current");
                } catch (error) {
                    console.error("Logout failed", error);
                }
                set({ user: null, session: null });
            },
            checkSession: async () => {
                set({ loading: true });
                try {
                    const user = await account.get();
                    set({ user, loading: false });
                } catch (error) {
                    set({ user: null, session: null, loading: false });
                }
            }
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({ user: state.user, session: state.session }),
        }
    )
);
