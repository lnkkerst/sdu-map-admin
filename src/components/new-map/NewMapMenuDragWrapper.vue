<script setup lang="ts">
import Vue3DraggableResizable from 'vue3-draggable-resizable';
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css';
const { t } = useI18n();
const state = useStorage(
  'new-map-draggable-menu',
  {
    x: 128,
    y: 128,
    w: 180,
    h: 340,
    restoreHeight: 340,
    minimize: false,
    pinned: false
  },
  localStorage,
  { mergeDefaults: true }
);

const active = $ref(false);

const draggable = $ref(false);

const toggleMinimize = () => {
  if (state.value.minimize) {
    state.value.h = state.value.restoreHeight;
    state.value.minimize = false;
  } else {
    state.value.restoreHeight = state.value.h;
    state.value.h = 24;
    state.value.minimize = true;
  }
};
</script>

<template>
  <Vue3DraggableResizable
    v-model:x="state.x"
    v-model:y="state.y"
    v-model:w="state.w"
    v-model:h="state.h"
    v-model:active="active"
    :draggable="!state.pinned && draggable"
    :resizable="!state.pinned && !state.minimize"
    :parent="true"
    :min-w="128"
    :min-h="24"
    class="border-0 draggable-menu"
  >
    <q-card h-full w-full pt-24px>
      <q-bar
        dense
        absolute
        top-0
        w-full
        @mousedown="draggable = true"
        @mouseup="draggable = false"
      >
        <div cursor-default>{{ t('new_map_menu.title') }}</div>
        <q-space></q-space>
        <q-btn
          flat
          dense
          round
          :icon="state.minimize ? 'mdi-plus' : 'mdi-minus'"
          @click="() => toggleMinimize()"
        >
        </q-btn>
        <q-btn
          flat
          dense
          round
          :icon="state.pinned ? 'mdi-pin-off' : 'mdi-pin'"
          @click="state.pinned = !state.pinned"
        ></q-btn>
      </q-bar>
      <q-scroll-area h-full>
        <slot />
      </q-scroll-area>
    </q-card>
  </Vue3DraggableResizable>
</template>

<style scoped>
.draggable-menu:deep(.vdr-handle) {
  opacity: 0;
}
</style>
