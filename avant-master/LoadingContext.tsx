// context/LoadingContext.tsx
import { router } from 'expo-router';
import React, { createContext, useContext, useState } from 'react';
import LoadingScreen from './components/ui/LoadingScreen'; // Ajuste o caminho se necessário

type LoadingContextType = {
  showLoading: (path: string) => void;
  isLoading: boolean;
};

const LoadingContext = createContext<LoadingContextType>({} as LoadingContextType);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  // Função mágica que ativa o loading, espera, e depois navega
  const showLoading = (path: string) => {
    setIsLoading(true);
    
    // Tempo falso de carregamento (1.5 segundos) para dar o efeito
    setTimeout(() => {
      // Navega para a nova página
      router.push(path as any);
      
      // Espera um pouquinho para desmontar o loading suavemente
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }, 1500);
  };

  return (
    <LoadingContext.Provider value={{ showLoading, isLoading }}>
      {children}
      {/* Se isLoading for true, mostra a tela por cima de tudo */}
      {isLoading && <LoadingScreen />}
    </LoadingContext.Provider>
  );
}

// Hook para usar fácil nas outras páginas
export const useLoading = () => useContext(LoadingContext);