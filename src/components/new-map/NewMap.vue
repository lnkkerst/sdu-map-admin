<script setup lang="ts">
import { createMap } from '~/utils/mapCreate';

const mapDOM = ref<HTMLElement>();

onMounted(() => {
  useMapStore().setMap(createMap(mapDOM.value));
  setTimeout(() => {
    useMapStore().map?.updateSize();
  }, 200);
});
</script>

<template>
  <div id="map" ref="mapDOM"></div>
</template>

<style scoped></style>
