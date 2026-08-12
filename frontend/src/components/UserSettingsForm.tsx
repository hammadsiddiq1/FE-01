import { useState, type FormEvent } from 'react'
import {
  defaultUserSettings,
  type ThemePreference,
  type UserSettings,
} from '../types/userSettings'
import './UserSettingsForm.css'

type FormErrors = Partial<Record<keyof UserSettings, string>>

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'ja', label: 'Japanese' },
]

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
  'UTC',
]

function validate(settings: UserSettings): FormErrors {
  const errors: FormErrors = {}

  if (!settings.displayName.trim()) {
    errors.displayName = 'Display name is required'
  }

  if (!settings.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
    errors.email = 'Enter a valid email address'
  }

  if (settings.bio.length > 280) {
    errors.bio = 'Bio must be 280 characters or fewer'
  }

  return errors
}

type ToggleFieldProps = {
  id: keyof UserSettings
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function ToggleField({
  id,
  label,
  description,
  checked,
  onChange,
}: ToggleFieldProps) {
  return (
    <div className="toggle-field">
      <div className="toggle-label">
        <span>{label}</span>
        <small>{description}</small>
      </div>
      <label className="toggle-switch" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="toggle-slider" />
      </label>
    </div>
  )
}

export default function UserSettingsForm() {
  const [settings, setSettings] = useState<UserSettings>(defaultUserSettings)
  const [savedSettings, setSavedSettings] =
    useState<UserSettings>(defaultUserSettings)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isSaving, setIsSaving] = useState(false)

  const isDirty = JSON.stringify(settings) !== JSON.stringify(savedSettings)

  function updateField<K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K],
  ) {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setStatus('idle')
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const validationErrors = validate(settings)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setStatus('error')
      return
    }

    setIsSaving(true)
    setErrors({})

    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      setSavedSettings(settings)
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  function handleReset() {
    setSettings(savedSettings)
    setErrors({})
    setStatus('idle')
  }

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1>Settings</h1>
        <p>Manage your profile and preferences</p>
      </header>

      <form className="settings-form" onSubmit={handleSubmit} noValidate>
        <section className="settings-section" aria-labelledby="profile-heading">
          <h2 id="profile-heading" className="settings-section-title">
            Profile
          </h2>
          <p className="settings-section-desc">
            Your public profile information
          </p>

          <div className="field">
            <label htmlFor="displayName">Display name</label>
            <input
              id="displayName"
              type="text"
              value={settings.displayName}
              onChange={(e) => updateField('displayName', e.target.value)}
              className={errors.displayName ? 'field-error' : ''}
              autoComplete="name"
              placeholder="Jane Doe"
            />
            {errors.displayName && (
              <p className="field-error-text">{errors.displayName}</p>
            )}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={errors.email ? 'field-error' : ''}
              autoComplete="email"
              placeholder="jane@example.com"
            />
            {errors.email && (
              <p className="field-error-text">{errors.email}</p>
            )}
          </div>

          <div className="field">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={settings.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              className={errors.bio ? 'field-error' : ''}
              placeholder="Tell us a little about yourself"
              maxLength={280}
            />
            <p className="field-hint">{settings.bio.length}/280 characters</p>
            {errors.bio && <p className="field-error-text">{errors.bio}</p>}
          </div>
        </section>

        <section
          className="settings-section"
          aria-labelledby="preferences-heading"
        >
          <h2 id="preferences-heading" className="settings-section-title">
            Preferences
          </h2>
          <p className="settings-section-desc">
            Customize your experience
          </p>

          <div className="field">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              value={settings.theme}
              onChange={(e) =>
                updateField('theme', e.target.value as ThemePreference)
              }
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              value={settings.language}
              onChange={(e) => updateField('language', e.target.value)}
            >
              {LANGUAGES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="timezone">Timezone</label>
            <select
              id="timezone"
              value={settings.timezone}
              onChange={(e) => updateField('timezone', e.target.value)}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section
          className="settings-section"
          aria-labelledby="notifications-heading"
        >
          <h2 id="notifications-heading" className="settings-section-title">
            Notifications
          </h2>
          <p className="settings-section-desc">
            Choose how you want to be notified
          </p>

          <ToggleField
            id="emailNotifications"
            label="Email notifications"
            description="Receive updates about your account activity"
            checked={settings.emailNotifications}
            onChange={(checked) => updateField('emailNotifications', checked)}
          />

          <ToggleField
            id="pushNotifications"
            label="Push notifications"
            description="Get real-time alerts in your browser"
            checked={settings.pushNotifications}
            onChange={(checked) => updateField('pushNotifications', checked)}
          />

          <ToggleField
            id="marketingEmails"
            label="Marketing emails"
            description="Product news, tips, and special offers"
            checked={settings.marketingEmails}
            onChange={(checked) => updateField('marketingEmails', checked)}
          />
        </section>

        {status === 'success' && (
          <p className="settings-status settings-status--success" role="status">
            Settings saved successfully.
          </p>
        )}

        {status === 'error' && Object.keys(errors).length > 0 && (
          <p className="settings-status settings-status--error" role="alert">
            Please fix the errors above before saving.
          </p>
        )}

        <div className="settings-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={!isDirty || isSaving}
          >
            Reset
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isDirty || isSaving}
          >
            {isSaving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
