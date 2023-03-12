import { TrackPlaylist, User } from "@/types";

export interface IAppState {
  user?: User | null;
  token?: string;
  onboarding?: string;
  search?: string;
  playlist?: TrackPlaylist[];
}

export const initialAppState: IAppState = {
  token: "",
  user: null,
  onboarding: "",
  search: "",
  playlist: []
};
