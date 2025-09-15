import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, Users, Key, Lock } from 'lucide-react'

interface SecurityDashboardProps {}

export function SecurityDashboard({}: SecurityDashboardProps) {
  const demoCredentials = [
    {
      email: 'test@example.com',
      password: 'password',
      role: 'Admin',
      description: 'Full access to all features and data'
    },
    {
      email: 'admin@lucidbi.com',
      password: 'admin123',
      role: 'Admin', 
      description: 'Administrator access'
    },
    {
      email: 'viewer@lucidbi.com',
      password: 'viewer123',
      role: 'Viewer',
      description: 'Read-only access to dashboards'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Security & Access</h2>
        <Badge variant="outline" className="flex items-center">
          <Shield className="h-4 w-4 mr-1" />
          Demo Mode
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="h-5 w-5 mr-2" />
            Demo Credentials
          </CardTitle>
          <CardDescription>
            Use these credentials to access LucidBI for testing and demonstration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {demoCredentials.map((cred, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={cred.role === 'Admin' ? 'default' : 'secondary'}>
                    {cred.role}
                  </Badge>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Email:</span>
                    <div className="font-mono bg-muted px-2 py-1 rounded text-xs mt-1">
                      {cred.email}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Password:</span>
                    <div className="font-mono bg-muted px-2 py-1 rounded text-xs mt-1">
                      {cred.password}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground pt-2">
                    {cred.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            Security Features
          </CardTitle>
          <CardDescription>
            Production-ready security measures implemented
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">✅ Implemented</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Session-based authentication</li>
                <li>• HTTP-only cookies</li>
                <li>• API endpoint protection</li>
                <li>• Input validation & sanitization</li>
                <li>• SQL injection prevention</li>
                <li>• Environment variable encryption</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">🚀 Production Ready</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• JWT token authentication</li>
                <li>• Role-based access control</li>
                <li>• OAuth integration (Google, GitHub)</li>
                <li>• Rate limiting & DDoS protection</li>
                <li>• Audit logging</li>
                <li>• Multi-factor authentication</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <Shield className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="font-semibold text-blue-800">Development Note</h3>
        </div>
        <p className="text-sm text-blue-700">
          For demonstration purposes, we've implemented a simplified authentication system. 
          In production, LucidBI uses enterprise-grade security with proper password hashing, 
          JWT tokens, and integration with identity providers.
        </p>
      </div>
    </div>
  )
}