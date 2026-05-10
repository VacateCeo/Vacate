import { BrowserRouter, Routes, Route } from "react-router-dom"
import PlayerList from "./PlayerList"
import SignupForm from "./SignupForm"
import SubmitForm from "./SubmitForm"
import PlayerProfile from "./PlayerProfile"

function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-700 text-white py-5 px-4 sm:py-6 sm:px-6 shadow">
        <h1 className="text-3xl font-bold">Vacate</h1>
        <p className="text-green-200 text-sm mt-1">
          D2 & D3 College Basketball — Transfer Portal & Recruiting Hub
        </p>
      </header>
      <main>
        <SubmitForm />
        <PlayerList />
        <SignupForm />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player/:id" element={<PlayerProfile />} />
      </Routes>
    </BrowserRouter>
  )
}
