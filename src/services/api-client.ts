import { createAppHttpClient, createEmissionApi, createNewsApi } from '../lib/api'

const httpClient = createAppHttpClient()

export const emissionApi = createEmissionApi(httpClient)
export const newsApi = createNewsApi(httpClient)
