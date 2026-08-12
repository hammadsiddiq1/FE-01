import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ProfileSettingsForm } from './ProfileSettingsForm'
import * as profileSettingsApi from '../../api/profileSettings'

vi.mock('../../api/profileSettings', () => ({
  fetchProfileSettings: vi.fn(),
  saveProfileSettings: vi.fn(),
}))

const mockProfile = {
  fullName: 'Jane Doe',
  email: 'jane.doe@example.com',
  marketingEmails: true,
}

function renderForm() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <ProfileSettingsForm />
    </QueryClientProvider>,
  )
}

describe('ProfileSettingsForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(profileSettingsApi.fetchProfileSettings).mockResolvedValue(
      mockProfile,
    )
    vi.mocked(profileSettingsApi.saveProfileSettings).mockResolvedValue(
      mockProfile,
    )
  })

  async function waitForFormReady() {
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /profile settings/i })).toBeInTheDocument()
    })
  }

  it('shows validation error when full name is empty', async () => {
    const user = userEvent.setup()
    renderForm()
    await waitForFormReady()

    await user.clear(screen.getByLabelText(/full name/i))
    await user.clear(screen.getByLabelText(/email address/i))
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    const fullNameInput = screen.getByLabelText(/full name/i)
    const error = await screen.findByText('Full name is required')

    expect(error).toHaveTextContent('Full name is required')
    expect(fullNameInput).toHaveAttribute('aria-invalid', 'true')
    expect(fullNameInput).toHaveAttribute('aria-describedby', expect.stringContaining('-error'))
    expect(profileSettingsApi.saveProfileSettings).not.toHaveBeenCalled()
  })

  it('shows validation error when full name is too short', async () => {
    const user = userEvent.setup()
    renderForm()
    await waitForFormReady()

    await user.clear(screen.getByLabelText(/full name/i))
    await user.type(screen.getByLabelText(/full name/i), 'A')
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    const error = await screen.findByText(/full name must be at least 2 characters/i)

    expect(error).toBeInTheDocument()
    expect(profileSettingsApi.saveProfileSettings).not.toHaveBeenCalled()
  })

  it('shows validation error when email is empty', async () => {
    const user = userEvent.setup()
    renderForm()
    await waitForFormReady()

    await user.clear(screen.getByLabelText(/email address/i))
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    const emailInput = screen.getByLabelText(/email address/i)
    const error = await screen.findByText('Email is required')

    expect(error).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('aria-invalid', 'true')
    expect(emailInput).toHaveAttribute('aria-describedby', expect.stringContaining('-error'))
    expect(profileSettingsApi.saveProfileSettings).not.toHaveBeenCalled()
  })

  it('shows validation error when email format is invalid', async () => {
    const user = userEvent.setup()
    renderForm()
    await waitForFormReady()

    await user.clear(screen.getByLabelText(/email address/i))
    await user.type(screen.getByLabelText(/email address/i), 'not-an-email')
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    const emailInput = screen.getByLabelText(/email address/i)
    const error = await screen.findByText('Enter a valid email address')

    expect(error).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('aria-invalid', 'true')
    expect(profileSettingsApi.saveProfileSettings).not.toHaveBeenCalled()
  })

  it('shows multiple validation errors for empty submit', async () => {
    const user = userEvent.setup()
    renderForm()
    await waitForFormReady()

    await user.clear(screen.getByLabelText(/full name/i))
    await user.clear(screen.getByLabelText(/email address/i))
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    expect(await screen.findByText('Full name is required')).toBeInTheDocument()
    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(profileSettingsApi.saveProfileSettings).not.toHaveBeenCalled()
  })

  it('keeps form keyboard navigable with visible focus order', async () => {
    const user = userEvent.setup()
    renderForm()
    await waitForFormReady()

    await user.tab()
    expect(screen.getByLabelText(/full name/i)).toHaveFocus()

    await user.tab()
    expect(screen.getByLabelText(/email address/i)).toHaveFocus()

    await user.tab()
    expect(screen.getByLabelText(/marketing emails/i)).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('button', { name: /save changes/i })).toHaveFocus()
  })
})
