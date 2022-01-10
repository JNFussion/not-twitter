import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYhHzuFhGkoO-YvoWIGntFdO5ajRrGQ40",
  authDomain: "not-twitter-4c059.firebaseapp.com",
  projectId: "not-twitter-4c059",
  storageBucket: "not-twitter-4c059.appspot.com",
  messagingSenderId: "208323867397",
  appId: "1:208323867397:web:847f51c4e33b327edc3d6c",
};

export default function getFirebaseConfig() {
  if (!firebaseConfig || !firebaseConfig.apiKey) {
    throw new Error(
      "No Firebase configuration object provided." +
        "\n" +
        "Add your web app's configuration object to firebase-config.js"
    );
  } else {
    return firebaseConfig;
  }
}

function isUserSignedIn() {
  return !!getAuth().currentUser;
}

async function getProfileByID(uid) {
  const docSnap = await getDoc(doc(getFirestore(), "users", uid));
  return docSnap.data();
}

/**
 *  It searchs a doc in users collection by the field and value provided.
 *  Ex: field: username, value: JNFussion;
 *
 * @param {string} field
 * @param {*} value
 * @returns data of the matching doc.
 */

async function getProfile(field, value) {
  let profile;
  const q = query(
    collection(getFirestore(), "users"),
    where(field, "==", value)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((docu) => {
    // doc.data() is never undefined for query doc snapshots
    profile = { uid: docu.id, ...docu.data() };
  });
  return profile;
}

function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem("currentUser"));
}

const firebaseAppConfig = getFirebaseConfig();
const firebaseApp = initializeApp(firebaseAppConfig);

export {
  firebaseApp,
  isUserSignedIn,
  getProfile,
  getProfileByID,
  getCurrentUser,
};
