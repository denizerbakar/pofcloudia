import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import R3fGlobe from "r3f-globe"
import { useRef, useState } from "react"
import * as THREE from "three"
import { extend } from "@react-three/fiber"

// 🧠 Fix #1: extend sprite if needed (not strictly required here, but avoids future issues)
extend(THREE)

function GlobeScene({ letters, setSelected }) {
  const globeRef = useRef()
  const controlsRef = useRef()

  return (
    <>
      <ambientLight intensity={Math.PI} />
      <directionalLight position={[100, 50, 100]} intensity={0.5 * Math.PI} />

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={100}
        maxDistance={1000}
        dampingFactor={0.1}
      />

      <R3fGlobe
        ref={globeRef}
        globeRadius={100}
        globeTileEngineUrl={(x, y, z) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`}
      />

      {letters
        .filter((l) => l.coords?.lat && l.coords?.lng)
        .map((l, i) => {
          const radius = 100
          const phi = (90 - l.coords.lat) * (Math.PI / 180)
          const theta = (l.coords.lng + 180) * (Math.PI / 180)

          const x = radius * Math.sin(phi) * Math.cos(theta)
          const y = radius * Math.cos(phi)
          const z = radius * Math.sin(phi) * Math.sin(theta)

          const texture = new THREE.TextureLoader().load(
            "https://cdn-icons-png.flaticon.com/512/2950/2950741.png"
          )
          const material = new THREE.SpriteMaterial({ map: texture })
          return (
            <primitive
              key={i}
              object={new THREE.Sprite(material)}
              position={[x, y, z]}
              scale={[8, 8, 1]}
              onClick={() => setSelected(l)}
            />
          )
        })}
    </>
  )
}

export default function GlobeR3F({ letters }) {
  const [selected, setSelected] = useState(null)

  return (
    <div className="fixed inset-0 z-[-1] bg-black">
      <Canvas camera={{ fov: 50, position: [0, 0, 400], near: 0.01, far: 10000 }}>
        <GlobeScene letters={letters} setSelected={setSelected} />
      </Canvas>

      {selected && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md border border-purple-300 shadow-xl rounded-xl p-4 w-[90%] max-w-lg text-sm text-gray-800">
          <button
            onClick={() => setSelected(null)}
            className="absolute top-1 right-3 text-xl text-gray-500 hover:text-black"
          >
            &times;
          </button>
          <p className="mb-2 italic">"{selected.content}"</p>
          <p className="text-right text-xs text-purple-800 font-semibold">
            — {selected.name}, {selected.location}
          </p>
        </div>
      )}
    </div>
  )
}
