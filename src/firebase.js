import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDRhc1a17Zrt6U6pTkdspbectXzrVxKBJk",
  authDomain: "pofcloudia.firebaseapp.com",
  databaseURL: "https://pofcloudia-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pofcloudia",
  storageBucket: "pofcloudia.firebasestorage.app",
  messagingSenderId: "989963028340",
  appId: "1:989963028340:web:de3918f2db6fa1bbd7ce21"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }
