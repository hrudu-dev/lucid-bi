import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'

interface SignupRequest {
  name: string
  email: string
  password: string
}

// In-memory user storage for demo (use database in production)
const users: Array<{
  id: string
  email: string
  password: string
  name: string
  role: string
  createdAt: string
}> = []

export async function POST(request: NextRequest) {
  try {
    const { name, email, password }: SignupRequest = await request.json()
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Also check demo users
    const DEMO_USERS = [
      { email: 'test@example.com' },
      { email: 'admin@lucidbi.com' },
      { email: 'viewer@lucidbi.com' }
    ]
    
    if (DEMO_USERS.some(u => u.email === email)) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create new user (in production, hash the password)
    const newUser = {
      id: randomUUID(),
      email,
      password, // Hash this in production!
      name,
      role: 'user',
      createdAt: new Date().toISOString()
    }

    users.push(newUser)

    // Create session token
    const sessionToken = Buffer.from(`${newUser.id}:${Date.now()}`).toString('base64')
    
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
    const { password: _, ...userInfo } = newUser

    return NextResponse.json({
      success: true,
      user: userInfo,
      message: 'Account created successfully'
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}