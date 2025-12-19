import { pb } from "../pb.js";
import type { Series, SeriesPayload } from "./series.types"

export async function createSeries(data: SeriesPayload): Promise<Series> {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("year", String(data.year));
  formData.append("seasons", String(data.seasons));
  formData.append("episodes", String(data.episodes));
  if (data.genre) formData.append("genre", data.genre);
  if (data.synopsis) formData.append("synopsis", data.synopsis);
  if (data.director) formData.append("director", data.director);
  if (data.poster) formData.append("poster", data.poster);
  
  formData.append("owner", pb.authStore.model!.id);
  return await pb.collection("series").create<Series>(formData);
}

export async function listSeries(): Promise<Series[]> {
  return await pb.collection("series").getFullList<Series>({
    sort: '-created',
  });
}

export async function editSeries(id: string, newData: SeriesPayload): Promise<Series> {
  const formData = new FormData();
  formData.append("title", newData.title);
  formData.append("year", String(newData.year));
  formData.append("seasons", String(newData.seasons));
  formData.append("episodes", String(newData.episodes));
  if (newData.genre) formData.append("genre", newData.genre);
  if (newData.synopsis) formData.append("synopsis", newData.synopsis);
  if (newData.director) formData.append("director", newData.director);
  if (newData.poster) formData.append("poster", newData.poster);

  return await pb.collection("series").update<Series>(id, formData);
}

export async function deleteSeries(id: string): Promise<void> {
  await pb.collection("series").delete(id);
}