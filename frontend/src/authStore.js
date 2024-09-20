import { create } from "zustand";
import Cookies from "js-cookie";

const authStore = create((set) => ({
  authenticated: !!Cookies.get("session") && !!Cookies.get("userId"),

  checkAuth: () => {
    const session = Cookies.get("session");
    if (session) {
      set({ authenticated: true });
    } else {
      set({ authenticated: false });
    }
  },

  getSessionCookie: () => {
    const session = Cookies.get("session");
    return session || null;
  },

  getUserRole: () => {
    const userRole = Cookies.get("role");
    return userRole || null;
  },

  getUserId: () => {
    const userId = Cookies.get("userId");
    return userId || null;
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
