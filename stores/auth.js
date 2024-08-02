import { create } from "zustand";
import { combine } from "zustand/middleware"

export const useAuthStore = create(combine(
    {
        session: null,
    },
    (set, get) => {
        return {
            setSession: (session) => {
                set({
                    session,
                })
            },
        }
    }
))