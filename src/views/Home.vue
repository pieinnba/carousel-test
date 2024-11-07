<template>
  <div>
    <button @click="getPhotos(requestURL)">go</button>
    <div>pageID: {{ pageID }}</div>
    <div>requestURL: {{ requestURL }}</div>
    <div>listOfPhotos: <div>{{ listOfPhotos }}</div></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const listOfPhotos = ref<any[]>([]);

let pageID = ref<number>(1);

const requestURL = computed<string>(() => `https://picsum.photos/v2/list?page=${pageID.value}`);

const getPhotos = async function(URL)  {
  const response = await fetch(URL);
  const data  = await response.json();
  listOfPhotos.value = listOfPhotos.value.concat(data);
  pageID.value++;
  };
</script>

<style scoped></style>
