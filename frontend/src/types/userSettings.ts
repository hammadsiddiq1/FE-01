export type ThemePreference = 'light' | 'dark' | 'system'

export type UserSettings = {
  displayName: string
  email: string
  bio: string
  theme: ThemePreference
  language: string
  timezone: string
  emailNotifications: boolean
  pushNotifications: boolean
  marketingEmails: boolean
}

export const defaultUserSettings: UserSettings = {
  displayName: '',
  email: '',
  bio: '',
  theme: 'system',
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  emailNotifications: true,
  pushNotifications: false,
  marketingEmails: false,
}
