import { NextRequest, NextResponse } from 'next/server'

// Simple demo authentication for hackathon
// In production, use proper authentication like NextAuth.js

interface AuthRequest {
  email: string
  password: string
}

// Demo users for testing
const DEMO_USERS = [
  {
    email: 'test@example.com',
    password: 'password',
    name: 'Test User',
    role: 'admin'
  },
  {
    email: 'admin@lucidbi.com', 
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  },
  {
    email: 'viewer@lucidbi.com',
    password: 'viewer123', 
    name: 'Viewer User',
    role: 'viewer'
  }
]

export async function POST(request: NextRequest) {
  try {
    const { email, password }: AuthRequest = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Find user (in production, hash passwords properly)
    const user = DEMO_USERS.find(u => u.email === email && u.password === password)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create session token (in production, use proper JWT)
    const sessionToken = Buffer.from(JSON.stringify({
      email: user.email,
      name: user.name,
      role: user.role,
      timestamp: Date.now()
    })).toString('base64')

    const response = NextResponse.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

    // Set session cookie
    response.cookies.set('lucid-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 // 24 hours
    })

    return response

  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('lucid-session')?.value
    
    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'No session found' },
        { status: 401 }
      )
    }

    // Decode session (in production, verify JWT properly)
    const session = JSON.parse(Buffer.from(sessionToken, 'base64').toString())
    
    // Check if session is expired (24 hours)
    if (Date.now() - session.timestamp > 86400000) {
      return NextResponse.json(
        { success: false, error: 'Session expired' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        email: session.email,
        name: session.name,
        role: session.role
      }
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid session' },
      { status: 401 }
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out' })
  response.cookies.delete('lucid-session')
  return response
}