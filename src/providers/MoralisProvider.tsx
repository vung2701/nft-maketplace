import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeMoralis, isMoralisInitialized } from '../config/moralis';

interface MoralisContextType {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

const MoralisContext = createContext<MoralisContextType | undefined>(undefined);

interface MoralisProviderProps {
  children: React.ReactNode;
}

export const MoralisProvider: React.FC<MoralisProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initMoralis = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await initializeMoralis();
      setIsInitialized(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Moralis';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const retry = () => {
    initMoralis();
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      if (isMounted) {
        await initMoralis();
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  const value: MoralisContextType = {
    isInitialized,
    isLoading,
    error,
    retry
  };

  return <MoralisContext.Provider value={value}>{children}</MoralisContext.Provider>;
};

export const useMoralisContext = (): MoralisContextType => {
  const context = useContext(MoralisContext);
  if (context === undefined) {
    throw new Error('useMoralisContext must be used within a MoralisProvider');
  }
  return context;
};
