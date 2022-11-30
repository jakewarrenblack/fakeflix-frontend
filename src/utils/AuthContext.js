import {createContext} from "react";

// We'll use this globally, throughout the application
export const AuthContext = createContext({
    token: null,
    setToken: () => {},
});