import { useState } from "react"
import { supabase } from "./supabaseClient"

export default function SignupForm() {
  const [email, setEmail] = useState("")
  const [division, setDivision] = useState("D2")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    const { error } = await supabase
      .from("subscribers")
      .insert([{ email, division }])

    if (error) {
      setError("Something went wrong. Try again.")
      console.error(error)
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) return (
    <div className="p-6 text-center text-green-700 font-semibold">
      ✅ You're signed up! We'll notify you of new portal movements.
    </div>
  )

  return (
    <div className="p-6 bg-gray-50 border-t">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Get Portal Alerts
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="border rounded px-4 py-2 text-gray-800"
        />
        <select
          value={division}
          onChange={e => setDivision(e.target.value)}
          className="border rounded px-4 py-2 text-gray-800"
        >
          <option value="D2">Division II</option>
          <option value="D3">Division III</option>
          <option value="Both">Both D2 and D3</option>
        </select>
        <button
          type="submit"
          className="bg-green-700 text-white px-6 py-2 rounded font-semibold hover:bg-green-800"
        >
          Sign Up for Alerts
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  )
}