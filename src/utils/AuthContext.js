import {createContext} from "react";

// We'll use this globally, throughout the application
export const AuthContext = createContext({
    loading: true,
    setLoading: () => {},

    token: null,
    setToken: () => {},

    user: null,
    setUser: ({}) => {},
});

