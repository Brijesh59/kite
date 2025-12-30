import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@kite/types";

interface AuthState {
  user: User | null;
  onboardingCompleted: boolean;
  login: (user: User, onboardingCompleted?: boolean) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      onboardingCompleted: false,
      login: (user, onboardingCompleted = false) => {
        set({ user, onboardingCompleted });
      },
      setOnboardingCompleted: (completed) => {
        set({ onboardingCompleted: completed });
      },
      logout: () => {
        set({ user: null, onboardingCompleted: false });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        onboardingCompleted: state.onboardingCompleted,
      }),
    }
  )
);
