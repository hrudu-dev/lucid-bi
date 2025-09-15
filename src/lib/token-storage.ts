// Simple in-memory token storage for development
// In production, this should be replaced with database storage

export interface ResetToken {
  token: string
  email: string
  expiresAt: Date
}

class TokenStorage {
  private tokens: ResetToken[] = []

  addToken(token: ResetToken) {
    this.tokens.push(token)
  }

  findToken(token: string): ResetToken | undefined {
    return this.tokens.find(t => t.token === token && t.expiresAt > new Date())
  }

  removeToken(token: string) {
    const index = this.tokens.findIndex(t => t.token === token)
    if (index > -1) {
      this.tokens.splice(index, 1)
    }
  }

  cleanup() {
    const now = new Date()
    this.tokens = this.tokens.filter(t => t.expiresAt > now)
  }
}

export const tokenStorage = new TokenStorage()