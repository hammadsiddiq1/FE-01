import { z } from 'zod'

export const profileSettingsSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  marketingEmails: z.boolean(),
})

export type ProfileSettingsFormValues = z.infer<typeof profileSettingsSchema>
