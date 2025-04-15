import { useEffect, useState } from "react"

export default function LetterForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    location: "",
    content: ""
  })

  useEffect(() => {
    const fetchCity = async (lat, lon) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        )
        const data = await res.json()
        const city = data.address.city || data.address.town || data.address.village || data.address.county
        if (city) {
          setForm((prev) => ({ ...prev, location: city }))
        }
      } catch (err) {
        console.error("Failed to reverse geocode:", err)
      }
    }
  
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          fetchCity(latitude, longitude)
        },
        (error) => {
          console.warn("Geolocation permission denied:", error.message)
        }
      )
    }
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.location || !form.content) return
    onSubmit(form)
    setForm({ name: "", location: "", content: "" })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Your name"
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-400 text-gray-900"
        value={form.name}
        onChange={handleChange}
      />
      <div className="flex gap-2">
  <input
    type="text"
    name="location"
    placeholder="Detecting location..."
    className="flex-1 p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed focus:outline-none placeholder-gray-400 text-gray-900"
    value={form.location}
    readOnly
  />
  <button
    type="button"
    onClick={() => alert("Coming soon: map picker!")}
    className="px-3 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 whitespace-nowrap"
  >
    Choose on Map
  </button>
</div>
      
      <textarea
        name="content"
        placeholder="Write your letter..."
        rows="4"
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-400 text-gray-900"
        value={form.content}
        onChange={handleChange}
      />
      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Submit Letter
      </button>
    </form>
  )
}
