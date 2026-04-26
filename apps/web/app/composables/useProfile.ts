import { useQuery } from '@tanstack/vue-query'
import { fetchProfileData } from '~/services/profile'

export const profileQueryKeys = {
  data: ['profile', 'data'] as const,
}

export const useProfileData = () =>
  useQuery({
    queryKey: profileQueryKeys.data,
    queryFn: fetchProfileData,
  })
