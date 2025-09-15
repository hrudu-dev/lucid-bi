import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'
import { generateSQLQuery } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const { query, naturalLanguage } = await request.json()
    
    let sqlQuery = query
    
    // If natural language query is provided, convert to SQL
    if (naturalLanguage && !query) {
      const schema = `
        Tables:
        - business_data: id, source, type, content, metadata, created_at, updated_at
        - vector_data: id, content, embedding, metadata, business_data_id, created_at
        - insights: id, title, description, insights, confidence_score, data_sources, created_at
        - actions: id, type, config, status, insight_id, scheduled_at, executed_at, error_message, created_at
      `
      sqlQuery = await generateSQLQuery(naturalLanguage, schema)
    }
    
    if (!sqlQuery) {
      return NextResponse.json(
        { success: false, error: 'No query provided' },
        { status: 400 }
      )
    }
    
    const startTime = Date.now()
    const results = await executeQuery(sqlQuery) as any[]
    const executionTime = Date.now() - startTime
    
    // Extract column names from first row
    const columns = results.length > 0 ? Object.keys(results[0]) : []
    
    return NextResponse.json({
      success: true,
      data: {
        data: results,
        columns,
        rowCount: results.length,
        executionTime,
        query: sqlQuery
      }
    })
    
  } catch (error) {
    console.error('Query execution error:', error)
    return NextResponse.json(
      { success: false, error: 'Query execution failed' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Return sample queries for the query builder
    const sampleQueries = [
      {
        name: 'Recent Business Data',
        query: 'SELECT * FROM business_data ORDER BY created_at DESC LIMIT 10'
      },
      {
        name: 'Data by Source',
        query: 'SELECT source, COUNT(*) as count FROM business_data GROUP BY source'
      },
      {
        name: 'Top Insights',
        query: 'SELECT title, confidence_score FROM insights ORDER BY confidence_score DESC LIMIT 5'
      }
    ]
    
    return NextResponse.json({
      success: true,
      data: sampleQueries
    })
    
  } catch (error) {
    console.error('Error fetching sample queries:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sample queries' },
      { status: 500 }
    )
  }
}