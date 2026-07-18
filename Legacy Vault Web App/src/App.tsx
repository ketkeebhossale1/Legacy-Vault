import { useState } from 'react'
import AuthPage from './components/AuthPage'
import Layout from './components/Layout'
import HomePage from './components/HomePage'
import VaultDashboard from './components/VaultDashboard'
import Nominees from './components/Nominees'
import DigitalWill from './components/DigitalWill'
import VerificationWizard from './components/VerificationWizard'
import RemindersActivity from './components/RemindersActivity'
import SecurityAbout from './components/SecurityAbout'
import CollaborationSpace from './components/CollaborationSpace'

type Page = 'home' | 'vault' | 'nominees' | 'will' | 'verify' | 'reminders' | 'security' | 'collaborate'

interface User { name: string; email: string }

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [page, setPage] = useState<Page>('home')

  if (!user) {
    return <AuthPage onAuth={u => setUser(u)} />
  }

  const navigate = (p: string) => setPage(p as Page)

  const pageContent: Record<Page, React.ReactNode> = {
    home: <HomePage onNavigate={navigate} />,
    vault: <VaultDashboard />,
    nominees: <Nominees />,
    will: <DigitalWill />,
    verify: <VerificationWizard />,
    reminders: <RemindersActivity />,
    security: <SecurityAbout />,
    collaborate: <CollaborationSpace />,
  }

  return (
    <Layout page={page} onNavigate={p => setPage(p)} user={user} onLogout={() => setUser(null)}>
      {pageContent[page]}
    </Layout>
  )
}
