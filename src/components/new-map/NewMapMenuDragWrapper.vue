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
    h: 490
  },
  localStorage,
  { mergeDefaults: true }
);

const active = $ref(false);
const sizable = $ref(true);
const display = $ref(true);
</script>

<template>
  <Vue3DraggableResizable
    v-model:x="state.x"
    v-model:y="state.y"
    v-model:w="state.w"
    v-model:h="state.h"
    v-model:active="active"
    :draggable="sizable && active"
    :resizable="sizable && active"
    :parent="true"
    :min-w="128"
    :min-h="128"
    class="draggable-menu border-0"
  >
    <div
      class="w-full h-full rounded shadow"
      :class="{ 'shadow-xl': active }"
      style="background-color: var(--color-body)"
    >
      <var-app-bar
        class="rounded-t-md h-6 text-sm absolute"
        @mousedown.prevent="active = true"
      >
        <template #left>{{ t('new_map_menu.title') }}</template>
        <template #right>
          <var-icon
            v-show="display"
            i-mdi-minus
            @click="display = false"
          ></var-icon>
          <var-icon
            v-show="!display"
            i-mdi-plus
            @click="display = true"
          ></var-icon>
          <var-icon
            v-show="!sizable"
            i-mdi-pin-off
            text-sm
            @click="sizable = true"
          ></var-icon>
          <var-icon
            v-show="sizable"
            i-mdi-pin
            text-sm
            @click="sizable = false"
          ></var-icon>
          <var-icon></var-icon>
        </template>
      </var-app-bar>

      <div v-show="display" class="h-full w-full pt-6 flex">
        <slot />
      </div>
    </div>
  </Vue3DraggableResizable>
</template>

<style scoped>
.draggable-menu >>> .vdr-handle {
  opacity: 0;
}
</style>
