<template>
  <button :class="[`my-button--${type}`, 'my-button']">
    <slot name="slot-1" />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: 'navigation';
}>();
</script>

<style lang="scss" scoped>
.my-button {
  display: flex;
  justify-content: center;
  align-items: center;

  color: rgba(0, 0, 0, 0.5);
  background-color: rgba(255, 255, 255, 0.2);

  transition: all 0.2s ease-in-out;

  &--navigation {
    width: 6vw;
    height: 6vw;

    border-radius: 90%;

    overflow: hidden;

    @media (max-width: 767px) {
      width: 10vw;
      height: 10vw;
    }
  }

  &:hover {
    color: rgba(0, 0, 0, 0.7);
    background-color: rgba(255, 255, 255, 0.4);
  }

  &:active {
    color: rgba(0, 0, 0);
    background-color: rgba(255, 255, 255, 0.7);
  }
}
</style>
