import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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

const firebaseAppConfig = getFirebaseConfig();
const firebaseApp = initializeApp(firebaseAppConfig);
export { firebaseApp, isUserSignedIn };
