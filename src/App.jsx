export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-purple-200 p-6 flex flex-col items-center">
      <img
        src="/pofcloudia-logo.jpg"
        alt="Pofcloudia Logo"
        className="w-32 mb-4 rounded-xl shadow"
      />
      <h1 className="text-4xl font-bold text-purple-700 text-center mb-6">
        Pofcloudia: Public Letters
      </h1>

      <div className="w-full max-w-xl space-y-6">
        <div className="bg-white p-6 rounded-xl shadow text-center text-gray-600">
          ✍️ The letter form will go here...
        </div>
        <div className="bg-white p-6 rounded-xl shadow text-center text-gray-600">
          📨 And public letters will show up here...
        </div>
      </div>
    </div>
  )
}
