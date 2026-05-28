import { createContext, useState } from "react";
import { publicApi } from "../services/publicApi";

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  departamento?: string;
  puesto?: string;
}

export interface AuthContextType {
  token: string | null;
  usuario: Usuario | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  const [usuario, setUsuario] = useState<Usuario | null>(
    localStorage.getItem("usuario")
      ? JSON.parse(localStorage.getItem("usuario")!)
      : null,
  );

  async function login(email: string, password: string) {
    const res = await publicApi.post("/auth/login", { email, password });
    const { access_token } = res.data;
    const payload = JSON.parse(atob(access_token.split(".")[1]));

    const usuario = {
      id: payload.sub,
      email: payload.email,
      nombre: payload.email,
    };

    localStorage.setItem("token", access_token);
    localStorage.setItem("usuario", JSON.stringify(usuario));

    setToken(access_token);
    setUsuario(usuario);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setToken(null);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
