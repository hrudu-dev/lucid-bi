import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Database, Upload, Zap, Play } from 'lucide-react'
import { useState } from 'react'

interface DemoDataLoaderProps {}

export function DemoDataLoader({}: DemoDataLoaderProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [loadedDatasets, setLoadedDatasets] = useState<string[]>([])

  const datasets = [
    {
      id: 'sales',
      name: 'Sales Performance',
      description: 'Quarterly sales data with revenue metrics by product and region',
      icon: '📊',
      records: 5
    },
    {
      id: 'customer_feedback', 
      name: 'Customer Feedback',
      description: 'Unstructured customer feedback for sentiment analysis',
      icon: '💬',
      records: 5
    },
    {
      id: 'financial_metrics',
      name: 'Financial KPIs',
      description: 'Key financial KPIs with targets and actuals',
      icon: '💰',
      records: 4
    }
  ]

  const handleLoadDataset = async (datasetId: string) => {
    setLoading(datasetId)
    
    try {
      const response = await fetch('/api/demo-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dataSet: datasetId }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setLoadedDatasets(prev => [...prev, datasetId])
        // Show success message (you could add a toast here)
        console.log(`Successfully loaded ${datasetId} dataset`)
      } else {
        console.error('Failed to load dataset:', result.error)
      }
    } catch (error) {
      console.error('Error loading dataset:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Demo Data Loader
        </CardTitle>
        <CardDescription>
          Load sample datasets to explore LucidBI capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          {datasets.map((dataset) => {
            const isLoaded = loadedDatasets.includes(dataset.id)
            const isLoading = loading === dataset.id
            
            return (
              <div key={dataset.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{dataset.icon}</span>
                    <div>
                      <h3 className="font-semibold text-sm">{dataset.name}</h3>
                      <Badge variant="outline" className="text-xs mt-1">
                        {dataset.records} records
                      </Badge>
                    </div>
                  </div>
                  {isLoaded && (
                    <Badge variant="secondary" className="text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      Loaded
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {dataset.description}
                </p>
                <Button 
                  size="sm" 
                  className="w-full"
                  disabled={isLoading || isLoaded}
                  onClick={() => handleLoadDataset(dataset.id)}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2"></div>
                      Loading...
                    </>
                  ) : isLoaded ? (
                    <>
                      <Zap className="h-3 w-3 mr-2" />
                      Loaded
                    </>
                  ) : (
                    <>
                      <Upload className="h-3 w-3 mr-2" />
                      Load Data
                    </>
                  )}
                </Button>
              </div>
            )
          })}
        </div>
        
        {loadedDatasets.length > 0 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center">
              <Play className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm text-green-800">
                {loadedDatasets.length} dataset{loadedDatasets.length > 1 ? 's' : ''} loaded! 
                Try running queries or generating insights.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}