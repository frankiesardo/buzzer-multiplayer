import reducer from "./reducer";
import {
  firestoreEffect,
  urlEffect,
  playSoundEffect,
  shareEffect,
} from "./effects";
import { atom, selector } from "recoil";
import { matchPath } from "react-router";

const initialPath = matchPath(window.location.hash, {
  path: "#/:action/:roomId",
});

const initialState = {
  db: { roomId: initialPath ? initialPath.params.roomId : undefined },
  effects: [],
};

export const appAtom = atom({
  key: "appAtom",
  default: initialState,
  effects_UNSTABLE: [firestoreEffect, urlEffect, playSoundEffect, shareEffect],
});

export const dbView = selector({
  key: "dbView",
  get: ({ get }) => get(appAtom).db,
});

export const roomIdView = selector({
  key: "roomIdView",
  get: ({ get }) => get(dbView).roomId,
});

export const userIdView = selector({
  key: "userIdView",
  get: ({ get }) => get(dbView).userId,
});

export const userTypeView = selector({
  key: "userTypeView",
  get: ({ get }) => get(dbView).userType,
});

export const guestListView = selector({
  key: "guestListView",
  get: ({ get }) => get(dbView).guestList,
});

export const guestInfoView = selector({
  key: "guestInfoView",
  get: ({ get }) => {
    const userId = get(userIdView);
    return get(guestListView)?.find((x) => x.id === userId);
  },
});

export const hostInfoView = selector({
  key: "hostInfoView",
  get: ({ get }) => ({ canClear: !!get(guestWhoBuzzedListView).length }),
});

export const errorView = selector({
  key: "errorView",
  get: ({ get }) => get(dbView).error,
});

export const guestWhoBuzzedListView = selector({
  key: "guestWhoBuzzedListView",
  get: ({ get }) =>
    get(guestListView)
      ?.filter((x) => !!x.buzzed)
      .sort((a, b) => a.buzzed - b.buzzed) || [],
});

export const guestWhoDidNotBuzzListview = selector({
  key: "guestWhoDidNotBuzzListView",
  get: ({ get }) =>
    get(guestListView)
      ?.filter((x) => !x.buzzed)
      .sort((a, b) => {
        if (a.score > b.score) return -1;
        if (a.score < b.score) return 1;
        return a.name.localeCompare(b.name);
      }) || [],
});

export const dialogOpenView = selector({
  key: "dialogOpenView",
  get: ({ get }) => get(dbView).dialog?.open ?? false,
});

export const dialogIdxView = selector({
  key: "dialogIdxView",
  get: ({ get }) => get(dbView).dialog?.idx,
});

export const editGuestView = selector({
  key: "editGuestView",
  get: ({ get }) => {
    const idx = get(dialogIdxView);
    return get(guestListView)?.find((x) => x.id === idx);
  },
});

export const appReducer = selector({
  key: "appReducer",
  get: ({ get }) => get(appAtom),
  set: ({ set }, action) =>
    set(appAtom, (previousValue) => ({
      ...previousValue,
      ...reducer(previousValue, action),
    })),
});
