<template>
  <ion-menu side="end" content-id="series-content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Cuenta</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item button @click="router.replace('/home')">Películas</ion-item>
        <ion-item button @click="router.replace('/series')">Series</ion-item>
        <ion-item button color="danger" @click="doLogout">Cerrar sesión</ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>

  <ion-page id="series-content">
    <ion-header>
      <ion-toolbar>
        <ion-title>MiFilmTracker</ion-title>

        <ion-buttons id="ion-buttons" slot="end">
          <ion-button @click="router.replace('/home')">Inicio</ion-button>
          <ion-button @click="router.replace('/home')">Películas</ion-button>
          <ion-button @click="router.replace('/series')">Series</ion-button>

          <ion-button @click="openMenu">
            <ion-avatar id="avatar" aria-hidden="true">
              <img alt="" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
            </ion-avatar>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">MiFilmTracker</ion-title>
        </ion-toolbar>
      </ion-header>

      <h1>Series</h1>
      <ion-list>
        <ion-item v-for="serie in series" :key="serie.id">
          <ion-label>
            <h2>{{ serie.title }}</h2>
            <p>{{ serie.year }} — {{ serie.seasons }} Temp / {{ serie.episodes }} Eps</p>
          </ion-label>

          <template v-if="serie.owner === auth.user?.id">
            <ion-button id="button"
              fill="clear" 
              @click="openEditModal(serie)">Editar</ion-button>
            
            <ion-button id="button"
              fill="clear" 
              color="danger" 
              @click="deleteSeries(serie.id)">Eliminar</ion-button>
          </template>
        </ion-item>
      </ion-list>

      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button @click="openCreateModal">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-modal :is-open="showModal" @didDismiss="showModal = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>
              {{ editingSeries ? 'Editar serie' : 'Nueva serie' }}
            </ion-title>
            <ion-buttons slot="end">
              <ion-button @click="showModal = false">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <ion-input label="Título" v-model="form.title" required :minlength="1" :maxlength="50"></ion-input>
          <ion-input label="Año" type="number" v-model.number="form.year" required></ion-input>
          <ion-input label="Temporadas" type="number" v-model.number="form.seasons" required></ion-input>
          <ion-input label="Episodios" type="number" v-model.number="form.episodes" required></ion-input>
          <ion-input label="Género" v-model="form.genre"></ion-input>
          <ion-input label="Director" v-model="form.director"></ion-input>
          <ion-textarea label="Sinopsis" v-model="form.synopsis"></ion-textarea>
          <input type="file" accept="image/*" @change="onPosterChange"></input>

          <ion-button expand="block" @click="saveSeries" :disabled="saving">
            <ion-spinner v-if="saving" name="crescent"></ion-spinner>
            <span v-else>Guardar</span>
          </ion-button>
        </ion-content>
      </ion-modal>
      
      <ion-toast
        :is-open="showToastFlag"
        :message="toastMessage"
        duration="2000"
        @didDismiss="showToastFlag = false"
      ></ion-toast>
      
    </ion-content>
    <ion-footer>
      <ion-toolbar id="footer">
        © 2025 – MiFilmTracker
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonFooter, IonItem, IonLabel, 
  IonButton, IonButtons, IonAvatar, IonMenu, menuController, IonFab, IonFabButton, IonIcon, 
  IonModal, IonInput, IonTextarea, IonToast } from '@ionic/vue';
import { add } from 'ionicons/icons';
import { useAuthStore } from '@/stores/auth';
import { useSeriesStore } from '@/stores/series';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import type { Series, SeriesPayload } from '@/backend/services/series.types';

const auth = useAuthStore();
const seriesStore = useSeriesStore()
const router = useRouter();

const { series } = storeToRefs(seriesStore);

const showModal = ref(false);
const editingSeries = ref<Series | null>(null);

const form = ref<SeriesPayload>({
  title: '', 
  year: 2025, 
  seasons: 1, 
  episodes: 1, 
  genre: '', 
  director: '', 
  synopsis: '', 
  poster: null
});

const posterFile = ref<File | null>(null);
const saving = ref(false);
const toastMessage = ref('')
const showToastFlag = ref(false)

onMounted(async () => {
    await seriesStore.listSeries();
});

const openMenu = () => {
    menuController.open();
};

function onPosterChange(e: Event) {
    const target = e.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
        posterFile.value = target.files[0]
    }
}

async function doLogout() {
    await menuController.close()
    auth.logout();
    router.replace('/login');
}

async function deleteSeries(id: string) {
    try {
      await seriesStore.deleteSeries(id)
      showToast('Serie eliminada') 
    } catch (err) {
      showToast('Error al eliminar')
    }
  }

function openEditModal(series: Series) {
  editingSeries.value = series;

  form.value = {
      title: series.title,
      year: series.year,
      seasons: series.seasons, 
      episodes: series.episodes,    
      genre: series.genre ?? '',
      director: series.director ?? '',
      synopsis: series.synopsis ?? '',
      poster: null
    }

    posterFile.value = null
    showModal.value = true
}

function openCreateModal() {
  editingSeries.value = null;

  form.value = { 
    title: '', 
    year: 2025, 
    seasons: 1, 
    episodes: 1, 
    genre: '', 
    director: '', 
    synopsis: '', 
    poster: null 
  }

  posterFile.value = null
  showModal.value = true;
}

function showToast(msg: string) {
    toastMessage.value = msg
    showToastFlag.value = true
}

async function saveSeries() {
  if (!form.value.title || !form.value.year) {
    showToast('Título y año obligatorios')
    return
  }

  saving.value = true;
  try {
    const payload: SeriesPayload = { 
        ...form.value, 
        poster: posterFile.value 
    }

    if (editingSeries.value) {
      await seriesStore.editSeries(editingSeries.value.id, payload);
      showToast('Serie editada')
    } else {
      await seriesStore.createSeries(payload);
      showToast('Serie creada')
    }

    showModal.value = false;
  } catch (err: any) {
      console.error("Error al guardar:", err.data);
      showToast(err.message || 'Error al guardar');
  } finally {
      saving.value = false
      posterFile.value = null
  }
}
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}

#ion-buttons {
  margin: 0.5%;
}

#button {
  margin: 0.5%;
  color: #55ef5a;
}

#avatar {
  padding: 1%;
}

#footer {
  text-align: center;
}

h1 {
  margin: 20px;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  font-size: xx-large;
}

h2 {
  margin-bottom: 3px;
  font-size: large;
}
</style>