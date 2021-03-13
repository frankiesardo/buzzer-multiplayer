import { createHashHistory } from "history";
import reducer from "./reducer";

const history = createHashHistory();

export function urlEffect({ onSet, setSelf }) {
  onSet(({ effects }) => {
    const toExecute = effects.filter((e) => e.type === "url");
    if (!toExecute.length) {
      return;
    }

    const dispatch = (action) => {
      setSelf((previousValue) => ({
        ...previousValue,
        ...reducer(previousValue, action),
      }));
    };

    setSelf(({ db, effects }) => ({
      db,
      effects: effects.filter((e) => e.type !== "url"),
    }));

    toExecute.forEach((e) => {
      history.push(e.payload);
      if (e.callback) {
        dispatch({ type: e.callback });
      }
    });
  });
}

export function playSoundEffect({ onSet, setSelf }) {
  onSet(({ effects }) => {
    const toExecute = effects.filter((e) => e.type === "playSound");
    if (!toExecute.length) {
      return;
    }

    setSelf(({ db, effects }) => ({
      db,
      effects: effects.filter((e) => e.type !== "playSound"),
    }));
    toExecute.forEach((e) => {
      new Audio(e.payload).play();
    });
  });
}

export function shareEffect({ onSet, setSelf }) {
  onSet(({ effects }) => {
    const toExecute = effects.filter((e) => e.type === "share");
    if (!toExecute.length) {
      return;
    }

    setSelf(({ db, effects }) => ({
      db,
      effects: effects.filter((e) => e.type !== "share"),
    }));
    toExecute.forEach((e) => {
      navigator.share(e.payload);
    });
  });
}

const firebase = window.firebase;
const firestore = firebase.firestore();
const auth = firebase.auth();

async function getUid() {
  const credentials = await auth.signInAnonymously();
  return credentials.user.uid;
}

async function createRoom() {
  const roomId = Array.from({ length: 6 })
    .map(() => Math.floor(Math.random() * 10))
    .join("");
  const roomRef = firestore.collection("rooms").doc(roomId);
  const room = await roomRef.get();
  if (room.exists) {
    return createRoom();
  }
  const uid = await getUid();
  await roomRef.set({
    hostId: uid,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });
  return { success: true, roomId };
}

async function setupGuest({ roomId }) {
  const roomRef = firestore.collection("rooms").doc(roomId);
  const room = await roomRef.get();
  if (!room.exists) {
    return {
      success: false,
      message: "Room does not exist. Check you've got the correct link.",
    };
  }
  const userId = await getUid();
  const guestRef = roomRef.collection("guests").doc(userId);
  const guest = await guestRef.get();
  if (!guest.exists) {
    await guestRef.set({ name: randomMoniker(), buzzed: null, score: 0 });
  }

  return { success: true, userId };
}

async function setupHost({ roomId }) {
  const roomRef = firestore.collection("rooms").doc(roomId);
  const room = await roomRef.get();
  if (!room.exists) {
    return {
      success: false,
      message: "Room does not exist. Create one first.",
    };
  }

  const userId = await getUid();
  if (room.data().hostId !== userId) {
    return {
      success: false,
      message: "Room is already owned by another user. Create another one.",
    };
  }

  return { success: true, userId };
}

async function buzz({ roomId, userId }) {
  return await firestore
    .collection("rooms")
    .doc(roomId)
    .collection("guests")
    .doc(userId)
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

async function editName({ roomId, userId, name }) {
  await firestore
    .collection("rooms")
    .doc(roomId)
    .collection("guests")
    .doc(userId)
    .update({ name });
}

async function editScore({ roomId, userId, score }) {
  await firestore
    .collection("rooms")
    .doc(roomId)
    .collection("guests")
    .doc(userId)
    .update({ score });
}

export function firestoreEffect({ onSet, setSelf }) {
  onSet(({ effects }) => {
    const toExecute = effects.filter((e) => e.type === "firestore");
    if (!toExecute.length) {
      return;
    }

    setSelf(({ db, effects }) => ({
      db,
      effects: effects.filter((e) => e.type !== "firestore"),
    }));

    const dispatch = (action) => {
      setSelf((previousValue) => ({
        ...previousValue,
        ...reducer(previousValue, action),
      }));
    };

    toExecute.forEach((e) => {
      const { method, params, callback } = e.payload;
      let action;
      switch (method) {
        case "setupGuest":
          action = setupGuest(params);
          break;
        case "setupHost":
          action = setupHost(params);
          break;
        case "createRoom":
          action = createRoom(params);
          break;
        case "buzz":
          action = buzz(params);
          break;
        case "clearBuzzers":
          action = clearBuzzers(params);
          break;
        case "editName":
          action = editName(params);
          break;
        case "editScore":
          action = editScore(params);
          break;
        default:
          throw Error(`Cannot execute firestore method ${method}`);
      }
      action.then((result) =>
        callback ? dispatch({ type: callback, payload: result }) : null
      );
    });
  });
}

export function subscribe(roomId, callback) {
  function onSnapshot(guests) {
    callback(
      guests.docs.map((x) => {
        const id = x.id;
        const { name, buzzed, score } = x.data();
        return { id, name, score, buzzed: buzzed?.toMillis() };
      })
    );
  }
  return firestore
    .collection("rooms")
    .doc(roomId)
    .collection("guests")
    .onSnapshot(onSnapshot);
}

const animals = [
  "Alligator",
  "Anteater",
  "Armadillo",
  "Auroch",
  "Axolotl",
  "Badger",
  "Bat",
  "Bear",
  "Beaver",
  "Blobfish",
  "Buffalo",
  "Camel",
  "Chameleon",
  "Cheetah",
  "Chinchilla",
  "Chipmunk",
  "Chupacabra",
  "Cormorant",
  "Coyote",
  "Crow",
  "Dingo",
  "Dinosaur",
  "Dog",
  "Dolphin",
  "Dragon",
  "Duck",
  "Elephant",
  "Ferret",
  "Fox",
  "Frog",
  "Giraffe",
  "Goose",
  "Gopher",
  "Grizzly",
  "Hamster",
  "Hedgehog",
  "Hippo",
  "Hyena",
  "Ibex",
  "Ifrit",
  "Iguana",
  "Jackal",
  "Jackalope",
  "Kangaroo",
  "Kiwi",
  "Koala",
  "Kraken",
  "Lemur",
  "Leopard",
  "Liger",
  "Lion",
  "Llama",
  "Manatee",
  "Mink",
  "Monkey",
  "Moose",
  "Narwhal",
  "Octopus",
  "Orangutan",
  "Otter",
  "Panda",
  "Penguin",
  "Platypus",
  "Python",
  "Quagga",
  "Quokka",
  "Rabbit",
  "Raccoon",
  "Rhino",
  "Sheep",
  "Shrew",
  "Skunk",
  "Squirrel",
  "Tiger",
  "Turtle",
  "Unicorn",
  "Walrus",
  "Wolf",
  "Wolverine",
  "Wombat",
];

function randomMoniker() {
  const anim = animals[(animals.length * Math.random()) | 0];
  return `Guest ${anim}`;
}
