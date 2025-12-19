import { pb } from "../pb.js";

// Login
export async function login(email, password) {
  return pb.collection("users").authWithPassword(email, password);
}

// Logout
export async function logout() {
  pb.authStore.clear();
}

// Registro de usuario
export async function registerUser(email, password, name) {
  return pb.collection("users").create({
    email,
    password,
    passwordConfirm: password,
    name,
    
  });
}

// Obtener usuario actual
export function getCurrentUser() {
  return pb.authStore.model;
}