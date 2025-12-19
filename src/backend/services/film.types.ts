export interface Film {
  id: string
  title: string
  year: number
  genre?: string
  synopsis?: string
  director?: string
  poster?: string
  owner: string
  created: string
  updated: string
}

export interface FilmPayload {
  title: string
  year: number
  genre?: string
  synopsis?: string
  director?: string
  poster?: File | null
}