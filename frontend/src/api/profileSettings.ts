import type { ProfileSettings } from '../types/profileSettings'

const MOCK_PROFILE: ProfileSettings = {
  fullName: 'Jane Doe',
  email: 'jane.doe@example.com',
  marketingEmails: true,
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchProfileSettings(): Promise<ProfileSettings> {
  await delay(300)
  return { ...MOCK_PROFILE }
}

export async function saveProfileSettings(
  settings: ProfileSettings,
): Promise<ProfileSettings> {
  await delay(300)
  return { ...settings }
}
