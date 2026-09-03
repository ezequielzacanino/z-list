import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useSession } from './hooks/useSession'
import { AuthPage } from './pages/AuthPage'
import { ListsPage } from './pages/ListsPage'
import { ListPage } from './pages/ListPage'
import { JoinPage } from './pages/JoinPage'

export function App() {
  const { session, loading, recovery } = useSession()

  if (loading) return <p className="notice">Cargando…</p>

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/unirse/:token" element={<JoinPage userId={session?.user.id ?? null} />} />
        {session ? (
          <>
            <Route path="/" element={<ListsPage userId={session.user.id} recovery={recovery} />} />
            <Route path="/lista/:listId" element={<ListPage userId={session.user.id} />} />
          </>
        ) : (
          <Route path="*" element={<AuthPage />} />
        )}
      </Routes>
    </BrowserRouter>
  )
}
