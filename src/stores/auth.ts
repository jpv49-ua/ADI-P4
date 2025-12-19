import { defineStore } from "pinia";
import { pb } from '@/backend/pb';

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: pb.authStore.model as any || null,
    }),

    getters: {
        isLoggedIn: (state) => !!state.user
    },

    actions: {
        async login(email: string, password: string) {
            const res = await pb.collection("users").authWithPassword(email, password);
            this.user = res.record;
        },

        logout() {
            pb.authStore.clear();
            this.user = null;
        },

        init() {
            // Verificar si el usuario ya está autenticado al iniciar la aplicación
            this.user = pb.authStore.model;
            
            // Escuchar cambios en el estado de autenticación
            pb.authStore.onChange((_token, model) => {
                this.user = model; 
            });
        }
    }
});