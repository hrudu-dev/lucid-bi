import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'
import { generateEmbedding } from '@/lib/ai'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const { source, type, content, metadata } = await request.json()
    
    if (!source || !type || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const dataId = uuidv4()
    
    // Insert business data
    const insertDataQuery = `
      INSERT INTO business_data (id, source, type, content, metadata, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `
    
    await executeQuery(insertDataQuery, [
      dataId,
      source,
      type,
      JSON.stringify(content),
      metadata ? JSON.stringify(metadata) : null
    ])
    
    // Generate embeddings for unstructured data
    if (type === 'unstructured' && typeof content === 'string') {
      try {
        const embedding = await generateEmbedding(content)
        const vectorId = uuidv4()
        
        const insertVectorQuery = `
          INSERT INTO vector_data (id, content, embedding, metadata, business_data_id, created_at)
          VALUES (?, ?, ?, ?, ?, NOW())
        `
        
        await executeQuery(insertVectorQuery, [
          vectorId,
          content,
          JSON.stringify(embedding),
          metadata ? JSON.stringify(metadata) : null,
          dataId
        ])
      } catch (embeddingError) {
        console.warn('Failed to generate embedding:', embeddingError)
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: dataId,
        message: 'Data ingested successfully'
      }
    })
    
  } catch (error) {
    console.error('Data ingestion error:', error)
    return NextResponse.json(
      { success: false, error: 'Data ingestion failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const source = searchParams.get('source')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    let query = 'SELECT * FROM business_data WHERE 1=1'
    const params: any[] = []
    
    if (source) {
      query += ' AND source = ?'
      params.push(source)
    }
    
    if (type) {
      query += ' AND type = ?'
      params.push(type)
    }
    
    query += ' ORDER BY created_at DESC LIMIT ?'
    params.push(limit)
    
    const results = await executeQuery(query, params) as any[]
    
    // Parse JSON content
    const data = results.map(row => ({
      ...row,
      content: JSON.parse(row.content),
      metadata: row.metadata ? JSON.parse(row.metadata) : null
    }))
    
    return NextResponse.json({
      success: true,
      data: data
    })
    
  } catch (error) {
    console.error('Error fetching data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}