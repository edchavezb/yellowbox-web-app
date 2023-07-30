import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

let appConfig;

if (process.env.REACT_APP_FIREBASE_CONFIG) {
  appConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG);
}

const app = initializeApp(appConfig);

export const firebaseAuth = getAuth();
export default app;