import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Play, FileText, Loader2 } from 'lucide-react'

interface QueryInterfaceProps {
  onQuery: (query: string) => void
  isLoading: boolean
}

export function QueryInterface({ onQuery, isLoading }: QueryInterfaceProps) {
  const [query, setQuery] = useState('')
  const [naturalLanguage, setNaturalLanguage] = useState('')
  const [mode, setMode] = useState<'sql' | 'natural'>('natural')

  const sampleQueries = [
    {
      title: 'Sales Performance',
      description: 'Show me the sales performance over the last quarter',
      sql: 'SELECT DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count FROM business_data WHERE created_at >= DATE_SUB(NOW(), INTERVAL 3 MONTH) GROUP BY month'
    },
    {
      title: 'Data Sources',
      description: 'What are the different data sources in our system?',
      sql: 'SELECT source, type, COUNT(*) as count FROM business_data GROUP BY source, type ORDER BY count DESC'
    },
    {
      title: 'Recent Insights',
      description: 'Show me the most confident insights from the last week',
      sql: 'SELECT title, confidence_score, created_at FROM insights WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) ORDER BY confidence_score DESC LIMIT 10'
    }
  ]

  const handleSubmit = () => {
    if (mode === 'sql' && query.trim()) {
      onQuery(query.trim())
    } else if (mode === 'natural' && naturalLanguage.trim()) {
      onQuery('') // Will be converted from natural language in API
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Query Builder</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={mode === 'natural' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('natural')}
          >
            Natural Language
          </Button>
          <Button
            variant={mode === 'sql' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('sql')}
          >
            SQL
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {mode === 'natural' ? 'Ask in Plain English' : 'SQL Query Editor'}
          </CardTitle>
          <CardDescription>
            {mode === 'natural' 
              ? 'Describe what you want to know about your data in natural language'
              : 'Write SQL queries to analyze your business data'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mode === 'natural' ? (
            <Textarea
              placeholder="e.g., Show me the sales trends for the last 6 months"
              value={naturalLanguage}
              onChange={(e) => setNaturalLanguage(e.target.value)}
              className="min-h-[120px]"
            />
          ) : (
            <Textarea
              placeholder="SELECT * FROM business_data WHERE..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[120px] font-mono"
            />
          )}
          
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || (!query.trim() && !naturalLanguage.trim())}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isLoading ? 'Executing...' : 'Run Query'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sample Queries</CardTitle>
          <CardDescription>
            Get started with these example queries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sampleQueries.map((sample, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="space-y-2 flex-1">
                      <h3 className="font-semibold">{sample.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {sample.description}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuery(sample.sql)
                        setMode('sql')
                      }}
                      className="w-full sm:w-auto"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Use
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <code className="text-xs bg-muted p-2 rounded block whitespace-pre-wrap break-all">
                      {sample.sql}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}