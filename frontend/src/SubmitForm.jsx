import { useState } from "react"
import { supabase } from "./supabaseClient"

export default function SubmitForm() {
  const [type, setType] = useState("transfer")
  const [form, setForm] = useState({ name: "", school: "", position: "", division: "D2", grad_year: "", stats: "", hudl: "", email: "" })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    const { error } = await supabase.from("players").insert([{
      title: form.name + " | " + form.position + " | " + form.school,
      division: form.division,
      description: "Type: " + type + " | Year: " + form.grad_year + " | Stats: " + form.stats + " | Contact: " + form.email,
      source: type === "transfer" ? "Self-Reported Transfer" : "Self-Reported Recruit",
      url: form.hudl
    }])
    if (error) {
      setError("Something went wrong. Try again.")
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) return (
    <div className="p-6 text-center text-green-700 font-semibold text-lg">
      Profile submitted! Coaches can now find you on Vacate.
    </div>
  )

  return (
    <div className="p-6 bg-white border-t border-b">
      <h2 className="text-xl font-bold mb-2 text-gray-800">Submit Your Profile</h2>
      <p className="text-gray-500 text-sm mb-4">Players — list yourself so D2/D3 coaches can find you.</p>
      <div className="flex gap-3 mb-4">
        <button onClick={() => setType("transfer")} className={type === "transfer" ? "px-4 py-2 rounded font-semibold text-sm bg-green-700 text-white" : "px-4 py-2 rounded font-semibold text-sm bg-gray-100 text-gray-700"}>
          Transfer Portal
        </button>
        <button onClick={() => setType("recruit")} className={type === "recruit" ? "px-4 py-2 rounded font-semibold text-sm bg-green-700 text-white" : "px-4 py-2 rounded font-semibold text-sm bg-gray-100 text-gray-700"}>
          High School Recruit
        </button>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 max-w-lg">
        <input name="name" placeholder="Full Name" onChange={handleChange} required className="border rounded px-4 py-2 text-gray-800" />
        <input name="school" placeholder={type === "transfer" ? "Current School" : "High School"} onChange={handleChange} required className="border rounded px-4 py-2 text-gray-800" />
        <select name="position" onChange={handleChange} required className="border rounded px-4 py-2 text-gray-800">
          <option value="">Select Position</option>
          <option>PG</option>
          <option>SG</option>
          <option>SF</option>
          <option>PF</option>
          <option>C</option>
        </select>
        <select name="division" onChange={handleChange} className="border rounded px-4 py-2 text-gray-800">
          <option value="D2">Division II</option>
          <option value="D3">Division III</option>
        </select>
        <input name="grad_year" placeholder={type === "transfer" ? "Eligibility Year (e.g. 2026)" : "Graduation Year"} onChange={handleChange} required className="border rounded px-4 py-2 text-gray-800" />
        <input name="stats" placeholder="Key Stats (e.g. 14 PPG, 6 RPG)" onChange={handleChange} className="border rounded px-4 py-2 text-gray-800" />
        <input name="hudl" placeholder="Hudl or highlight link (optional)" onChange={handleChange} className="border rounded px-4 py-2 text-gray-800" />
        <input name="email" type="email" placeholder="Your email (coaches will contact you)" onChange={handleChange} required className="border rounded px-4 py-2 text-gray-800" />
        <button type="submit" className="bg-green-700 text-white px-6 py-2 rounded font-semibold hover:bg-green-800">
          Submit Profile
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  )
}