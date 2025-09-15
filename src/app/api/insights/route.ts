import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'
import { analyzeData, generateReport } from '@/lib/ai'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const { data, context } = await request.json()
    
    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { success: false, error: 'Invalid data provided' },
        { status: 400 }
      )
    }
    
    // Generate AI insights
    const analysisResult = await analyzeData(data, context || 'Business data analysis')
    
    // Save insight to database
    const insightId = uuidv4()
    const insertQuery = `
      INSERT INTO insights (id, title, description, insights, confidence_score, data_sources, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `
    
    await executeQuery(insertQuery, [
      insightId,
      `AI Analysis - ${new Date().toLocaleDateString()}`,
      'Automated analysis of business data',
      JSON.stringify(analysisResult),
      analysisResult.confidence,
      JSON.stringify(['user_query'])
    ])
    
    // Generate detailed report
    const report = await generateReport(analysisResult, { 
      dataSize: data.length,
      timestamp: new Date().toISOString()
    })
    
    return NextResponse.json({
      success: true,
      data: {
        id: insightId,
        title: `AI Analysis - ${new Date().toLocaleDateString()}`,
        description: 'Automated analysis of business data',
        insights: analysisResult,
        confidenceScore: analysisResult.confidence,
        dataSources: ['user_query'],
        createdAt: new Date(),
        report
      }
    })
    
  } catch (error) {
    console.error('Insight generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate insights' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const query = `
      SELECT id, title, description, insights, confidence_score, data_sources, created_at
      FROM insights
      ORDER BY created_at DESC
      LIMIT 20
    `
    
    const results = await executeQuery(query) as any[]
    
    // Parse JSON fields
    const insights = results.map(row => ({
      ...row,
      insights: JSON.parse(row.insights),
      dataSources: JSON.parse(row.data_sources)
    }))
    
    return NextResponse.json({
      success: true,
      data: insights
    })
    
  } catch (error) {
    console.error('Error fetching insights:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch insights' },
      { status: 500 }
    )
  }
}