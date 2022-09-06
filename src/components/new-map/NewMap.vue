<script setup lang="ts">
import { createMap } from '~/utils/mapCreate';

const mapDOM = ref<HTMLElement>();

onMounted(() => {
  useMapStore().setMap(createMap(mapDOM.value));
});
</script>

<template>
  <div id="map" ref="mapDOM" class="h-full"></div>
</template>

<style scoped></style>
