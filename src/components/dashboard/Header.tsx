'use client'

import { Brain, Menu, X, Moon, Sun, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface HeaderProps {
  onToggleSidebar?: () => void
  isSidebarOpen?: boolean
}

export function Header({ onToggleSidebar, isSidebarOpen }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [hasNotifications, setHasNotifications] = useState(true)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    // In a real app, you'd implement theme switching logic here
    document.documentElement.classList.toggle('dark')
  }

  const handleNotifications = () => {
    // Handle notifications click
    console.log('Notifications clicked')
    setHasNotifications(false)
  }

  return (
    <header className="border-b bg-card px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="transition-transform duration-200 hover:scale-105"
            onClick={onToggleSidebar}
          >
            <div className="transition-transform duration-200">
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </div>
          </Button>
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-8 w-8 p-0"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNotifications}
            className="h-8 w-8 p-0 relative"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {hasNotifications && (
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></div>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}