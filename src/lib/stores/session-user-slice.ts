import type { StateCreator } from "zustand";

type SessionUser = {
  user: {
    name: string | null;
    username: string | null;
    userType: "user" | "org" | "admin";
  } | null;
};

type SessionUserSliceActions = {
  setSessionUser: (newSession: SessionUserSlice["user"] | null) => void;
};

export type SessionUserSlice = SessionUser & SessionUserSliceActions;

export const createSessionUserSlice: StateCreator<
  SessionUserSlice & SessionUserSliceActions
> = (set) => ({
  user: {
    name: null,
    username: null,
    userType: "user",
  },

  setSessionUser: (newSession) =>
    set(() => ({
      user: newSession,
    })),
});
