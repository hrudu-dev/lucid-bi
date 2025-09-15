import { Metadata } from 'next'
import Dashboard from '@/components/dashboard/Dashboard'

export const metadata: Metadata = {
  title: 'Console - LucidBI',
  description: 'AI-powered Business Intelligence Dashboard',
}

export default function ConsolePage() {
  return (
    <main className="min-h-screen">
      <Dashboard />
    </main>
  )
}