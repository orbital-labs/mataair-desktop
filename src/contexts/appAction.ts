import { TrackPlaylist } from "@/types";
import { removeItem, setItem } from "@/utils/local-storage";

import { IAppState } from "./appState";

export type TAppActionType =
  | "SET_AUTH"
  | "SET_ONBOARDING"
  | "ADD_PLAYLIST"
  | "REMOVE_PLAYLIST"
  | "RESET_PLAYLIST"
  | "SET_SEARCH";

export const SET_AUTH: TAppActionType = "SET_AUTH";
export const SET_ONBOARDING: TAppActionType = "SET_ONBOARDING";
export const ADD_PLAYLIST: TAppActionType = "ADD_PLAYLIST";
export const REMOVE_PLAYLIST: TAppActionType = "REMOVE_PLAYLIST";
export const RESET_PLAYLIST: TAppActionType = "RESET_PLAYLIST";
export const SET_SEARCH: TAppActionType = "SET_SEARCH";

export interface IAppActions {
  type: TAppActionType;
  payload?: IAppState | TrackPlaylist | string;
}

export type TAppActions = IAppActions;

export const setAuth = (param: IAppState): IAppActions => {
  if (param.token !== undefined) setItem("token", param.token);
  if (param.user) setItem("user", param.user);

  // ts-ignore
  window.electron?.login({ user: param.user, token: param.token });

  return {
    type: SET_AUTH,
    payload: param
  };
};

export const addPlaylist = (param: TrackPlaylist): IAppActions => {
  return {
    type: ADD_PLAYLIST,
    payload: param
  };
};

export const resetPlaylist = (): IAppActions => {
  return {
    type: RESET_PLAYLIST
  };
};

export const removePlaylist = (id: string): IAppActions => {
  return {
    type: REMOVE_PLAYLIST,
    payload: id
  };
};

export const setSearch = (path: string): IAppActions => {
  return {
    type: SET_SEARCH,
    payload: path
  };
};

export const setOnboarding = (param: string): IAppActions => {
  setItem("onboarding", param);
  return {
    type: SET_ONBOARDING,
    payload: {
      onboarding: param
    }
  };
};

export const logout = (): IAppActions => {
  removeItem("token");
  removeItem("user");

  return {
    type: SET_AUTH,
    payload: { user: null, token: "" }
  };
};
