import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { fetchClassById, fetchExploreClasses } from '~/services/explore'
import type { ExploreFilter } from '~/schemas/explore'

export const exploreQueryKeys = {
  classes: (filter: ExploreFilter) => ['explore', 'classes', filter] as const,
  classDetail: (id: string) => ['explore', 'class-detail', id] as const,
}

export const useExploreClasses = (filter: Ref<ExploreFilter>) =>
  useQuery({
    queryKey: computed(() => exploreQueryKeys.classes(filter.value)),
    queryFn: () => fetchExploreClasses(filter.value),
  })

export const useClassDetail = (id: Ref<string>) =>
  useQuery({
    queryKey: computed(() => exploreQueryKeys.classDetail(id.value)),
    queryFn: () => fetchClassById(id.value),
  })
