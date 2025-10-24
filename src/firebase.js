import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC8EWET-C6fy70_tid1iu-wAEoHq0mq1uI",
  authDomain: "estoque-almoxarifado-perfilx.firebaseapp.com",
  projectId: "estoque-almoxarifado-perfilx",
  storageBucket: "estoque-almoxarifado-perfilx.firebasestorage.app",
  messagingSenderId: "883965963689",
  appId: "1:883965963689:web:4fd7d30d235c25700b68b8",
  measurementId: "G-VTZJ2PQB2E"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
