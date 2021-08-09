import firebase from "firebase";
const firebaseApp = firebase.initializeApp ({

   
  apiKey: "AIzaSyAG9Me_EPz1dIv6l-7P6RQiYzWs_DY6Ens",
  authDomain: "instagram-clone-e23df.firebaseapp.com",
  projectId: "instagram-clone-e23df",
  storageBucket: "instagram-clone-e23df.appspot.com",
  messagingSenderId: "157520763053",
  appId: "1:157520763053:web:d31d18e290f2ad1292ce24",
  measurementId: "G-J1GEBNGZC3"


}
   
);

  const db=firebaseApp.firestore();
  const auth=firebase.auth();
  const storage=firebase.storage();
  export {db, auth, storage};