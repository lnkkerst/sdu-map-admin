<script setup lang="ts">
import { v4 as uuid } from 'uuid';
import { Notify } from 'quasar';

const { t } = useI18n();
const map = useMapStore();
const settings = useSetting();

const imageInput = $ref<HTMLInputElement | null>(null);
const imageInputState = $ref({
  loading: false
});

const handleSubmitImage = () => {
  if (!imageInput) {
    return;
  }
  imageInput.onchange = () => {
    imageInputState.loading = true;
    if (!imageInput.files || !imageInput.files.length) {
      imageInputState.loading = false;
      return;
    }
    const reader = new FileReader();
    const img = new Image();
    reader.onload = e => {
      img.src = e.target?.result as string;
      img.onerror = () => {
        Notify.create({
          type: 'negative',
          message: t('new_map_menu.upload_state.error')
        });
        imageInputState.loading = false;
      };
      img.onload = () => {
        map.addImage({
          url: img.src,
          id: uuid(),
          center: map.map?.getView()?.getCenter() ?? [0, 0],
          size: [img.width, img.height],
          scale: 1,
          rotate: 0,
          priority: 100
        });
        imageInputState.loading = false;
      };
    };
    reader.readAsDataURL(imageInput.files[0]);
  };
  imageInput.click();
};
</script>

<template>
  <div px-sm py-xs>
    <input ref="imageInput" type="file" accept="image/*" hidden />
    <div flex justify-center>
      <q-btn
        :loading="imageInputState.loading"
        icon="mdi-image-plus"
        color="primary"
        flat
        @click="handleSubmitImage"
      >
      </q-btn>
    </div>
    <div flex justify-between items-center>
      <span text-sm>{{ t('new_map_menu.rotate') }}</span>
      <q-toggle v-model="settings.rotate" left-sm relative />
    </div>
    <div flex justify-between items-center>
      <span text-sm>{{ t('new_map_menu.scale') }}</span>
      <q-toggle v-model="settings.scale" left-sm relative />
    </div>
    <div flex justify-between items-center>
      <span text-sm>{{ t('new_map_menu.drag') }}</span>
      <q-toggle v-model="settings.dragWithoutModifyKey" left-sm relative />
    </div>
  </div>
</template>

<style scoped></style>
