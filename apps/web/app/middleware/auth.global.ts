export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()
  const hasValidatedSession = useState<boolean>('auth:me-validated', () => false)
  auth.hydrate()

  const isAuthPage = to.path === '/login' || to.path === '/register'
  const userRole = auth.user.value?.role

  if (isAuthPage && userRole) {
    return navigateTo(auth.getHomePathByRole(userRole), { replace: true })
  }

  if (isAuthPage) return

  if (!auth.token.value || !userRole) {
    return navigateTo('/login', { replace: true })
  }

  const isAdminRoute = to.path.startsWith('/admin')
  const isInstructorRoute = to.path.startsWith('/instructor')

  if (isAdminRoute && userRole !== 'admin') {
    return navigateTo(auth.getHomePathByRole(userRole), { replace: true })
  }

  if (isInstructorRoute && userRole !== 'instructor' && userRole !== 'admin') {
    return navigateTo(auth.getHomePathByRole(userRole), { replace: true })
  }

  if (!hasValidatedSession.value) {
    const me = await auth.fetchMe()
    hasValidatedSession.value = true
    if (!me) {
      return navigateTo('/login', { replace: true })
    }
  }
})
