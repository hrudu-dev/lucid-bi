import { BarChart, Database, Brain, Search, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarProps {
  currentView: string
  onViewChange: (view: 'dashboard' | 'query' | 'insights') => void
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart,
    },
    {
      id: 'query',
      label: 'Query Builder',
      icon: Search,
    },
    {
      id: 'insights',
      label: 'AI Insights',
      icon: Brain,
    },
  ]

  return (
    <aside className="w-64 border-r bg-card">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={currentView === item.id ? 'default' : 'ghost'}
              className={cn(
                "w-full justify-start",
                currentView === item.id && "bg-primary text-primary-foreground"
              )}
              onClick={() => onViewChange(item.id as any)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          )
        })}
      </nav>
      
      <div className="p-4 border-t">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Data Sources
            </h3>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Database className="h-4 w-4 mr-2 text-green-500" />
                  <span>TiDB</span>
                </div>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Recent Activity
            </h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center">
                <TrendingUp className="h-3 w-3 mr-2" />
                <span>Sales analysis completed</span>
              </div>
              <div className="flex items-center">
                <Brain className="h-3 w-3 mr-2" />
                <span>New insights generated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}