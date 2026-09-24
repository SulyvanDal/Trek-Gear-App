import { createContext, useContext, useState, type ReactNode } from "react";
import type { LoginInput, RegisterInput } from "../types/api";
import { login, register } from "../api/auth";
import { getToken, removeToken, setToken } from "../lib/token";

type AuthContextValue = {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (input: LoginInput) => Promise<boolean>;
  register: (input: RegisterInput) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(getToken()?true:false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function registerUser(input: RegisterInput) {
    setLoading(true);
    setError(null);
    try {
      const token = await register(input);
      setToken(token);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      return false
    }finally{
        setLoading(false);
    }
  }
  async function loginUser(input: LoginInput) {
    setLoading(true);
    setError(null);
    try {
      const token = await login(input);
      setToken(token);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      return false;
    } finally {
      setLoading(false);
    }
  }
  
  function logout(){
    removeToken();
    setIsAuthenticated(false);
  }

  const value: AuthContextValue = {isAuthenticated, loading, error, register : registerUser, login : loginUser, logout};

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(){
    const context = useContext(AuthContext)
    if(!context){
        throw new Error ("useAuth doit être utilisé dans un AuthProvider");
    }

    return context
}
