import { useState, useEffect } from "react";
import LetterForm from "./LetterForm";
import { db } from "./firebase";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import Map from "./components/Map";

export default function App() {
  const [letters, setLetters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "letters"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLetters(fetched);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (newLetter) => {
    try {
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      const { latitude, longitude } = pos.coords;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await res.json();
      const locationName =
        data.address.city || data.address.town || data.address.village || data.address.county || "Unknown";

      const enrichedLetter = {
        ...newLetter,
        location: locationName,
        coords: { lat: latitude, lng: longitude },
        timestamp: new Date(),
      };

      const docRef = await addDoc(collection(db, "letters"), enrichedLetter);
      setLetters([{ id: docRef.id, ...enrichedLetter }, ...letters]);
      setShowModal(false); // Close modal after successful submit
    } catch (err) {
      console.error("Geolocation or save failed:", err);
      alert("We couldn't detect your location. Please allow location access.");
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-[300px] min-w-[280px] bg-white/90 backdrop-blur-md shadow-xl rounded-r-xl p-4 flex flex-col justify-between z-10">
        {/* Top Section */}
        <div>
          <img
            src="/logo.png"
            alt="Pofcloudia Logo"
            className="w-24 mx-auto mb-4 rounded-xl shadow"
          />
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-purple-600 text-white font-bold py-2 rounded-md hover:bg-purple-700 mb-4"
          >
            ✍️ Write a Letter
          </button>

          <hr className="border-gray-300 my-4" />

          <div className="text-black font-bold text-lg">🌤 Mood filters (coming soon)</div>
        </div>

        <div className="text-center font-semibold text-sm text-gray-700">
          🌍 Language<br />toggle (soon)
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <Map letters={letters} setSelectedLetter={setSelectedLetter} />
      </div>

      {/* View Letter Modal */}
      <AnimatePresence>
        {selectedLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl relative"
            >
              <button
                onClick={() => setSelectedLetter(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold text-purple-700 mb-2">
                {selectedLetter.name} — {selectedLetter.location}
              </h2>
              <p className="text-gray-800 italic">{selectedLetter.content}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Write a Letter Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              >
                &times;
              </button>
              <LetterForm onSubmit={handleSubmit} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
