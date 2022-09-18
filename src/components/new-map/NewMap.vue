<script setup lang="ts">
import type { Map } from 'ol';
import type { MapMarker } from '~/models/map';
import { createMap } from '~/utils/mapCreate';

const emit = defineEmits<{
  (e: 'markerClick', id: string): void;
}>();

const mapDOM = ref<HTMLElement>();

onMounted(() => {
  useMapStore().setMap(createMap(mapDOM.value ?? 'map'));
  setTimeout(() => {
    useMapStore().map?.updateSize();
  }, 200);

  const map = useMapStore().map as Map;

  map.on('click', e => {
    const feature = map.forEachFeatureAtPixel(e.pixel, feature => feature);
    if (!feature) {
      return;
    }
    const marker = feature?.get('srcMarker') as MapMarker;
    if (!marker) {
      return;
    }

    emit('markerClick', marker.id);
  });
});
</script>

<template>
  <div id="map" ref="mapDOM"></div>
</template>

<style scoped></style>
