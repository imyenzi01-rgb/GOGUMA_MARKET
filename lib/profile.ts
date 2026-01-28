// Profile management utilities for MVP
// Uses localStorage for simple profile storage
// TODO: Replace with Supabase Auth when implementing production auth

export interface StoredProfile {
  id: string
  username: string
  location: string
}

const PROFILE_KEY = 'gogumamarket_profile'

export function getStoredProfile(): StoredProfile | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(PROFILE_KEY)
    if (!stored) return null
    return JSON.parse(stored) as StoredProfile
  } catch (error) {
    console.error('Failed to get stored profile:', error)
    return null
  }
}

export function storeProfile(profile: StoredProfile): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  } catch (error) {
    console.error('Failed to store profile:', error)
  }
}

export function clearProfile(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(PROFILE_KEY)
  } catch (error) {
    console.error('Failed to clear profile:', error)
  }
}
