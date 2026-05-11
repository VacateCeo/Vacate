import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "./supabaseClient"

const POSITIONS = ["All", "PG", "SG", "SF", "PF", "C"]
const DIVISIONS = ["All", "D2", "D3"]

function divisionBadge(div) {
  return div === "D2"
    ? "px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-800"
    : "px-2 py-1 rounded text-xs font-bold bg-purple-100 text-purple-800"
}

function typeBadge(source) {
  return source === "Self-Reported Transfer"
    ? "px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-800"
    : "px-2 py-1 rounded text-xs font-bold bg-orange-100 text-orange-800"
}

function getPosition(title) {
  return (title.split(" | ")[1] || "").trim()
}

export default function PlayerList() {
  const [players, setPlayers] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [positionFilter, setPositionFilter] = useState("All")
  const [divisionFilter, setDivisionFilter] = useState("All")
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      const { data: playerData } = await supabase
        .from("players")
        .select("id, title, division, source, description, date_added")
        .eq("approved", true)
        .order("date_added", { ascending: false })

      const { data: newsData } = await supabase
        .from("news")
        .select("id, title, division, url, date_added")
        .order("date_added", { ascending: false })

      setPlayers(playerData || [])
      setNews(newsData || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const filteredPlayers = players.filter(p => {
    const divMatch = divisionFilter === "All" || p.division === divisionFilter
    const posMatch = positionFilter === "All" || getPosition(p.title) === positionFilter
    return divMatch && posMatch
  })

  if (loading) return (
    <div className="text-center py-10 text-gray-500">Loading...</div>
  )

  return (
    <div>
      <div className="p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h2 className="text-2xl font-bold text-gray-800">Players in the Portal</h2>
          <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">✓ Manually verified by Vacate</span>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <span className="text-sm font-medium text-gray-600">Division:</span>
          {DIVISIONS.map(div => (
            <button
              key={div}
              onClick={() => setDivisionFilter(div)}
              className={divisionFilter === div
                ? "px-3 py-1 rounded text-sm font-semibold bg-green-700 text-white"
                : "px-3 py-1 rounded text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200"}
            >
              {div}
            </button>
          ))}
          <span className="text-sm font-medium text-gray-600 sm:ml-3">Position:</span>
          {POSITIONS.map(pos => (
            <button
              key={pos}
              onClick={() => setPositionFilter(pos)}
              className={positionFilter === pos
                ? "px-3 py-1 rounded text-sm font-semibold bg-green-700 text-white"
                : "px-3 py-1 rounded text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200"}
            >
              {pos}
            </button>
          ))}
        </div>

        {filteredPlayers.length === 0 ? (
          <p className="text-gray-500 italic">No players match the selected filters.</p>
        ) : (
          <>
            {/* Mobile: card view */}
            <div className="md:hidden space-y-3">
              {filteredPlayers.map(player => (
                <div
                  key={player.id}
                  onClick={() => navigate(`/player/${player.id}`)}
                  className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="font-semibold text-gray-800 text-sm leading-snug">{player.title}</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={typeBadge(player.source)}>
                      {player.source === "Self-Reported Transfer" ? "Transfer" : "Recruit"}
                    </span>
                    <span className={divisionBadge(player.division)}>{player.division}</span>
                  </div>
                  {player.description && (
                    <div className="text-gray-500 text-xs mt-2 leading-relaxed">{player.description}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop: table view */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-green-700 text-white">
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Division</th>
                    <th className="px-4 py-3 text-left">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.map((player, i) => (
                    <tr
                      key={player.id}
                      onClick={() => navigate(`/player/${player.id}`)}
                      className={(i % 2 === 0 ? "bg-gray-50" : "bg-white") + " cursor-pointer hover:bg-green-50 transition-colors"}
                    >
                      <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{player.title}</td>
                      <td className="px-4 py-3">
                        <span className={typeBadge(player.source)}>
                          {player.source === "Self-Reported Transfer" ? "Transfer" : "Recruit"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={divisionBadge(player.division)}>{player.division}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">{player.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <div className="p-4 sm:p-6 border-t">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">D2/D3 News</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow rounded-lg overflow-hidden min-w-[420px]">
            <thead>
              <tr className="bg-green-700 text-white">
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Division</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody>
              {news.map((article, i) => (
                <tr key={article.id} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-4 py-3">
                    <a href={article.url} target="_blank" rel="noreferrer" className="text-green-700 hover:underline">
                      {article.title}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span className={divisionBadge(article.division)}>{article.division}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-sm whitespace-nowrap">
                    {new Date(article.date_added).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
