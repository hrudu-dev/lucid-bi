import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

interface LoginRequest {
  email: string
  password: string
}

// Demo users for testing
const DEMO_USERS = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'password',
    name: 'Test User',
    role: 'admin'
  },
  {
    id: '2',
    email: 'admin@lucidbi.com', 
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: '3',
    email: 'viewer@lucidbi.com',
    password: 'viewer123', 
    name: 'Viewer User',
    role: 'viewer'
  }
]

export async function POST(request: NextRequest) {
  try {
    const { email, password }: LoginRequest = await request.json()
    
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
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create session token (in production, use proper JWT or session management)
    const sessionToken = Buffer.from(`${user.id}:${Date.now()}`).toString('base64')
    
    // Set cookie
    const cookieStore = cookies()
    cookieStore.set('user-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    // Return user info (don't send password)
    const { password: _, ...userInfo } = user

    return NextResponse.json({
      success: true,
      user: userInfo,
      message: 'Login successful'
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}