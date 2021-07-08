
import { atom } from "recoil";

interface IUsersSettings {
  id: null | string;
  isStreaming: boolean;
  stream: MediaStream | undefined;
}

export const initialUserSettings: IUsersSettings = {
  id: null,
  isStreaming: false,
  stream: undefined
}

export const userSettingsAtom = atom({
  key: "userSettings",
  default: initialUserSettings,
});

export const peersAtom = atom({
  key: "peers",
  default: {},
});