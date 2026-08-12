import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchProfileSettings,
  saveProfileSettings,
} from '../../api/profileSettings'

export const profileSettingsQueryKey = ['profileSettings'] as const

export function useProfileSettings() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: profileSettingsQueryKey,
    queryFn: fetchProfileSettings,
  })

  const mutation = useMutation({
    mutationFn: saveProfileSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(profileSettingsQueryKey, data)
    },
  })

  return {
    profile: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    saveProfile: mutation.mutateAsync,
    isSaving: mutation.isPending,
    saveError: mutation.error,
  }
}
