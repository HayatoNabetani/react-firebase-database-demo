import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyANlT_YohIHm6zxnVDRm92Vw21FxyA6i94",
    authDomain: "fir-react-tutorial-ecca6.firebaseapp.com",
    projectId: "fir-react-tutorial-ecca6",
    storageBucket: "fir-react-tutorial-ecca6.appspot.com",
    messagingSenderId: "6165649891",
    appId: "1:6165649891:web:f8c42457febfb2fbe3e8d6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };