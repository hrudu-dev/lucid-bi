import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Activity, Users, Database, Brain } from 'lucide-react'

interface MetricsGridProps {}

export function MetricsGrid({}: MetricsGridProps) {
  // Sample metrics - in a real app, this would come from API
  const metrics = [
    {
      title: 'Total Data Points',
      value: '2,345',
      change: '+12%',
      trend: 'up',
      icon: Database,
      description: 'Across all data sources'
    },
    {
      title: 'Active Insights',
      value: '89',
      change: '+5%',
      trend: 'up',
      icon: Brain,
      description: 'Generated this week'
    },
    {
      title: 'Query Performance',
      value: '1.2s',
      change: '-8%',
      trend: 'down',
      icon: Activity,
      description: 'Average response time'
    },
    {
      title: 'Data Sources',
      value: '4',
      change: '+1',
      trend: 'up',
      icon: Users,
      description: 'Connected systems'
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                )}
                <span className={metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {metric.change}
                </span>
                <span className="ml-1">{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}