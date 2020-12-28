const firebase = window.firebase;
const firestore = firebase.firestore();
const auth = firebase.auth();

async function getUid() {
  const credentials = await auth.signInAnonymously();
  return credentials.user.uid;
}

async function makeRoom() {
  const roomId = Array.from({ length: 6 })
    .map(() => Math.floor(Math.random() * 10))
    .join("");
  const roomRef = firestore.collection("rooms").doc(roomId);
  const room = await roomRef.get();
  if (room.exists) {
    return makeRoom();
  }
  const uid = await getUid();
  await roomRef.set({
    hostId: uid,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });
  return { roomId };
}

async function makeGuest({ roomId, yourName }) {
  const roomRef = firestore.collection("rooms").doc(roomId);
  const room = await roomRef.get();
  if (!room.exists) {
    return { isSuccess: false, message: "Room does not exist" };
  }
  const uid = await getUid();
  await roomRef
    .collection("guests")
    .doc(uid)
    .set({ name: yourName, buzzed: null });
  return { isSuccess: true, yourId: uid };
}

async function buzz({ roomId, yourId }) {
  return await firestore
    .collection("rooms")
    .doc(roomId)
    .collection("guests")
    .doc(yourId)
    .update({ buzzed: firebase.firestore.FieldValue.serverTimestamp() });
}

async function clearBuzzers({ roomId }) {
  const guests = await firestore
    .collection("rooms")
    .doc(roomId)
    .collection("guests")
    .get();
  const batch = firestore.batch();
  guests.docs.map((guest) => batch.update(guest.ref, { buzzed: null }));
  return await batch.commit();
}

export function handleEffect(effect, dispatch) {
  const { type, payload } = effect;
  switch (type) {
    case "firestore":
      {
        const { method, params, callback } = payload;
        let action;
        switch (method) {
          case "makeRoom":
            action = makeRoom(params);
            break;
          case "makeGuest":
            action = makeGuest(params);
            break;
          case "buzz":
            action = buzz(params);
            break;
          case "clearBuzzers":
            action = clearBuzzers(params);
            break;
          default:
            throw Error(`Cannot access firebase method ${method}`);
        }
        action.then((result) =>
          callback ? dispatch({ type: callback, payload: result }) : null
        );
      }
      return;
    case "playSound":
      new Audio("/audio/buzzer.mp3").play();
      return;
    case "alert":
      alert(payload);
      return;
    default:
      throw Error(`Cannot execute effect of type ${type}`);
  }
}

export function watchBuzzers(roomId, callback) {
  function onSnapshot(guests) {
    callback(
      guests.docs.map((x) => {
        const id = x.id;
        const { name, buzzed } = x.data();
        return { id, name, buzzed: buzzed?.toMillis() };
      })
    );
  }
  return firestore
    .collection("rooms")
    .doc(roomId)
    .collection("guests")
    .onSnapshot(onSnapshot);
}
