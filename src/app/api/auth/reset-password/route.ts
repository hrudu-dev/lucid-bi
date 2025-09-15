import { NextRequest, NextResponse } from 'next/server'
import { tokenStorage } from '@/lib/token-storage'

interface ResetPasswordRequest {
  token: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    const { token, password }: ResetPasswordRequest = await request.json()
    
    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: 'Token and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Find and validate token
    const resetTokenData = tokenStorage.findToken(token)
    
    if (!resetTokenData) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // In production:
    // 1. Hash the new password
    // 2. Update the user's password in the database
    // 3. Invalidate all existing sessions for this user
    
    console.log(`Password reset for ${resetTokenData.email}: New password would be updated`)
    
    // Remove used token
    tokenStorage.removeToken(token)
    
    // Simulate password update delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. You can now sign in with your new password.'
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}