import { BarChart, Database, Brain, Search, TrendingUp, X, ChevronLeft, ChevronRight, Settings, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface SidebarProps {
  currentView: string
  onViewChange: (view: 'dashboard' | 'query' | 'insights') => void
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ currentView, onViewChange, isOpen = true, onClose }: SidebarProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      if (response.ok) {
        localStorage.removeItem('user')
        router.push('/login')
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleSettings = () => {
    console.log('Settings clicked')
  }

  const handleProfile = () => {
    console.log('Profile clicked')
  }
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
    <aside className={cn(
      "border-r bg-card transition-all duration-300 ease-in-out",
      // Mobile behavior
      "fixed lg:static inset-y-0 left-0 z-40 shadow-lg lg:shadow-none",
      // Desktop width - collapsed (64px) or expanded (256px)
      isOpen ? "w-64" : "w-16 lg:w-16",
      // Mobile transform
      "lg:translate-x-0", 
      isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    )}>
      {/* Mobile header */}
      <div className={cn(
        "flex items-center justify-between p-4 border-b bg-card/95 backdrop-blur lg:hidden",
        isOpen ? "block" : "hidden"
      )}>
        <h2 className="text-lg font-semibold">Navigation</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose} 
          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <nav className="p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={currentView === item.id ? 'default' : 'ghost'}
              className={cn(
                "w-full transition-all duration-200",
                isOpen ? "justify-start px-3" : "justify-center px-2",
                currentView === item.id && "bg-primary text-primary-foreground"
              )}
              onClick={() => {
                onViewChange(item.id as any)
                // Only close on mobile
                if (window.innerWidth < 1024) {
                  onClose?.()
                }
              }}
              title={!isOpen ? item.label : undefined}
            >
              <Icon className={cn(
                "h-4 w-4 flex-shrink-0",
                isOpen ? "mr-2" : "mr-0"
              )} />
              {isOpen && <span className="truncate">{item.label}</span>}
            </Button>
          )
        })}
      </nav>
      
      <div className={cn(
        "p-2 border-t mt-auto",
        !isOpen && "hidden lg:block"
      )}>
        <div className="space-y-4">
          <div>
            {isOpen && (
              <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">
                Data Sources
              </h3>
            )}
            <div className="space-y-1">
              <div className={cn(
                "flex items-center text-sm",
                isOpen ? "justify-between px-2" : "justify-center"
              )}>
                <div className="flex items-center">
                  <Database className={cn(
                    "h-4 w-4 text-green-500",
                    isOpen ? "mr-2" : "mr-0"
                  )} />
                  {isOpen && <span>TiDB</span>}
                </div>
                {isOpen && <div className="h-2 w-2 rounded-full bg-green-500"></div>}
              </div>
            </div>
          </div>
          
          {isOpen && (
            <div className="hidden sm:block">
              <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">
                Recent Activity
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground px-2">
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
          )}
        </div>
      </div>

      {/* Profile Section */}
      <div className={cn(
        "p-2 border-t bg-card/50",
        !isOpen && "hidden lg:block"
      )}>
        <div className="space-y-1">
          {/* Profile Button */}
          <Button
            variant="ghost"
            className={cn(
              "w-full transition-all duration-200",
              isOpen ? "justify-start px-3" : "justify-center px-2"
            )}
            onClick={handleProfile}
            title={!isOpen ? "Profile" : undefined}
          >
            <User className={cn(
              "h-4 w-4 flex-shrink-0",
              isOpen ? "mr-2" : "mr-0"
            )} />
            {isOpen && <span className="truncate">Profile</span>}
          </Button>

          {/* Settings Button */}
          <Button
            variant="ghost"
            className={cn(
              "w-full transition-all duration-200",
              isOpen ? "justify-start px-3" : "justify-center px-2"
            )}
            onClick={handleSettings}
            title={!isOpen ? "Settings" : undefined}
          >
            <Settings className={cn(
              "h-4 w-4 flex-shrink-0",
              isOpen ? "mr-2" : "mr-0"
            )} />
            {isOpen && <span className="truncate">Settings</span>}
          </Button>

          {/* Logout Button */}
          <Button
            variant="ghost"
            className={cn(
              "w-full transition-all duration-200 hover:bg-destructive/10 hover:text-destructive",
              isOpen ? "justify-start px-3" : "justify-center px-2"
            )}
            onClick={handleLogout}
            disabled={isLoggingOut}
            title={!isOpen ? "Logout" : undefined}
          >
            <LogOut className={cn(
              "h-4 w-4 flex-shrink-0",
              isOpen ? "mr-2" : "mr-0"
            )} />
            {isOpen && <span className="truncate">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>}
          </Button>
        </div>
      </div>
    </aside>
  )
}