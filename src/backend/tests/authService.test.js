import { pb } from "../pb.js";
import {login, logout, registerUser, getCurrentUser} from "../services/authService.js";

describe("AuthService", () => {
  beforeAll(() => {
    pb.authStore.clear(); // Aseguramos que no haya sesión previa
  });

  test("Debería registrar un nuevo usuario", async () => {
    const email = `test${Date.now()}@example.com`;
    const password = "12345678";
    const name = "Usuario de prueba";

    const user = await registerUser(email, password, name);
    expect(user).toHaveProperty("id");
  });

  test("Debería iniciar sesión correctamente", async () => {
    const email = `jose@gmail.com`;
    const password = "josejose";

    const authData = await login(email, password);
    expect(authData).toHaveProperty("token");
    expect(getCurrentUser()).not.toBeNull();
  });

  test("Debería cerrar sesión", async () => {
    logout();
    expect(getCurrentUser()).toBeNull();
  });
});