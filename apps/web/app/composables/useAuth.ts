type AuthRole = 'member' | 'instructor' | 'admin'

type AuthUser = {
  id: string
  email: string
  role: AuthRole
}

type LoginResponse = {
  token: string
  user: AuthUser
}

type RegisterPayload = {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

type UserMeResponse = {
  id: string
  email: string
  role: AuthRole
}

const AUTH_STORAGE_KEY = 'bwell.auth.session'

function normalizeApiError(error: unknown, fallback: string): string {
  const data = (error as { data?: { error?: string } })?.data
  if (typeof data?.error === 'string' && data.error.length > 0) return data.error
  return fallback
}

export function useAuth() {
  const config = useRuntimeConfig()
  const token = useState<string | null>('auth:token', () => null)
  const user = useState<AuthUser | null>('auth:user', () => null)
  const isHydrated = useState<boolean>('auth:hydrated', () => false)
  const hasValidatedSession = useState<boolean>('auth:me-validated', () => false)

  const apiBase = computed(
    () => config.public.apiBase || 'http://localhost:3001',
  )
  const isAuthenticated = computed(() => Boolean(token.value && user.value))

  const persist = () => {
    if (!import.meta.client) return
    if (!token.value || !user.value) {
      window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
      return
    }
    window.sessionStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ token: token.value, user: user.value }),
    )
  }

  const hydrate = () => {
    if (!import.meta.client || isHydrated.value) return
    const saved = window.sessionStorage.getItem(AUTH_STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as {
          token?: string
          user?: AuthUser
        }
        token.value = parsed.token ?? null
        user.value = parsed.user ?? null
      } catch {
        window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }
    isHydrated.value = true
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
    hasValidatedSession.value = false
    if (import.meta.client) {
      window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }

  const getHomePathByRole = (role: AuthRole) => {
    if (role === 'admin') return '/admin'
    if (role === 'instructor') return '/instructor'
    return '/'
  }

  const authHeaders = (): Record<string, string> | undefined => {
    if (!token.value) return undefined
    return { Authorization: `Bearer ${token.value}` }
  }

  const login = async (payload: { email: string; password: string }) => {
    try {
      const result = await $fetch<LoginResponse>('/auth/login', {
        method: 'POST',
        baseURL: apiBase.value,
        body: payload,
      })
      token.value = result.token
      user.value = result.user
      hasValidatedSession.value = false
      persist()
      return result
    } catch (error) {
      throw new Error(normalizeApiError(error, 'Login failed.'))
    }
  }

  const register = async (payload: RegisterPayload) => {
    try {
      await $fetch('/auth/register', {
        method: 'POST',
        baseURL: apiBase.value,
        body: payload,
      })
    } catch (error) {
      throw new Error(normalizeApiError(error, 'Registration failed.'))
    }
  }

  const fetchMe = async () => {
    if (!token.value) return null
    try {
      const me = await $fetch<UserMeResponse>('/users/me', {
        baseURL: apiBase.value,
        headers: authHeaders(),
      })
      user.value = { id: me.id, email: me.email, role: me.role }
      persist()
      return me
    } catch {
      clearAuth()
      return null
    }
  }

  const logout = () => {
    clearAuth()
  }

  return {
    token,
    user,
    isAuthenticated,
    hydrate,
    login,
    register,
    fetchMe,
    logout,
    getHomePathByRole,
  }
}
