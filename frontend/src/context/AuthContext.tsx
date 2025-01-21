import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { api } from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, senha: string, setError: React.Dispatch<React.SetStateAction<string | null>>, twoFACode?: string,) => Promise<void>;
  register: (data: RegisterData, setError: React.Dispatch<React.SetStateAction<string | null>>) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      api.defaults.headers.Authorization = `Bearer ${token}`;
    }
  }, []);

  async function login(email: string, senha: string, setError: React.Dispatch<React.SetStateAction<string | null>>, token2fa?: string): Promise<any> {
    try {
      const response = await api.post("/auth/login", { email, senha, token2fa });

      if (response.data.message == "Login realizado com sucesso!") {
        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        api.defaults.headers.Authorization = `Bearer ${token}`;
        setUser(user);
      }

      return response.data.message || "Login bem-sucedido";
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);

      if (error.response && error.response.data && error.response.data.message) {
        if (error.response.data.message != "Código de 2FA obrigatório.") {
          setError(error.response.data.message)
        }
        return error.response.data.message;
      } else {
        return "Erro desconhecido ao fazer login";
      }
    }
  }

  async function register(data: RegisterData, setError: React.Dispatch<React.SetStateAction<string | null>>) {
    try {
      const response = await api.post("/auth/register", data);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message)

        return error.response.data.message;
      } else {
        return "Erro desconhecido ao fazer o registro.";
      }
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.Authorization;
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}