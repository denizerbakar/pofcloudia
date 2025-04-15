export default function LetterFeed({ letters }) {
  if (!letters.length) {
    return (
      <div className="text-center text-gray-500">
        No letters yet. Be the first to write one! 💌
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {letters.map((letter, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-xl shadow text-sm text-gray-700"
        >
          <p className="italic mb-2">"{letter.content}"</p>
          <div className="text-right text-xs text-gray-500">
            — {letter.name}, {letter.location}
          </div>
        </div>
      ))}
    </div>
  )
}
