import axios from 'axios'; // Importar axios para setar o header padrao
import React, { createContext, useContext, useState } from 'react';

interface User {
  nome: string;
  email: string;
  cargo: string; // Vamos mapear 'perfil' para cá
  token: string; // <--- NOVO: Guardar o JWT
}

interface UserContextData {
  user: User | null;
  loginUser: (userData: User) => void;
  logoutUser: () => void;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const loginUser = (userData: User) => {
    setUser(userData);
    
    // DICA DE OURO: 
    // Já deixamos o token configurado para todas as próximas chamadas do Axios
    if (userData.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    }
  };

  const logoutUser = () => {
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);