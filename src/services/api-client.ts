import { createAppHttpClient } from '../lib/api/create-app-http-client'
import { createAuthApi } from '../lib/api/modules/auth'
import { createCountriesApi } from '../lib/api/modules/countries'
import { createEmissionApi } from '../lib/api/modules/emission'
import { createNewsApi } from '../lib/api/modules/news'
import { createProfileApi } from '../lib/api/modules/profile'
import { createUploadsApi } from '../lib/api/modules/uploads'
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  setAuthSession,
} from '../lib/auth-session'

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null
  try {
    // Client sans refresh récursif pour éviter une boucle 401.
    const bare = createAppHttpClient({ skipAuth: true })
    const auth = createAuthApi(bare)
    const res = await auth.refresh({ refreshToken })
    const accessToken = res.data.accessToken
    if (!accessToken) return null
    setAuthSession({
      accessToken,
      refreshToken: res.data.refreshToken ?? refreshToken,
    })
    return accessToken
  } catch {
    clearAuthSession()
    return null
  }
}

const httpClient = createAppHttpClient({
  getToken: getAccessToken,
  refreshAccessToken,
})

export const emissionApi = createEmissionApi(httpClient)
export const newsApi = createNewsApi(httpClient)
export const authApi = createAuthApi(httpClient)
export const uploadsApi = createUploadsApi(httpClient)
export const countriesApi = createCountriesApi(httpClient)
export const profileApi = createProfileApi(httpClient)
