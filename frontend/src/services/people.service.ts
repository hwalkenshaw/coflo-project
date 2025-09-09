import api from './api'

export type PersonDto = {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  age: number
  createdAt: string
  updatedAt?: string
}

export type PagedResult<T> = {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export type GetPeopleParams = {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  minAge?: number
  maxAge?: number
}

export async function getPeople(params: GetPeopleParams = {}): Promise<PagedResult<PersonDto>> {
  const { data } = await api.get<PagedResult<PersonDto>>('/v1/people', { params })
  return data
}

export async function createPerson(payload: { firstName: string; lastName: string; dateOfBirth: string }) {
  const { data } = await api.post<PersonDto>('/v1/people', payload)
  return data
}

export async function updatePerson(id: string, payload: { firstName: string; lastName: string; dateOfBirth: string }) {
  const { data } = await api.put<PersonDto>(`/v1/people/${id}`, payload)
  return data
}

export async function deletePerson(id: string) {
  await api.delete(`/v1/people/${id}`)
}

export type PeopleStatsDto = {
  totalCount: number
  percentageChange: number
  averageAge: number
  medianAge: number
  youngest: number
  oldest: number
  upcomingBirthdays: {
    id: string
    name: string
    dateOfBirth: string
    age: number
    daysUntilBirthday: number
  }[]
  ageGroups: {
    range: string
    count: number
    percentage: number
  }[]
  recentActivities: {
    id: string
    type: string
    personName: string
    personAvatar: string
    performedBy: string
    performedByAvatar: string
    timestamp: string
    details?: string
    department?: string
  }[]
}

export async function getPeopleStats(): Promise<PeopleStatsDto> {
  const { data } = await api.get<PeopleStatsDto>('/v1/people/stats')
  return data
}
