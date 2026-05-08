import PlayerList from "./PlayerList"
import SignupForm from "./SignupForm"
import SubmitForm from "./SubmitForm"

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-700 text-white py-6 px-6 shadow">
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