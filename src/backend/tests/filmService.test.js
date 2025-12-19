import {createFilm, listFilm, searchFilm, editFilm, deleteFilm} from "../services/filmService.js";
import {login} from "../services/authService.js"

describe("ListService", () => {
  let createdFilm = null;

  beforeAll(async () => {
      await login("jose@gmail.com", "josejose");
    });
  
  test("Debería crear una película", async () => {
    const peli = {
      title: "Inception",
      genre: "Sci-Fi",
      year: 2010,
      director: "Christopher Nolan",
      synopsis: "A mind-bending thriller",
      owner: "bxqz55mmfe89oja"
    };

    createdFilm = await createFilm(peli);
    expect(createdFilm).toHaveProperty("title", "Inception");
  });

  test("Debería listar las películas", async () => {
    const lista = await listFilm();
    expect(lista.length).toBeGreaterThan(0);
  });

  test("Debería obtener una película por título", async () => {
    const pelicula = await searchFilm(createdFilm.title);
    expect(pelicula).toHaveProperty("title", createdFilm.title)
  });

  test("Debería editar una película", async () => {
    const updated = await editFilm(createdFilm.id, {title: "Inception, the subconscious"});
    expect(updated).toHaveProperty("title", "Inception, the subconscious");
  });

  test("Debería eliminar una película", async () => {
    const result = await deleteFilm(createdFilm.id);
    expect(result).toBe(true);
  });
});