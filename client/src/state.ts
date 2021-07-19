
import { atom, selector } from "recoil";

interface IUsersSettings {
  id: null | string;
  peerId: null | string;
  isStreaming: boolean;
  stream: MediaStream | undefined;
}

export const peersAtom = atom({
  key: "peers",
  default: [],
});

export const peerStreamSetSelector = selector({
  key: 'setPeerStream',
  get: ({ get }) => get(peersAtom),
  set: ({set, get}, input: any) => {
    const currentState: any = get(peersAtom);
    const index = currentState.findIndex((item: any) => item.peerId === input.peerId);

    if (index < 0) {
      return;
    }

    const cloned = JSON.parse(JSON.stringify(currentState));
    cloned[index].stream = input.stream;
    cloned[index].isStreaming = true

    set(peersAtom, cloned);

  }
});

export const initialUserSettings: IUsersSettings = {
  id: null,
  peerId: null,
  isStreaming: false,
  stream: undefined
}

export const userSettingsAtom = atom({
  key: "userSettings",
  default: initialUserSettings,
});

// Test a write updater selector
// @ts-ignore
export const userInfoSelector = selector({
  key: 'userSettingsSelector',
  get: ({ get }) => get(userSettingsAtom),
  set: ({set, get}, newValue: any) => {
    const currentState = get(userSettingsAtom);
    set(userSettingsAtom, {
      ...currentState,
      ...newValue
    })
  }
});
