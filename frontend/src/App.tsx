import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProfileSettingsForm } from './components/profile-settings'
import './index.css'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <ProfileSettingsForm />
      </main>
    </QueryClientProvider>
  )
}

export default App
