import { pb } from "../pb.js";
import type { Film, FilmPayload } from "./film.types"
import type { RecordModel } from "pocketbase"

// Crear película
export async function createFilm(data: FilmPayload): Promise<Film> {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("year", String(data.year));
  if (data.genre) formData.append("genre", data.genre);
  if (data.synopsis) formData.append("synopsis", data.synopsis);
  if (data.director) formData.append("director", data.director);

  if (data.poster){
    formData.append("poster", data.poster);
  }
  
  if (pb.authStore.model?.id) {
    formData.append("owner", pb.authStore.model.id);
  } else {
    throw new Error("Usuario no autenticado");
  }

  return await pb.collection("films").create(formData);
}

// Obtener todas las películas
export async function listFilm(): Promise<Film[]> {
  return await pb.collection("films").getFullList<Film>();
}

// Buscar película por título
export async function searchFilm(title: string): Promise<Film | null> {
  try {
    return await pb.collection("films").getFirstListItem<Film>(`title = "${title}" && owner = "${pb.authStore.model!.id}"`);
  } catch (error: any) {
    if (error?.status === 404) {
      return null; // No se encontró ninguna película con ese título
    }
    throw error;
  }
}

// Editar película
export async function editFilm(id: string, newData: FilmPayload): Promise<Film> {
  const formData = new FormData();

  formData.append("title", newData.title);
  formData.append("year", String(newData.year));
  if (newData.genre) formData.append("genre", newData.genre);
  if (newData.synopsis) formData.append("synopsis", newData.synopsis);
  if (newData.director) formData.append("director", newData.director);
  
  if (newData.poster){
    formData.append("poster", newData.poster);
  }
  
  if (pb.authStore.model?.id) {
    formData.append("owner", pb.authStore.model.id);
  } else {
    throw new Error("Usuario no autenticado");
  }

  return await pb.collection("films").update(id, formData);
}

// Eliminar película
export async function deleteFilm(id: string): Promise<void> {
  await pb.collection("films").delete(id);
}