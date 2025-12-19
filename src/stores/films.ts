import { defineStore } from "pinia";
import { listFilm, createFilm, deleteFilm, editFilm, searchFilm } from "@/backend/services/filmService";
import type { Film, FilmPayload } from "@/backend/services/film.types"

export const useFilmStore = defineStore("films", {
    state: () => ({
        films: [] as Film[]
    }),

    actions: {
        async listFilm(): Promise<void> {
            this.films = await listFilm()
        },

        async createFilm(data: FilmPayload): Promise<void> {
            const newFilm = await createFilm(data)
            this.films.push(newFilm)
        },

        async deleteFilm(id: string): Promise<void> {
            await deleteFilm(id)
            this.films = this.films.filter(film => film.id !== id)
        },

        async editFilm(id: string, updatedData: FilmPayload): Promise<void> {
            const updatedFilm = await editFilm(id, updatedData)
            const index = this.films.findIndex(film => film.id === id)

            if (index !== -1) {
                this.films[index] = updatedFilm
            }
        },

        async searchFilm(title: string): Promise<Film | null> {
            return await searchFilm(title)
        }
    }
})