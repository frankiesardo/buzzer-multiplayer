import { atom, selector } from "recoil";

export const initialState = {
  db: {
    page: "home",
  },
  effects: [],
};

export const appAtom = atom({
  key: "appAtom",
  default: initialState,
});

export const effectsView = selector({
  key: "effectsView",
  get: ({ get }) => get(appAtom).effects,
});

export const firstEffectView = selector({
  key: "firstEffectView",
  get: ({ get }) => get(effectsView)[0],
  set: ({ set }) =>
    set(appAtom, ({ effects, ...state }) => {
      const [, ...otherEffects] = effects;
      return { ...state, effects: otherEffects };
    }),
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
      ?.filter(hasBuzzed)
      .sort((a, b) => a.buzzed - b.buzzed) || [],
});

export const guestWhoDidNotBuzzListView = selector({
  key: "guestWhoDidNotBuzzListView",
  get: ({ get }) =>
    get(guestListView)
      ?.filter((x) => !hasBuzzed(x))
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

function reducer({ db, effects }, { type, payload }) {
  switch (type) {
    case "updateInputRoomId":
      return { db: { ...db, roomId: payload } };
    case "updateInputYourName":
      return { db: { ...db, yourName: payload } };
    case "backToHome":
      return { db: { page: "home" } };
    case "watchBuzzersResult": {
      const previousBuzz = !!db.guests?.filter(hasBuzzed).length;
      const currentBuzz = !!payload.filter(hasBuzzed).length;
      const shouldPlayShound =
        db.page === "host" && !previousBuzz && currentBuzz;
      const newEffects = shouldPlayShound
        ? [...effects, { type: "playSound" }]
        : effects;
      return {
        db: { ...db, guests: payload },
        effects: newEffects,
      };
    }
    case "clearBuzzers": {
      const roomId = db.roomId;
      return {
        effects: [
          ...effects,
          {
            type: "firestore",
            payload: { method: "clearBuzzers", params: { roomId } },
          },
        ],
      };
    }
    case "buzz": {
      const { roomId, yourId } = db;
      return {
        effects: [
          ...effects,
          {
            type: "firestore",
            payload: { method: "buzz", params: { roomId, yourId } },
          },
          { type: "playSound" },
        ],
      };
    }
    case "makeRoom":
      return {
        effects: [
          ...effects,
          {
            type: "firestore",
            payload: { method: "makeRoom", callback: "makeRoomResult" },
          },
        ],
      };
    case "makeRoomResult":
      return { db: { ...db, roomId: payload.roomId, page: "host" } };
    case "makeGuest":
      return {
        effects: [
          ...effects,
          {
            type: "firestore",
            payload: {
              method: "makeGuest",
              params: { roomId: db.roomId, yourName: db.yourName },
              callback: "makeGuestResult",
            },
          },
        ],
      };
    case "makeGuestResult":
      return payload.isSuccess
        ? { db: { ...db, yourId: payload.yourId, page: "join" } }
        : {
            effects: [...effects, { type: "alert", payload: payload.message }],
          };
    default:
      throw Error(`Cannot perform action of type ${type}`);
  }
}

function hasBuzzed(guest) {
  return !!guest.buzzed;
}
