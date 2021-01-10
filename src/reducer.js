export default function reducer({ db, effects }, { type, payload }) {
  switch (type) {
    case "updateInputRoomId":
      return { db: { ...db, roomId: payload } };
    case "updateInputYourName":
      return { db: { ...db, yourName: payload } };
    case "backToHome":
      return { db: { page: "home" } };
    case "watchBuzzersResult": {
      const previousBuzz = !!db.guests?.filter((x) => !!x.buzzed).length;
      const currentBuzz = !!payload.filter((x) => !!x.buzzed).length;
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
          { type: "playSound", payload: "/audio/buzzer.mp3" },
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
