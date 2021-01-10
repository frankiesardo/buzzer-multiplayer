import reducer from "./reducer.js";
import {
  logEffect,
  firestoreEffect,
  alertEffect,
  playSoundEffect,
} from "./effects.js";
import { atom, selector } from "recoil";

const initialState = {
  db: {
    page: "home",
  },
  effects: [],
};

export const appAtom = atom({
  key: "appAtom",
  default: initialState,
  effects_UNSTABLE: [logEffect, firestoreEffect, alertEffect, playSoundEffect],
});

export const dbView = selector({
  key: "dbView",
  get: ({ get }) => get(appAtom).db,
});

export const pageView = selector({
  key: "pageView",
  get: ({ get }) => get(dbView).page,
});

export const roomIdView = selector({
  key: "roomIdView",
  get: ({ get }) => get(dbView).roomId,
});

export const yourNameView = selector({
  key: "yourNameView",
  get: ({ get }) => get(dbView).yourName,
});

export const yourIdView = selector({
  key: "yourIdView",
  get: ({ get }) => get(dbView).yourId,
});

export const guestListView = selector({
  key: "guestListView",
  get: ({ get }) => get(dbView).guests,
});

export const guestWhoBuzzedListView = selector({
  key: "guestWhoBuzzedListView",
  get: ({ get }) =>
    get(guestListView)
      ?.filter((x) => !!x.buzzed)
      .sort((a, b) => a.buzzed - b.buzzed) || [],
});

export const guestWhoDidNotBuzzListView = selector({
  key: "guestWhoDidNotBuzzListView",
  get: ({ get }) =>
    get(guestListView)
      ?.filter((x) => !x.buzzed)
      .sort((a, b) => a.name.localeCompare(b.name)) || [],
});

export const canClearBuzzersView = selector({
  key: "canClearBuzzersView",
  get: ({ get }) => !!get(guestWhoBuzzedListView).length,
});

export const hasBuzzedView = selector({
  key: "hasBuzzedView",
  get: ({ get }) => {
    const yourId = get(yourIdView);
    return !!get(guestWhoBuzzedListView).find((x) => x.id === yourId);
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
