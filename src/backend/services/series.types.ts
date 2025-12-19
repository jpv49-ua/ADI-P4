export interface Series {
  id: string
  title: string
  year: number
  genre?: string
  seasons: number
  episodes: number
  synopsis?: string
  director?: string
  poster?: string
  owner: string
  created: string
  updated: string
}

export interface SeriesPayload {
  title: string
  year: number
  genre?: string
  seasons: number
  episodes: number
  synopsis?: string
  director?: string
  poster?: File | null
}