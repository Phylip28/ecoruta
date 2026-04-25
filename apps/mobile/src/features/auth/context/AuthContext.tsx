import { createContext, useContext, useState, type ReactNode } from "react";

export type UserRole = "ciudadano" | "reciclador";

type AuthState = {
  role: UserRole | null;
  login: (role: UserRole) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState>({
  role: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);

  function login(selectedRole: UserRole) {
    setRole(selectedRole);
  }

  function logout() {
    setRole(null);
  }

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
