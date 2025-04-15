import { useState } from "react"

export default function LetterForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    location: "",
    content: ""
  })

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
      <input
        type="text"
        name="location"
        placeholder="Your location (e.g. Berlin)"
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-400 text-gray-900"
        value={form.location}
        onChange={handleChange}
      />
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
