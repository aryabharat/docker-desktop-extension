import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import useInterval from 'use-interval';

import okteto, { OktetoContext } from '../api/okteto';

interface OktetoEnvironment {
  file: string
  link: string
}

interface OktetoStore {
  currentContext: OktetoContext | null
  environment: OktetoEnvironment | null
  loading: boolean
  ready: boolean

  login: () => void
  logout: () => void
  stopEnvironment: () => void,
  selectEnvironment: (f: string) => void
}

type OktetoProviderProps = {
  children?: ReactNode
};

const Okteto = createContext<OktetoStore | null>(null);

const CONTEXT_POLLING_INTERVAL = 3000;
const CLOUD_CONTEXT_NAME = 'https://cloud.okteto.com';

const OktetoProvider = ({ children } : OktetoProviderProps) => {
  const [currentContext, setCurrentContext] = useState<OktetoContext | null>(null);
  const [environment, setEnvironment] = useState<OktetoEnvironment | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const login = useCallback(() => {
    setLoading(true);
    okteto.contextUse(CLOUD_CONTEXT_NAME);
  }, [setLoading]);

  const logout = useCallback(() => {
    okteto.contextDelete(CLOUD_CONTEXT_NAME);
    setEnvironment(null);
  }, []);

  const selectEnvironment = (file: string) => {
    setEnvironment({
      file,
      link: `https://cloud.okteto.com/#/spaces/${currentContext?.namespace ?? ''}`
    });
  };

  const stopEnvironment = async () => {
    setEnvironment(null);
  };

  const refreshCurrentContext = async () => {
    const { value, error } = await okteto.contextShow();
    const isLoggedIn = !error && value?.name === CLOUD_CONTEXT_NAME;
    setCurrentContext(isLoggedIn ? value : null);
  };

  useInterval(async () => {
    await refreshCurrentContext();
    setReady(true);
  }, CONTEXT_POLLING_INTERVAL);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [currentContext]);

  return (
    <Okteto.Provider value={{
      currentContext,
      environment,
      loading,
      ready,

      login,
      logout,
      stopEnvironment,
      selectEnvironment
    }}>
      {children}
    </Okteto.Provider>
  );
};

const useOkteto = () : OktetoStore => {
  const ctx = useContext(Okteto);
  if (ctx === null) {
    throw new Error('useOkteto must be used within a OktetoProvider');
  }
  return ctx;
};

export { OktetoProvider, useOkteto };