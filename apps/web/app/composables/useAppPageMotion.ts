/**
 * Shared enter + list stagger for admin, instructor, and similar app screens.
 */
export function useAppPageMotion() {
  const pageEnter = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35 },
  } as const

  const listStagger = (index: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.4,
      delay: Math.min(0.05 * index, 0.45),
    },
  })

  return { pageEnter, listStagger }
}
