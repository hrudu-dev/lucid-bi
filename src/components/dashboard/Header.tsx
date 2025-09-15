import { BarChart, Database, Brain, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {}

export function Header({}: HeaderProps) {
  return (
    <header className="border-b bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">LucidBI</h1>
          </div>
          <span className="text-sm text-muted-foreground">
            AI-Powered Business Intelligence
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}