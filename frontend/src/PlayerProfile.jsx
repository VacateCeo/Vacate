import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "./supabaseClient"

function parseDescription(description) {
  if (!description) return {}
  const fields = {}
  description.split(" | ").forEach(part => {
    const idx = part.indexOf(": ")
    if (idx !== -1) {
      const key = part.slice(0, idx).trim().toLowerCase()
      const value = part.slice(idx + 2).trim()
      fields[key] = value
    }
  })
  return fields
}

function parseTitle(title) {
  if (!title) return { name: "", position: "", school: "" }
  const parts = title.split(" | ")
  return {
    name: parts[0]?.trim() || "",
    position: parts[1]?.trim() || "",
    school: parts[2]?.trim() || "",
  }
}

export default function PlayerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetchPlayer() {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("id", id)
        .eq("approved", true)
        .single()

      if (error || !data) {
        setNotFound(true)
      } else {
        setPlayer(data)
      }
      setLoading(false)
    }
    fetchPlayer()
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-500">
      Loading...
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
      <p className="text-gray-600 text-lg">Player not found.</p>
      <button onClick={() => navigate("/")} className="text-green-700 font-semibold hover:underline">
        ← Back to Portal
      </button>
    </div>
  )

  const { name, position, school } = parseTitle(player.title)
  const info = parseDescription(player.description)
  const isTransfer = player.source === "Self-Reported Transfer"

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-700 text-white py-5 px-4 sm:py-6 sm:px-6 shadow">
        <h1 className="text-3xl font-bold">Vacate</h1>
        <p className="text-green-200 text-sm mt-1">D2 & D3 College Basketball — Transfer Portal & Recruiting Hub</p>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/")}
          className="text-green-700 font-semibold hover:underline text-sm mb-6 flex items-center gap-1"
        >
          ← Back to Portal
        </button>

        <div className="bg-white rounded-xl shadow p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{name}</h2>
              <p className="text-gray-500 text-sm mt-1">{school}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={isTransfer
                ? "px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800"
                : "px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800"}>
                {isTransfer ? "Transfer" : "Recruit"}
              </span>
              <span className={player.division === "D2"
                ? "px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800"
                : "px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800"}>
                {player.division}
              </span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {position && <Stat label="Position" value={position} />}
            {info.height && <Stat label="Height" value={info.height} />}
            {info.weight && <Stat label="Weight" value={info.weight} />}
            {info.wingspan && <Stat label="Wingspan" value={info.wingspan} />}
            {info.gpa && <Stat label="GPA" value={info.gpa} />}
            {info.year && <Stat label={isTransfer ? "Eligibility Year" : "Grad Year"} value={info.year} />}
          </div>

          {/* Stats line */}
          {info.stats && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Key Stats</h3>
              <p className="text-gray-800 font-medium">{info.stats}</p>
            </div>
          )}

          {/* Hudl link */}
          {player.url && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Highlight Film</h3>
              <a
                href={player.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-green-700 font-semibold hover:underline text-sm"
              >
                Watch on Hudl →
              </a>
            </div>
          )}

          {/* Contact */}
          {info.contact && (
            <div className="border-t pt-5 mt-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Contact</h3>
              <a href={`mailto:${info.contact}`} className="text-green-700 font-semibold hover:underline text-sm">
                {info.contact}
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg px-4 py-3">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-gray-900 font-semibold">{value}</div>
    </div>
  )
}
