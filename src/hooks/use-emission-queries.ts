import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DEFAULT_VOTE_UNIT_PRICE, USE_MOCK_DATA } from '../config/app-config'
import { ApiHttpError } from '../lib/api/errors/api-http-error'
import { emissionRequest } from '../lib/emission-request'
import {
  mapEditionFullDetailToEdition,
  mapEditionListItemToTab,
  type EditionCatalogTab,
} from '../lib/map-emission'
import {
  pickActiveNestedEdition,
  resolveConfiguredEmissionId,
} from '../lib/resolve-latest-emission'

const EDITION_LIST_PARAMS = { page: 1, limit: 50 } as const
const RANKING_PARAMS = { page: 1, limit: 100 } as const
const EMISSION_LIST_PARAMS = { page: 1, limit: 50, isPublic: true } as const
const EMISSION_STALE_MS = 5 * 60_000

function shouldRetryEmission(failureCount: number, error: unknown): boolean {
  if (ApiHttpError.isInstance(error) && error.status === 429) return false
  return failureCount < 1
}

export const emissionQueryKeys = {
  emissionsList: ['emission', 'list', 'public'] as const,
  emission: (id: string) => ['emission', id] as const,
  editions: (id: string) => ['emission', id, 'editions'] as const,
  activeEdition: (id: string) => ['emission', id, 'active-edition'] as const,
  editionDetail: (editionId: string) => ['edition', editionId] as const,
  editionRanking: (editionId: string) => ['edition', editionId, 'ranking'] as const,
  categories: (editionId: string) => ['edition', editionId, 'categories'] as const,
  candidate: (candidateId: string) => ['candidate', candidateId] as const,
}

/** Dernière émission publique (ou VITE_EMISSION_ID si défini). */
export function useResolvedEmission() {
  const listQuery = useQuery({
    queryKey: emissionQueryKeys.emissionsList,
    queryFn: () => emissionRequest.list(EMISSION_LIST_PARAMS),
    enabled: !USE_MOCK_DATA,
    staleTime: EMISSION_STALE_MS,
    retry: shouldRetryEmission,
    refetchOnWindowFocus: false,
  })

  const selected = listQuery.data?.data
    ? resolveConfiguredEmissionId(listQuery.data.data)
    : null

  const nestedEdition = useMemo(
    () => pickActiveNestedEdition(selected?.editions),
    [selected?.editions],
  )

  const detailQuery = useQuery({
    queryKey: selected ? emissionQueryKeys.emission(selected.id) : ['emission', 'none'],
    queryFn: () => emissionRequest.getById(selected!.id),
    enabled: !USE_MOCK_DATA && Boolean(selected?.id),
    staleTime: EMISSION_STALE_MS,
    retry: shouldRetryEmission,
    refetchOnWindowFocus: false,
  })

  const pointsPerVote =
    detailQuery.data?.data.pointsPerVote ??
    selected?.pointsPerVote ??
    DEFAULT_VOTE_UNIT_PRICE

  /** Prix FCFA d’un vote : priorité au champ édition voteAmountPerVote. */
  const voteAmountPerVote =
    nestedEdition?.voteAmountPerVote ??
    pointsPerVote ??
    DEFAULT_VOTE_UNIT_PRICE

  const emissionDescription =
    detailQuery.data?.data.description?.trim() ||
    selected?.description?.trim() ||
    ''

  return {
    emission: selected,
    nestedEdition,
    emissionDescription,
    pointsPerVote,
    voteAmountPerVote,
    isLoading: listQuery.isLoading || (Boolean(selected) && detailQuery.isLoading),
    isError: listQuery.isError || detailQuery.isError,
    error: listQuery.error ?? detailQuery.error,
  }
}

/**
 * Édition active : résumé issu de GET /emission[].editions,
 * enrichi par GET /emission/editions/{id} quand disponible.
 */
export function useActiveEdition() {
  const { emission, nestedEdition } = useResolvedEmission()
  const editionId = nestedEdition?.id ?? null

  const detailQuery = useQuery({
    queryKey: editionId ? emissionQueryKeys.editionDetail(editionId) : ['edition', 'active-none'],
    queryFn: async () => {
      const res = await emissionRequest.getEditionById(editionId as string)
      return res.data
    },
    enabled: !USE_MOCK_DATA && Boolean(editionId),
    staleTime: EMISSION_STALE_MS,
    retry: shouldRetryEmission,
    refetchOnWindowFocus: false,
  })

  const data = detailQuery.data ?? nestedEdition ?? null

  return {
    ...detailQuery,
    data,
    nestedEdition,
    emission,
    isLoading: Boolean(emission) && !nestedEdition ? false : detailQuery.isLoading && !nestedEdition,
    isPending: detailQuery.isPending && !nestedEdition,
  }
}

