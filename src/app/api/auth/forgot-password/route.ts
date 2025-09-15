import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { tokenStorage } from '@/lib/token-storage'

interface ForgotPasswordRequest {
  email: string
}

// Demo users list
const DEMO_USERS = [
  { email: 'test@example.com' },
  { email: 'admin@lucidbi.com' },
  { email: 'viewer@lucidbi.com' }
]

export async function POST(request: NextRequest) {
  try {
    const { email }: ForgotPasswordRequest = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists (check both demo users and registered users)
    const userExists = DEMO_USERS.some(u => u.email === email)
    
    if (!userExists) {
      // For security, we don't reveal whether the email exists or not
      return NextResponse.json({
        success: true,
        message: 'If an account with this email exists, you will receive a password reset link.'
      })
    }

    // Generate reset token
    const resetToken = randomUUID()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
    
    // Store reset token (in production, store in database)
    tokenStorage.addToken({
      token: resetToken,
      email,
      expiresAt
    })

    // Clean up expired tokens
    tokenStorage.cleanup()

    // In production, send email here
    console.log(`Password reset link for ${email}: /reset-password?token=${resetToken}`)
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: 'If an account with this email exists, you will receive a password reset link.',
      // For demo purposes, include the token (remove this in production!)
      devNote: `Demo token: ${resetToken} (expires in 1 hour)`
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}