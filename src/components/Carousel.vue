<template>
  <div class="carousel">
    <div class="carousel__list" ref="carousel">
      <div
        class="carousel__list-item"
        v-for="photo in listOfPhotos"
        :key="photo.id"
        @click="selectPhoto(photo)">
        <Image
          :class="{ active: modelValue.find(({ id }) => id === photo.id) }"
          :url="photo.download_url" />
      </div>

      <div class="carousel__list--last-item" ref="observerElement"></div>
    </div>

    <Button
      class="carousel__button-back"
      type="navigation"
      @click="scrollByButton('back')">
      <template #slot-1><Arrow /></template>
    </Button>

    <Button
      class="carousel__button-forward"
      type="navigation"
      @click="scrollByButton('forward')">
      <template #slot-1><Arrow /></template>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted, onBeforeUnmount } from 'vue';

import Image from '@/components/UI/Image.vue';
import type { Photo } from '@/types/index';
import Button from '@/components/UI/Button.vue';
import Arrow from '@/components/icons/Arrow.vue';

const props = defineProps<{
  listOfPhotos: Photo[];
  modelValue: Photo[];
}>();

const emit = defineEmits(['update:modelValue', 'updatePhotos']);

const { listOfPhotos } = toRefs(props);

const carousel = ref<HTMLElement | null>();
const isScrolling = ref<boolean>(false);
const valueToScroll = ref<number>(0);
const observerElement = ref(null);

const selectPhoto = (photo: Photo): void => {
  const localSelected: Photo[] = [...props.modelValue];

  const index: number = localSelected.findIndex(({ id }) => photo.id === id);
  if (index === -1) {
    localSelected.push(photo);
  } else {
    localSelected.splice(index, 1);
  }

  emit('update:modelValue', localSelected);
};

const scrollByButton = (direction: 'back' | 'forward'): void => {
  if (!carousel.value || isScrolling.value) return;

  isScrolling.value = true;

  const { scrollLeft } = carousel.value;

  const left: number =
    direction === 'forward'
      ? scrollLeft + valueToScroll.value
      : scrollLeft - valueToScroll.value;

  carousel.value.scrollTo({
    left,
    behavior: 'smooth',
  });

  setTimeout(() => {
    isScrolling.value = false;
  }, 500);
};

let observer: IntersectionObserver | null = null;

const setupObserver = () => {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 1.0,
  };

  observer = new IntersectionObserver((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      emit('updatePhotos');
    }
  }, options);

  if (observerElement.value) {
    observer?.observe(observerElement.value);
  }
};

const handleResize = (event?: Event) => {
  const { innerWidth } = (event?.target as Window) || window;

  if (innerWidth > 767) {
    valueToScroll.value = document.documentElement.clientWidth * 0.34;
  } else {
    valueToScroll.value = innerWidth;
  }
};

onMounted(() => {
  setupObserver();
  handleResize();

  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  if (observer) observer?.disconnect();

  window.removeEventListener('resize', handleResize);
});
</script>

<style lang="scss" scoped>
.carousel {
  position: relative;
  width: 100%;
  min-height: 200px;

  transition: all 0.2s ease-in-out;

  &__list {
    position: relative;

    width: 100%;
    padding-right: 32.5vw;

    display: flex;
    align-items: center;

    overflow: hidden;

    &-item {
      min-width: 34vw;

      border: rgba(0, 0, 0, 0) 0.5vw solid;
      transition: all 0.2s ease-in-out;

      @media (max-width: 767px) {
        min-width: 100vw;
      }
    }
    &--last-item {
      width: 0;
    }
  }

  &__button {
    &-back,
    &-forward {
      position: absolute;
      top: 50%;
    }

    &-back {
      left: 1.5%;
      transform: translateY(-50%) scaleX(-1);
    }

    &-forward {
      right: 1.5%;
      transform: translateY(-50%);
    }
  }
}

.active {
  box-shadow: 3px 3px 5px rgb(94, 0, 189);
  transition: all 0.2s ease-in-out;
}
</style>
