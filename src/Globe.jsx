import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

export default function LetterGlobe({ letters }) {
  const globeRef = useRef();
  const [iconData, setIconData] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [hoveredObject, setHoveredObject] = useState(null); // Track hovered pin

  // Prepare data for globe markers
  useEffect(() => {
    const data = letters
      .filter((l) => l.coords?.lat && l.coords?.lng)
      .map((letter) => ({
        lat: letter.coords.lat,
        lng: letter.coords.lng,
        content: letter.content,
        name: letter.name,
        location: letter.location,
        imgUrl: "https://cdn-icons-png.flaticon.com/512/2950/2950741.png", // Icon for markers
      }));

    setIconData(data);
  }, [letters]);

  const handlePointClick = (d) => {
    setSelectedLetter(d);

    // Zoom into the clicked pin
    globeRef.current.pointOfView(
      { lat: d.lat, lng: d.lng, altitude: 0.5 }, // Adjust altitude for zoom level
      1000 // Animation duration in milliseconds
    );
  };

  const handlePointHover = (d) => {
    // Stabilize hover behavior by checking if the hovered object has changed
    if (hoveredObject !== d) {
      setHoveredObject(d || null); // Update hoveredObject state
    }
  };

  return (
    <div className="fixed inset-0 z-[-1]">
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundColor="#ffffff00"
        autoRotate
        autoRotateSpeed={0.6}
        pointsData={iconData} // Use pointsData for markers
        pointLat={(d) => d.lat}
        pointLng={(d) => d.lng}
        pointAltitude={0.01}
        pointRadius={0.3}
        pointColor={() => "rgba(255, 255, 255, 0.85)"}
        pointResolution={16}
        pointLabel={(d) => `${d.name}, ${d.location}: "${d.content}"`}
        onPointClick={handlePointClick} // Handle marker click
        customThreeObject={(d) => {
          const imgTexture = new THREE.TextureLoader().load(d.imgUrl);
          const material = new THREE.SpriteMaterial({ map: imgTexture });
          const sprite = new THREE.Sprite(material);
          sprite.scale.set(2, 2, 1); // Default size
          return sprite;
        }}
        customThreeObjectUpdate={(obj, d) => {
          // Ensure the pin resizes dynamically on hover
          if (hoveredObject === d) {
            obj.scale.set(3, 3, 1); // Larger size on hover
          } else {
            obj.scale.set(2, 2, 1); // Default size
          }
        }}
        onPointHover={handlePointHover} // Stabilized hover handler
      />

      {/* Blurred Background and Animated Popup */}
      <AnimatePresence>
        {selectedLetter && (
          <>
            {/* Blurred Background */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Popup */}
            <motion.div
              className="absolute top-10 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md border border-purple-300 shadow-xl rounded-xl p-4 w-[90%] max-w-lg text-sm text-gray-800"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <button
                onClick={() => setSelectedLetter(null)}
                className="absolute top-1 right-3 text-xl text-gray-500 hover:text-black"
              >
                &times;
              </button>
              <p className="mb-2 italic">"{selectedLetter.content}"</p>
              <p className="text-right text-xs text-purple-800 font-semibold">
                — {selectedLetter.name}, {selectedLetter.location}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}