import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  profileSettingsSchema,
  type ProfileSettingsFormValues,
} from './profileSettingsSchema'
import { useProfileSettings } from './useProfileSettings'

type FieldProps = {
  id: string
  label: string
  error?: string
  children: (props: {
    id: string
    'aria-invalid': boolean
    'aria-describedby': string | undefined
  }) => React.ReactNode
}

function FormField({ id, label, error, children }: FieldProps) {
  const errorId = `${id}-error`
  const describedBy = error ? errorId : undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      {children({
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': describedBy,
      })}
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-red-600"
          aria-live="polite"
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function ProfileSettingsForm() {
  const formId = useId()
  const { profile, isLoading, isError, saveProfile, isSaving } =
    useProfileSettings()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileSettingsFormValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      fullName: '',
      email: '',
      marketingEmails: false,
    },
  })

  useEffect(() => {
    if (profile) {
      reset(profile)
    }
  }, [profile, reset])

  const onSubmit = handleSubmit(async (values) => {
    await saveProfile(values)
  })

  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        <p className="text-sm text-slate-600">Loading profile settings…</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700"
      >
        <p className="text-sm">Unable to load profile settings. Please try again.</p>
      </div>
    )
  }

  return (
    <form
      id={formId}
      noValidate
      onSubmit={onSubmit}
      aria-labelledby={`${formId}-heading`}
      className="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2
        id={`${formId}-heading`}
        className="mb-6 text-xl font-semibold text-slate-900"
      >
        Profile Settings
      </h2>

      <div className="flex flex-col gap-5">
        <FormField
          id={`${formId}-fullName`}
          label="Full name"
          error={errors.fullName?.message}
        >
          {(fieldProps) => (
            <input
              type="text"
              autoComplete="name"
              className="rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 aria-invalid:border-red-500 aria-invalid:ring-red-200"
              {...fieldProps}
              {...register('fullName')}
            />
          )}
        </FormField>

        <FormField
          id={`${formId}-email`}
          label="Email address"
          error={errors.email?.message}
        >
          {(fieldProps) => (
            <input
              type="email"
              autoComplete="email"
              className="rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 aria-invalid:border-red-500 aria-invalid:ring-red-200"
              {...fieldProps}
              {...register('email')}
            />
          )}
        </FormField>

        <div className="flex items-start gap-3">
          <input
            id={`${formId}-marketingEmails`}
            type="checkbox"
            className="mt-1 size-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
            aria-describedby={`${formId}-marketingEmails-hint`}
            {...register('marketingEmails')}
          />
          <div className="flex flex-col gap-1">
            <label
              htmlFor={`${formId}-marketingEmails`}
              className="text-sm font-medium text-slate-700"
            >
              Marketing emails
            </label>
            <p
              id={`${formId}-marketingEmails-hint`}
              className="text-sm text-slate-500"
            >
              Receive product updates and promotional content.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          aria-busy={isSaving}
          className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}
