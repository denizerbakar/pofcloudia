import { useState, useEffect } from "react";
import LetterForm from "./LetterForm";
import LetterFeed from "./LetterFeed";
import { db } from "./firebase";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [letters, setLetters] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Fetch letters from Firestore on component mount
  useEffect(() => {
    const fetchLetters = async () => {
      const q = query(collection(db, "letters"), orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLetters(fetched);
      });
      return () => unsubscribe();
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
          {/* Button to open the modal */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 mx-auto block"
          >
            ✍️ Write a Letter
          </button>

          {/* Modal with animation */}
          <AnimatePresence>
            {showModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 40, opacity: 0 }}
                  transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                  className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl relative"
                >
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                  >
                    &times;
                  </button>
                  <LetterForm
                    onSubmit={(data) => {
                      handleSubmit(data);
                      setShowModal(false);
                    }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Letter Feed */}
          <LetterFeed letters={letters} />
        </div>
      </div>
    </div>
  );
}
