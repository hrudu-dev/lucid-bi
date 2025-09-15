import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChartContainer } from './ChartContainer'
import { MetricsGrid } from './MetricsGrid'
import { DataTable } from './DataTable'
import { DemoDataLoader } from './DemoDataLoader'
import type { QueryResult, Insight } from '@/types'
import { TrendingUp, RefreshCw } from 'lucide-react'

interface MainContentProps {
  queryResults: QueryResult | null
  insights: Insight[]
  onGenerateInsights: (data: any[]) => void
  isLoading: boolean
}

export function MainContent({ queryResults, insights, onGenerateInsights, isLoading }: MainContentProps) {
  const handleGenerateInsights = () => {
    if (queryResults?.data) {
      onGenerateInsights(queryResults.data)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button onClick={handleGenerateInsights} disabled={isLoading || !queryResults}>
          <TrendingUp className="h-4 w-4 mr-2" />
          Generate Insights
        </Button>
      </div>

      <MetricsGrid />

      {queryResults && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Query Results</CardTitle>
                <CardDescription>
                  {queryResults.rowCount} rows • Executed in {queryResults.executionTime}ms
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable data={queryResults.data} columns={queryResults.columns} />
            </CardContent>
          </Card>

          <ChartContainer data={queryResults.data} />
        </div>
      )}

      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Insights</CardTitle>
            <CardDescription>
              AI-generated insights from your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.slice(0, 3).map((insight) => (
                <div key={insight.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{insight.title}</h3>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(insight.confidenceScore * 100)}% confidence
                    </span>
                  </div>
                  {insight.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {insight.description}
                    </p>
                  )}
                  <div className="text-sm">
                    {Array.isArray(insight.insights.insights) && 
                      insight.insights.insights.slice(0, 2).map((item: string, index: number) => (
                        <div key={index} className="flex items-start mb-1">
                          <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          <span>{item}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!queryResults && insights.length === 0 && (
        <>
          <DemoDataLoader />
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Welcome to LucidBI</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Start by loading demo data above, then run queries or generate AI-powered insights 
                and visualizations.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}