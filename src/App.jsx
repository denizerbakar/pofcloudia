import { useState, useEffect } from "react";
import LetterForm from "./LetterForm";
import LetterFeed from "./LetterFeed";
import { db } from "./firebase";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import Map from "./components/Map";

export default function App() {
  const [letters, setLetters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);

  // Fetch letters from Firestore on component mount
  useEffect(() => {
    const fetchLetters = async () => {
      const q = query(collection(db, "letters"), orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched letters:", fetched); // Debugging
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 via-blue-100 to-purple-200 overflow-x-hidden">
      {/* Top Section */}
      <div className="flex flex-col items-center justify-start flex-grow-0 py-6">
        <img
          src="/logo.png"
          alt="Pofcloudia Logo"
          className="w-32 mb-4 rounded-xl shadow"
        />
        <h1 className="text-4xl font-bold text-purple-700 text-center mb-6">
          Pofcloudia: Public Letters
        </h1>

        {/* Button to open the modal */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700"
        >
          ✍️ Write a Letter
        </button>
      </div>

      {/* Globe Section */}
      <div className="flex-grow flex items-center justify-center">
      <Map letters={letters} setSelectedLetter={setSelectedLetter} />
      </div>

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
          onSubmit={async (newLetter) => {
            await handleSubmit(newLetter);
            setShowModal(false);
          }}
        />
      </motion.div>
    </motion.div>
  )}

  {/* Modal for Selected Letter */}
  {selectedLetter && (
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
          onClick={() => setSelectedLetter(null)}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-purple-700 mb-4">
          {selectedLetter.name} from {selectedLetter.location}
        </h2>
        <p className="text-gray-700 italic mb-4">"{selectedLetter.content}"</p>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
}