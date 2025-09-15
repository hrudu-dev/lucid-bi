import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, TrendingUp, Clock, Download } from 'lucide-react'
import type { Insight } from '@/types'

interface InsightsProps {
  insights: Insight[]
  isLoading: boolean
}

export function Insights({ insights, isLoading }: InsightsProps) {
  const handleDownloadReport = (insight: Insight) => {
    // Implementation for downloading reports
    console.log('Downloading report for:', insight.title)
  }

  const formatConfidenceScore = (score: number) => {
    return Math.round(score * 100)
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-500'
    if (score >= 0.6) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">AI Insights</h2>
        <Badge variant="secondary">
          <Brain className="h-4 w-4 mr-1" />
          {insights.length} insights
        </Badge>
      </div>

      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Generating insights...</span>
          </CardContent>
        </Card>
      )}

      {!isLoading && insights.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Brain className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No insights yet</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Run some queries or upload data to start generating AI-powered insights.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {insights.map((insight) => (
          <Card key={insight.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    {insight.title}
                  </CardTitle>
                  {insight.description && (
                    <CardDescription>{insight.description}</CardDescription>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="outline" 
                    className={getConfidenceColor(insight.confidenceScore)}
                  >
                    {formatConfidenceScore(insight.confidenceScore)}% confidence
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => handleDownloadReport(insight)}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Key Insights */}
              {Array.isArray(insight.insights.insights) && insight.insights.insights.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Key Insights
                  </h4>
                  <ul className="space-y-2">
                    {insight.insights.insights.map((item: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {Array.isArray(insight.insights.recommendations) && insight.insights.recommendations.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Recommendations</h4>
                  <ul className="space-y-2">
                    {insight.insights.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Metadata */}
              <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(insight.createdAt).toLocaleDateString()}
                </div>
                <div>
                  Data sources: {insight.dataSources.join(', ')}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}