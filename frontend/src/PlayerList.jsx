import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

export default function PlayerList() {
  const [players, setPlayers] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: playerData } = await supabase
        .from("players")
        .select("*")
        .eq("approved", true)
        .order("date_added", { ascending: false })

      const { data: newsData } = await supabase
        .from("news")
        .select("*")
        .order("date_added", { ascending: false })

      setPlayers(playerData || [])
      setNews(newsData || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="text-center py-10 text-gray-500">Loading...</div>
  )

  return (
    <div>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Players in the Portal</h2>
        {players.length === 0 ? (
          <p className="text-gray-500 italic">No approved players yet.</p>
        ) : (
          <div className="overflow-x-auto">
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
                {players.map((player, i) => (
                  <tr key={player.id} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="px-4 py-3 font-semibold text-gray-800">{player.title}</td>
                    <td className="px-4 py-3">
                      <span className={player.source === "Self-Reported Transfer" ? "px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-800" : "px-2 py-1 rounded text-xs font-bold bg-orange-100 text-orange-800"}>
                        {player.source === "Self-Reported Transfer" ? "Transfer" : "Recruit"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={player.division === "D2" ? "px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-800" : "px-2 py-1 rounded text-xs font-bold bg-purple-100 text-purple-800"}>
                        {player.division}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">{player.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="p-6 border-t">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">D2/D3 News</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-green-700 text-white">
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Division</th>
                <th className="px-4 py-3 text-left">Date</th>
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
                    <span className={article.division === "D2" ? "px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-800" : "px-2 py-1 rounded text-xs font-bold bg-purple-100 text-purple-800"}>
                      {article.division}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-sm">
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