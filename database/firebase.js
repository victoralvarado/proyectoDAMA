import firebase from 'firebase/compat/app';
import firestore from 'firebase/firestore'
import "firebase/compat/auth"
import "firebase/compat/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBXWfcfDeESS3MZDV-XA7IIVYCf6mWtmuY",
    authDomain: "reservacionrn.firebaseapp.com",
    projectId: "reservacionrn",
    storageBucket: "reservacionrn.appspot.com",
    messagingSenderId: "706451837176",
    appId: "1:706451837176:web:8fe0fddbb8560385b96b0d"
  };

firebase.initializeApp(firebaseConfig);
firebase.firestore();
export default firebase;