<template>
  <ion-app>
    <ion-router-outlet :key="$route.fullPath"/> <!--Para que no reutilice las vistas, desmonta/monta-->
  </ion-app>
</template>

<script setup lang="ts">
  import { IonApp, IonRouterOutlet } from '@ionic/vue';
  import { useAuthStore } from './stores/auth';

  const auth = useAuthStore();
  auth.init();
</script>
