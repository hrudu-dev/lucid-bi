import { NextRequest, NextResponse } from 'next/server'
import { initializeDatabase, checkTablesExist } from '@/lib/init-database'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Database initialization requested')
    
    // Check if tables already exist
    const tableStatus = await checkTablesExist()
    const allTablesExist = tableStatus.every(t => t.exists)
    
    if (allTablesExist) {
      return NextResponse.json({
        success: true,
        message: 'Database already initialized',
        tables: tableStatus
      })
    }
    
    // Initialize database
    const result = await initializeDatabase()
    
    if (result.success) {
      const finalStatus = await checkTablesExist()
      return NextResponse.json({
        success: true,
        message: 'Database initialized successfully',
        tables: finalStatus
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const tableStatus = await checkTablesExist()
    
    return NextResponse.json({
      success: true,
      tables: tableStatus,
      initialized: tableStatus.every(t => t.exists)
    })
  } catch (error) {
    console.error('Database check error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    )
  }
}