import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'
import { slackService } from '@/services/slack'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const { type, config, insightId, scheduledAt } = await request.json()
    
    if (!type || !config) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const actionId = uuidv4()
    
    // Save action to database
    const insertActionQuery = `
      INSERT INTO actions (id, type, config, status, insight_id, scheduled_at, created_at)
      VALUES (?, ?, ?, 'pending', ?, ?, NOW())
    `
    
    await executeQuery(insertActionQuery, [
      actionId,
      type,
      JSON.stringify(config),
      insightId || null,
      scheduledAt || null
    ])

    // Execute action immediately if not scheduled
    if (!scheduledAt) {
      const success = await executeAction(actionId, type, config, insightId)
      
      if (success) {
        await executeQuery(
          'UPDATE actions SET status = ?, executed_at = NOW() WHERE id = ?',
          ['completed', actionId]
        )
      } else {
        await executeQuery(
          'UPDATE actions SET status = ?, error_message = ? WHERE id = ?',
          ['failed', 'Execution failed', actionId]
        )
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: actionId,
        message: scheduledAt ? 'Action scheduled' : 'Action executed'
      }
    })
    
  } catch (error) {
    console.error('Action creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Action creation failed' },
      { status: 500 }
    )
  }
}

async function executeAction(actionId: string, type: string, config: any, insightId?: string): Promise<boolean> {
  try {
    switch (type) {
      case 'slack_report':
        if (insightId) {
          const insightQuery = 'SELECT * FROM insights WHERE id = ?'
          const insights = await executeQuery(insightQuery, [insightId]) as any[]
          
          if (insights.length > 0) {
            const insight = {
              ...insights[0],
              insights: JSON.parse(insights[0].insights)
            }
            return await slackService.sendInsightReport(insight)
          }
        }
        break
        
      case 'alert':
        return await slackService.sendDataAlert({
          title: config.title || 'LucidBI Alert',
          message: config.message || 'Alert triggered',
          severity: config.severity || 'info'
        })
        
      case 'dashboard_update':
        // Implement dashboard update logic
        console.log('Dashboard update requested:', config)
        return true
        
      case 'email':
        // Implement email sending logic
        console.log('Email requested:', config)
        return true
        
      default:
        console.error('Unknown action type:', type)
        return false
    }
    
    return false
  } catch (error) {
    console.error('Action execution error:', error)
    return false
  }
}

export async function GET() {
  try {
    const query = `
      SELECT id, type, config, status, insight_id, scheduled_at, executed_at, error_message, created_at
      FROM actions
      ORDER BY created_at DESC
      LIMIT 50
    `
    
    const results = await executeQuery(query) as any[]
    
    const actions = results.map(row => ({
      ...row,
      config: JSON.parse(row.config)
    }))
    
    return NextResponse.json({
      success: true,
      data: actions
    })
    
  } catch (error) {
    console.error('Error fetching actions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch actions' },
      { status: 500 }
    )
  }
}