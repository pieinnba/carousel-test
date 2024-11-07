<template>
  <div class="home">
    <h1>Photo Carousel (Frontco Test)</h1>

    <Carousel
      v-model="selectedPhotos"
      class="carousel"
      :listOfPhotos="listOfPhotos"
      @updatePhotos="getPhotos" />

    <h2>Selected Photos</h2>

    <TransitionGroup
      v-if="selectedPhotos.length"
      class="selected-photos"
      name="list"
      tag="ul">
      <li
        class="selected-photos__item"
        v-for="{ id, url } in selectedPhotos"
        :key="id">
        <a :href="url" target="”_blank”">{{ url }}</a>
      </li>
    </TransitionGroup>

    <div v-else class="selected-empty">You do not select any photos yet.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Carousel from '@/components/Carousel.vue';
import type { Photo } from '@/types/index';
import { getImages } from '@/api/index';

interface PhotoResponse {
  id: number;
  url: string;
  download_url: string;
}

const listOfPhotos = ref<Photo[]>([]);
const selectedPhotos = ref<Photo[]>([]);
const isLoading = ref<boolean>(false);
const pageID = ref<number>(1);

const getPhotos = async () => {
  if (isLoading.value) return;

  isLoading.value = true;

  const data = (await getImages(pageID.value)) as PhotoResponse[];

  const photos: Photo[] = data.map(
    ({ id, url, download_url }) =>
      ({
        id,
        url,
        download_url,
      } as Photo)
  );

  listOfPhotos.value = listOfPhotos.value.concat(photos);
  pageID.value++;

  isLoading.value = false;
};

onMounted(() => {
  if (!listOfPhotos.value.length) getPhotos();
});
</script>

<style lang="scss" scoped>
.home {
  padding-bottom: 30px;
}

h1,
h2 {
  margin: 20px auto;
  color: #333;
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 1px;
}

h1 {
  border-bottom: 3px solid #333;
  padding-bottom: 10px;
  font-size: 3em;

  @media (max-width: 767px) {
    font-size: 2em;
    border-bottom: 2px solid #333;
    padding-bottom: 7px;
  }
}

h2 {
  font-size: 2em;
  border-bottom: 2px solid #666;
  padding-bottom: 8px;

  @media (max-width: 767px) {
    font-size: 1em;
    border-bottom: 1px solid #333;
    padding-bottom: 4px;
  }
}

.selected-photos {
  width: fit-content;

  padding: 0;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 8px;

  background-color: #fff;
  list-style-type: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &__item {
    width: fit-content;

    padding: 15px;
    border-bottom: 1px solid #ddd;

    color: #555;

    text-align: center;
    font-size: 1.2em;
    font-weight: 500;

    @media (max-width: 767px) {
      padding: 15px 25px;
      font-size: 0.9em;
    }
  }
}

.selected-empty {
  width: fit-content;
  margin: 0 auto;

  color: #333;

  font-family: 'Arial', sans-serif;
  letter-spacing: 1px;
  @media (max-width: 767px) {
    font-size: 0.9em;
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
