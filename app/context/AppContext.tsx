'use client';

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
  useState,
} from 'react';

// Tipos para o estado global
interface AppState {
  isLoading: boolean;
  error: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  syncStatus: {
    lastSync: Date | null;
    isRunning: boolean;
    progress: number;
  };
}

// Ações disponíveis
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: AppState['user'] }
  | { type: 'SET_SYNC_STATUS'; payload: Partial<AppState['syncStatus']> }
  | { type: 'RESET_STATE' };

// Estado inicial
const initialState: AppState = {
  isLoading: false,
  error: null,
  user: null,
  syncStatus: {
    lastSync: null,
    isRunning: false,
    progress: 0,
  },
};

// Reducer para gerenciar o estado
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_SYNC_STATUS':
      return {
        ...state,
        syncStatus: { ...state.syncStatus, ...action.payload },
      };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

// Contexto com valor padrão para SSR
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => {},
});

// Provider com verificação de hidratação
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Durante SSR, retorna o estado inicial
  if (!isHydrated) {
    return (
      <AppContext.Provider value={{ state: initialState, dispatch: () => {} }}>
        {children}
      </AppContext.Provider>
    );
  }

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook para usar o contexto com verificação de hidratação
export function useApp() {
  const context = useContext(AppContext);

  // Verificação adicional para garantir que estamos no cliente
  if (typeof window === 'undefined') {
    return { state: initialState, dispatch: () => {} };
  }

  return context;
}

// Hooks específicos para facilitar o uso
export function useLoading() {
  const { state, dispatch } = useApp();
  return {
    isLoading: state.isLoading,
    setLoading: (loading: boolean) =>
      dispatch({ type: 'SET_LOADING', payload: loading }),
  };
}

export function useError() {
  const { state, dispatch } = useApp();
  return {
    error: state.error,
    setError: (error: string | null) =>
      dispatch({ type: 'SET_ERROR', payload: error }),
    clearError: () => dispatch({ type: 'SET_ERROR', payload: null }),
  };
}

export function useSyncStatus() {
  const { state, dispatch } = useApp();
  return {
    syncStatus: state.syncStatus,
    setSyncStatus: (status: Partial<AppState['syncStatus']>) =>
      dispatch({ type: 'SET_SYNC_STATUS', payload: status }),
  };
}
