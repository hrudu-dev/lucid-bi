'use client'

import { useState, useEffect } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { MainContent } from './MainContent'
import { QueryInterface } from './QueryInterface'
import { Insights } from './Insights'
import type { Insight, QueryResult } from '@/types'

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'query' | 'insights'>('dashboard')
  const [insights, setInsights] = useState<Insight[]>([])
  const [queryResults, setQueryResults] = useState<QueryResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleQuery = async (query: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })
      
      const result = await response.json()
      setQueryResults(result.data)
      setCurrentView('dashboard')
    } catch (error) {
      console.error('Query failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInsightGeneration = async (data: any[]) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      })
      
      const result = await response.json()
      if (result.success) {
        setInsights(prev => [...prev, result.data])
      }
    } catch (error) {
      console.error('Insight generation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Load initial insights
    const loadInsights = async () => {
      try {
        const response = await fetch('/api/insights')
        const result = await response.json()
        if (result.success) {
          setInsights(result.data)
        }
      } catch (error) {
        console.error('Failed to load insights:', error)
      }
    }

    loadInsights()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView} 
        />
        <main className="flex-1 p-6">
          {currentView === 'dashboard' && (
            <MainContent 
              queryResults={queryResults}
              insights={insights}
              onGenerateInsights={handleInsightGeneration}
              isLoading={isLoading}
            />
          )}
          {currentView === 'query' && (
            <QueryInterface 
              onQuery={handleQuery}
              isLoading={isLoading}
            />
          )}
          {currentView === 'insights' && (
            <Insights 
              insights={insights}
              isLoading={isLoading}
            />
          )}
        </main>
      </div>
    </div>
  )
}