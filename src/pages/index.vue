<script setup lang="ts">
let markerInfo = $ref(false);
let markerId = $ref('none');

function handleMarkerClick(id: string) {
  markerId = id;
  markerInfo = true;
}
</script>

<template>
  <q-page min-h-inherit>
    <NewMap h-full w-full absolute @marker-click="handleMarkerClick"></NewMap>
    <NewMapMenu z-1></NewMapMenu>
    <MarkerInfoCard v-model="markerInfo" :marker-id="markerId"></MarkerInfoCard>
  </q-page>
</template>

<style scoped></style>
