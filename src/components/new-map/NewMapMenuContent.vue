<script setup lang="ts">
import { ref } from 'vue';
import type { VarFile } from '@varlet/ui';
import { v4 as uuid } from 'uuid';

const { t } = useI18n();
const map = useMapStore();
const settings = useSetting();

const files = ref<VarFile[]>([]);
const img = ref(new Image());

const handleBeforeRead = (file: VarFile): boolean => {
  file.state = 'loading';
  return true;
};

const handleAfterRead = async (file: VarFile) => {
  file.state = 'loading';
  img.value.src = file.url as string;
  img.value.onload = () => {
    const layer = map.addImage({
      url: img.value.src,
      id: uuid(),
      center: map.map?.getView()?.getCenter() ?? [0, 0],
      size: [img.value.width, img.value.height],
      scale: 1,
      rotate: 0,
      priority: 100
    });
    layer.getSource();
    file.state = 'success';
  };
};

const uploadState = computed(() => {
  if (!files.value.length) {
    return 'waiting';
  }
  if (files.value[0].state === 'loading') {
    return 'outlining';
  }
  if (files.value[0].state === 'success') {
    return 'finished';
  }
});
</script>

<template>
  <div
    class="w-full mt-sm px-xs items-center flex-column justify-center overflow-auto"
  >
    <div>
      <var-uploader
        v-model="files"
        maxlength="1"
        @after-read="handleAfterRead"
        @before-read="handleBeforeRead"
      >
        <var-button type="primary">{{ t('new_map_menu.upload') }}</var-button>
      </var-uploader>
      <div class="text-xs mt-2">
        {{ t(`new_map_menu.upload_state.${uploadState}`) }}
      </div>
    </div>
    <div flex justify-between mt-sm>
      <span text-sm>{{ t('new_map_menu.rotate') }}</span>
      <var-switch v-model="settings.rotate" />
    </div>
    <div flex justify-between mt-sm>
      <span text-sm>{{ t('new_map_menu.scale') }}</span>
      <var-switch v-model="settings.scale" />
    </div>
    <div flex justify-between mt-sm>
      <span text-sm>{{ t('new_map_menu.drag') }}</span>
      <var-switch v-model="settings.dragWithoutModifyKey" />
    </div>
  </div>
</template>

<style scoped></style>
