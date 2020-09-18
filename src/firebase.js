import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBxGtKBKEwW-xDKnTieng3zhP279nqxxmM",
  authDomain: "whatsapp-clone-25743.firebaseapp.com",
  databaseURL: "https://whatsapp-clone-25743.firebaseio.com",
  projectId: "whatsapp-clone-25743",
  storageBucket: "whatsapp-clone-25743.appspot.com",
  messagingSenderId: "275105372553",
  appId: "1:275105372553:web:344b93bf51911f2b58a958",
  measurementId: "G-JNYCR3TMZE",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
