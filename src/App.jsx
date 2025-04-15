import { useState, useEffect } from "react";
import LetterForm from "./LetterForm";
import LetterFeed from "./LetterFeed";
import { db } from "./firebase";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

export default function App() {
  const [letters, setLetters] = useState([]);

  // Fetch letters from Firestore on component mount
  useEffect(() => {
    const fetchLetters = async () => {
      const q = query(collection(db, "letters"), orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetched = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        setLetters(fetched)
      })
      return () => unsubscribe()
    };

    fetchLetters();
  }, []);

  // Handle form submission and save to Firestore
  const handleSubmit = async (newLetter) => {
    const docRef = await addDoc(collection(db, "letters"), {
      ...newLetter,
      timestamp: new Date(),
    });
    setLetters([{ id: docRef.id, ...newLetter }, ...letters]);
  };

  return (
    <div className="min-h-screen px-4 sm:px-8 py-10 bg-gradient-to-br from-pink-100 via-blue-100 to-purple-200 flex flex-col items-center justify-center overflow-x-hidden">
      <div className="w-full max-w-xl lg:max-w-3xl space-y-6">
        <img
          src="/logo.png"
          alt="Pofcloudia Logo"
          className="w-32 mx-auto mb-4 rounded-xl shadow"
        />
        <h1 className="text-4xl font-bold text-purple-700 text-center mb-6">
          Pofcloudia: Public Letters
        </h1>

        <div className="w-full space-y-6">
          <LetterForm onSubmit={handleSubmit} />
          <LetterFeed letters={letters} />
        </div>
      </div>
    </div>
  );
}