/** @deprecated Prefer useActiveEdition().data?.id */
export function useActiveEditionId() {
  const query = useActiveEdition()
  return {
    ...query,
    data: query.data?.id ?? null,
  }
}

/** Catégories + tags (métiers) autorisés pour une édition. */
export function useEmissionCategories(editionId: string | null) {
  return useQuery({
    queryKey: editionId
      ? emissionQueryKeys.categories(editionId)
      : ['edition', 'categories', 'none'],
    queryFn: async () => {
      const res = await emissionRequest.listCategories({
        editionId: editionId as string,
        page: 1,
        limit: 100,
      })
      return [...res.data].sort((a, b) => a.sortOrder - b.sortOrder).map((category) => ({
        ...category,
        tags: [...category.tags]
          .filter((tag) => tag.active)
          .sort((a, b) => a.sortOrder - b.sortOrder),
      }))
    },
    enabled: !USE_MOCK_DATA && Boolean(editionId),
    staleTime: EMISSION_STALE_MS,
    retry: shouldRetryEmission,
    refetchOnWindowFocus: false,
  })
}

export function useEmissionEditionsCatalog(emissionId: string | null) {
  return useQuery({
    queryKey: emissionId ? emissionQueryKeys.editions(emissionId) : ['emission', 'editions', 'none'],
    queryFn: async (): Promise<EditionCatalogTab[]> => {
      const res = await emissionRequest.listEditions(emissionId as string, EDITION_LIST_PARAMS)
      return res.data.map(mapEditionListItemToTab).sort((a, b) => b.year - a.year)
    },
    enabled: !USE_MOCK_DATA && Boolean(emissionId),
    staleTime: EMISSION_STALE_MS,
    retry: shouldRetryEmission,
    refetchOnWindowFocus: false,
  })
}

export function useEditionFromApi(editionId: string | null, pointsPerVote: number) {
  const detailQuery = useQuery({
    queryKey: editionId ? emissionQueryKeys.editionDetail(editionId) : ['edition', 'none'],
    queryFn: async () => {
      const res = await emissionRequest.getEditionById(editionId as string)
      return res.data
    },
    enabled: !USE_MOCK_DATA && Boolean(editionId),
    staleTime: EMISSION_STALE_MS,
    retry: shouldRetryEmission,
    refetchOnWindowFocus: false,
  })

  const rankingQuery = useQuery({
    queryKey: editionId ? emissionQueryKeys.editionRanking(editionId) : ['edition', 'ranking', 'none'],
    queryFn: () => emissionRequest.getEditionRanking(editionId as string, RANKING_PARAMS),
    enabled: !USE_MOCK_DATA && Boolean(editionId),
    staleTime: EMISSION_STALE_MS,
    retry: shouldRetryEmission,
    refetchOnWindowFocus: false,
  })

  const isLoading = detailQuery.isLoading || rankingQuery.isLoading
  const isError = detailQuery.isError || rankingQuery.isError
  const error = detailQuery.error ?? rankingQuery.error

  const voteUnit = detailQuery.data?.voteAmountPerVote ?? pointsPerVote

  const edition =
    detailQuery.data && editionId
      ? mapEditionFullDetailToEdition(
          detailQuery.data,
          rankingQuery.data?.data ?? [],
          voteUnit,
        )
      : null

  return { edition, isLoading, isError, error, refetch: detailQuery.refetch }
}

export function useCandidateFromApi(candidateId: string | null, pointsPerVote: number) {
  const candidateQuery = useQuery({
    queryKey: candidateId ? emissionQueryKeys.candidate(candidateId) : ['candidate', 'none'],
    queryFn: () => emissionRequest.getCandidateById(candidateId as string),
    enabled: !USE_MOCK_DATA && Boolean(candidateId),
    staleTime: 30_000,
    retry: shouldRetryEmission,
    refetchOnWindowFocus: false,
  })

  const editionId = candidateQuery.data?.data.editionId ?? null

  const rankingQuery = useQuery({
    queryKey: editionId ? emissionQueryKeys.editionRanking(editionId) : ['edition', 'ranking', 'none'],
    queryFn: () => emissionRequest.getEditionRanking(editionId as string, RANKING_PARAMS),
    enabled: !USE_MOCK_DATA && Boolean(editionId),
    staleTime: 30_000,
    retry: shouldRetryEmission,
    refetchOnWindowFocus: false,
  })

  const candidateDto = candidateQuery.data?.data
  const rank = rankingQuery.data?.data.find((row) => row.id === candidateId)?.rank ?? 0

  return {
    candidateDto,
    editionMeta: candidateDto?.edition ?? null,
    rank: rank > 0 ? rank : 0,
    isLoading: candidateQuery.isLoading,
    isError: candidateQuery.isError,
    error: candidateQuery.error,
    pointsPerVote,
  }
}
