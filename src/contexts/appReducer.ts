/* eslint-disable indent */
import { TrackPlaylist } from "@/types";
import {
  SET_AUTH,
  SET_ONBOARDING,
  ADD_PLAYLIST,
  REMOVE_PLAYLIST,
  RESET_PLAYLIST,
  SET_SEARCH,
  TAppActions
} from "./appAction";
import { IAppState } from "./appState";

const appReducer = (state: IAppState, action: TAppActions): IAppState => {
  switch (action.type) {
    case SET_AUTH:
    case SET_ONBOARDING:
      return { ...state, ...(action.payload as IAppState) };
    case SET_SEARCH:
      return { ...state, search: action.payload as string };
    case ADD_PLAYLIST:
      return {
        ...state,
        playlist: state.playlist
          ? [...state.playlist, action.payload as TrackPlaylist]
          : [action.payload as TrackPlaylist]
      };

    case RESET_PLAYLIST:
      return { ...state, playlist: [] };

    case REMOVE_PLAYLIST:
      return {
        ...state,
        playlist: state.playlist?.filter(
          (item) => item.id !== (action.payload as string)
        )
      };

    default:
      return state;
  }
};

export default appReducer;
