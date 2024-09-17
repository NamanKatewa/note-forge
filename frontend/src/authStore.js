import { create } from "zustand";
import Cookies from "js-cookie";

const authStore = create((set, get) => ({
  authenticated: false,

  checkAuth: () => {
    const session = Cookies.get("session");
    if (session) {
      set({ authenticated: true });
    } else {
      set({ authenticated: false });
    }
  },

  getSessionCookie: () => {
    if (get().authenticated) {
      const session = Cookies.get("session");
      return session || null;
    }
    set({ authenticated: false });
    return false;
  },

  getUserRole: () => {
    if (get().authenticated) {
      const userRole = Cookies.get("role");
      return userRole || null;
    }
    set({ authenticated: false });
    return false;
  },

  getUserId: () => {
    if (get().authenticated) {
      const userId = Cookies.get("userId");
      return userId || null;
    }
    set({ authenticated: false });
    return false;
  },

  login: (token, role, userId) => {
    set({ authenticated: true });
    Cookies.set("session", token);
    Cookies.set("role", role);
    Cookies.set("userId", userId);
  },

  logout: () => {
    set({ authenticated: false });
    Cookies.remove("session");
    Cookies.remove("role");
    Cookies.remove("userId");
  },
}));

export default authStore;
