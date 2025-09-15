export interface BusinessData {
  id: string
  source: string
  type: 'structured' | 'unstructured'
  content: any
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface VectorData {
  id: string
  content: string
  embedding: number[]
  metadata?: Record<string, any>
  businessDataId: string
  createdAt: Date
}

export interface Insight {
  id: string
  title: string
  description?: string
  insights: any
  confidenceScore: number
  dataSources: string[]
  createdAt: Date
}

export interface Action {
  id: string
  type: 'slack_report' | 'dashboard_update' | 'alert' | 'email'
  config: Record<string, any>
  status: 'pending' | 'completed' | 'failed'
  insightId?: string
  scheduledAt?: Date
  executedAt?: Date
  errorMessage?: string
  createdAt: Date
}

export interface DataSource {
  id: string
  name: string
  type: 'database' | 'api' | 'file' | 'manual'
  connectionConfig: Record<string, any>
  isActive: boolean
  lastSync?: Date
}

export interface QueryResult {
  data: any[]
  columns: string[]
  rowCount: number
  executionTime: number
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter'
  title: string
  data: any[]
  xAxis?: string
  yAxis?: string
  config?: Record<string, any>
}

export interface DashboardWidget {
  id: string
  type: 'chart' | 'metric' | 'table' | 'text'
  title: string
  config: Record<string, any>
  position: {
    x: number
    y: number
    width: number
    height: number
  }
}

export interface Dashboard {
  id: string
  name: string
  description?: string
  widgets: DashboardWidget[]
  isPublic: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'analyst' | 'viewer'
  createdAt: Date
}

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}