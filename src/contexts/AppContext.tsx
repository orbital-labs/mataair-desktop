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
import { ipcRenderer } from "electron";
import { Toast } from "antd-mobile";

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

  useEffect(() => {
    ipcRenderer.on("open-url", (event, arg) => {
      const url = new URL(arg);

      const payload = url.searchParams.get("payload");
      try {
        const parsedPayload = JSON.parse(payload || "{}") as {
          token: string;
          user: User;
        };
        appDispatch(
          setAuth({
            token: parsedPayload.token,
            user: parsedPayload.user
          })
        );

        Toast.show({
          content: "Login Berhasil",
          position: "bottom"
        });
      } catch (error) {
        console.error("Failed to parse payload:", error);
      }
    });
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
