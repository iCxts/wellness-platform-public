import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { fetchScheduleByTab } from '~/services/schedule'
import { type ScheduleTab } from '~/schemas/schedule'

export const scheduleQueryKeys = {
  list: (tab: ScheduleTab) => ['schedule', tab] as const,
}

export const useScheduleList = (tab: Ref<ScheduleTab>) => {
  const query = useQuery({
    queryKey: computed(() => scheduleQueryKeys.list(tab.value)),
    queryFn: () => fetchScheduleByTab(tab.value),
  })

  return query
}
