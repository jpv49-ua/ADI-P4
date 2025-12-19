<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>MiFilmTracker</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content color="light"> 
            <h1 id="title">Inicio de sesión</h1>

            <form @submit.prevent="doLogin">
                <ion-card>
                    <ion-input
                        type="email" 
                        label="Email" 
                        label-placement="floating" 
                        fill="outline" 
                        placeholder="Email" 
                        :value="email" 
                        @ion-input="email = $event.detail.value ?? ''"
                    ></ion-input>

                    <ion-input
                        type="password" 
                        label="Contraseña" 
                        label-placement="floating" 
                        fill="outline" 
                        placeholder="Contraseña" 
                        :value="password" 
                        @ion-input="password = $event.detail.value ?? ''"
                    ></ion-input>

                    <ion-button id="button" type="submit" :strong="true">Iniciar sesión</ion-button>
                    <ion-text color="danger">{{ errorMsg }}</ion-text>
                </ion-card>
            </form>
        </ion-content>
        <ion-footer>
            <ion-toolbar id="footer">
                © 2025 – MiFilmTracker
            </ion-toolbar>
        </ion-footer>
    </ion-page>
</template>

<script setup lang="ts">
    import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonCard, IonText, IonFooter } from '@ionic/vue';
    import { useAuthStore } from '@/stores/auth';
    import { useRouter } from 'vue-router';
    import { ref } from 'vue';

    const auth = useAuthStore();
    const router = useRouter();

    const email = ref('');
    const password = ref('');
    const errorMsg = ref('');

    async function doLogin() {
        try{
            await auth.login(email.value, password.value);
            router.replace('/');
        } catch {
            errorMsg.value = 'Credenciales incorrectas';
        }
    }
</script>

<style scoped>
h1 {
    font-size: 35px;
    text-align: center;
    margin-top: 75px;
    margin-bottom: 50px;
}

ion-input {
    width: 320px;
    margin-top: 30px;
    margin-right: auto;
    margin-left: auto;
    margin-bottom: 30px;
    font-size: large;
}

ion-button {
    display: block;
    width: 200px;
    margin: auto;
    --padding-top: 18px;
    --padding-bottom: 18px;
    --background: #4CAF50;
    --background-hover: #9ce0be;
    --background-activated: #88f4be;
    --background-focused: #88f4be;
}

ion-card {
    height: 310px;
    margin: auto;
}

ion-text {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}

#footer {
  text-align: center;
}
</style>