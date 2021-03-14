export default function reducer({ db, effects }, { type, payload }) {
  switch (type) {
    case "setupGuest": {
      const { roomId } = db;
      return {
        effects: [
          ...effects,
          {
            type: "firestore",
            payload: {
              method: "setupGuest",
              params: { roomId },
              callback: "setupGuestResult",
            },
          },
        ],
      };
    }
    case "setupGuestResult": {
      const { success } = payload;
      if (!success) {
        const { message } = payload;
        return { db: { ...db, error: { message } } };
      }
      const { userId } = payload;
      return { db: { ...db, userId, userType: "guest", error: undefined } };
    }
    case "setupHost": {
      const { roomId } = db;
      return {
        effects: [
          ...effects,
          {
            type: "firestore",
            payload: {
              method: "setupHost",
              params: { roomId },
              callback: "setupHostResult",
            },
          },
        ],
      };
    }
    case "setupHostResult": {
      const { success } = payload;
      if (!success) {
        const { message } = payload;
        return { db: { ...db, error: { message } } };
      }
      const { userId } = payload;
      return { db: { ...db, userId, userType: "host", error: undefined } };
    }
    case "createRoom": {
      return {
        effects: [
          ...effects,
          {
            type: "firestore",
            payload: {
              method: "createRoom",
              callback: "createRoomResult",
            },
          },
        ],
      };
    }
    case "createRoomResult": {
      const { roomId } = payload;
      return {
        db: { ...db, roomId },
        effects: [...effects, { type: "url", payload: `/host/${roomId}` }],
      };
    }
    case "goToRoom": {
      const { roomId } = payload;
      return {
        db: { ...db, roomId },
        effects: [...effects, { type: "url", payload: `/join/${roomId}` }],
      };
    }
    case "subscriptionResult": {
      const { userType } = db;
      const { guestList } = payload;
      if (userType === "guest") {
        return { db: { ...db, guestList } };
      }

      const previousBuzz = !!db.guestList?.filter((x) => !!x.buzzed).length;
      const currentBuzz = !!guestList.filter((x) => !!x.buzzed).length;
      const shouldPlayShound = !previousBuzz && currentBuzz;
      const newEffects = shouldPlayShound
        ? [...effects, { type: "playSound", payload: "/audio/buzzer.mp3" }]
        : effects;
      return {
        db: { ...db, guestList },
        effects: newEffects,
      };
    }
    case "clearBuzzers": {
      const { roomId } = db;
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
      const { roomId, userId } = db;
      return {
        effects: [
          ...effects,
          {
            type: "firestore",
            payload: { method: "buzz", params: { roomId, userId } },
          },
          { type: "playSound", payload: "/audio/buzzer.mp3" },
        ],
      };
    }
    case "toggleDialog": {
      const { dialog } = payload;
      return {
        db: { ...db, dialog },
      };
    }
    case "editName": {
      const { name } = payload;
      const { roomId, userId } = db;
      return {
        effects: [
          ...effects,
          {
            type: "firestore",
            payload: { method: "editName", params: { roomId, userId, name } },
          },
        ],
      };
    }
    case "editScore": {
      const { id, score } = payload;
      const { roomId } = db;
      return {
        effects: [
          ...effects,
          {
            type: "firestore",
            payload: {
              method: "editScore",
              params: { roomId, userId: id, score },
            },
          },
        ],
      };
    }
    case "exit": {
      return {
        effects: [
          ...effects,
          { type: "url", payload: `/`, callback: "exitResult" },
        ],
      };
    }
    case "exitResult": {
      return {
        db: {
          ...db,
          userId: undefined,
          userType: undefined,
          guestList: undefined,
        },
      };
    }
    case "share": {
      const { roomId } = db;
      return {
        effects: [
          ...effects,
          {
            type: "share",
            payload: {
              title: "Join me in this multiplayer room",
              url: `https://buzzer-multiplayer-3e3fa.web.app/#/join/${roomId}`,
            },
          },
        ],
      };
    }
    default:
      throw Error(`Cannot execute action type ${type}`);
  }
}
