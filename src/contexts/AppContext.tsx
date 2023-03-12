import React, {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState
} from "react";

import { User } from "@/types";

import { getItem } from "../utils/local-storage";
import { setAuth, setOnboarding, TAppActions } from "./appAction";
import appReducer from "./appReducer";
import { IAppState, initialAppState } from "./appState";

export interface IAppProviderProps {
  children: ReactNode;
}

export interface IAppContext {
  appState: IAppState;
  appDispatch: Dispatch<TAppActions>;
  isLoading: boolean;
  isAuthenticated: boolean;
  isLoadingOnboarding: boolean;
}

const AppContext = createContext<IAppContext>({
  appState: initialAppState,
  appDispatch: () => null,
  isLoading: true,
  isAuthenticated: false,
  isLoadingOnboarding: true
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }: IAppProviderProps) => {
  const [appState, appDispatch] = useReducer(appReducer, initialAppState);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = appState.token ? true : false;

  const [isLoadingOnboarding, setIsLoadingOnboarding] = useState(true);

  useEffect(() => {
    const token = getItem("token");
    const user = getItem("user") as User;

    if (!(token === null || token === undefined)) {
      appDispatch(
        setAuth({
          token,
          user
        })
      );
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const onboardingApp = getItem("onboarding");

    if (onboardingApp) {
      appDispatch(setOnboarding(onboardingApp));
    }
    setIsLoadingOnboarding(false);
  }, []);

  return (
    <AppContext.Provider
      value={{
        appState,
        appDispatch,
        isLoading,
        isAuthenticated,
        isLoadingOnboarding
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
