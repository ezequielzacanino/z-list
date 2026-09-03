import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useSession } from './hooks/useSession'
import { AuthPage } from './pages/AuthPage'
import { ListsPage } from './pages/ListsPage'
import { ListPage } from './pages/ListPage'

export function App() {
  const { session, loading, recovery } = useSession()

  if (loading) return <p className="notice">Cargando…</p>
  if (!session) return <AuthPage />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListsPage userId={session.user.id} recovery={recovery} />} />
        <Route path="/lista/:listId" element={<ListPage userId={session.user.id} />} />
      </Routes>
    </BrowserRouter>
  )
}
