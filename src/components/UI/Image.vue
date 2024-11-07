<template>
  <img :src="url" alt="random photo" />
</template>

<script setup lang="ts">
import { toRefs } from 'vue';

const props = defineProps<{
  url: string;
}>();

const { url } = toRefs(props);
</script>

<style scoped>
img {
  width: 100%;
}
</style>
