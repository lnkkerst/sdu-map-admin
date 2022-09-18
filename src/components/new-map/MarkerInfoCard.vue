<script lang="ts" setup>
import type { MapMarker } from '~/models/map';
import { BuildingType } from '~/models/map';

const props = defineProps<{ markerId: string }>();
const { t } = useI18n();

const dialog = $ref();

let marker: MapMarker = $ref({
  name: t('loading'),
  englishName: t('loading'),
  openTime: t('loading'),
  id: t('loading'),
  color: t('loading'),
  mapId: t('loading'),
  type: BuildingType.Unknown,
  coordinate: [0, 0]
});

const typeOptions = computed(() =>
  (Object.values(BuildingType) as string[]).map(type => ({
    label: t(`marker_info.type_list.${type.toLowerCase()}`),
    value: type
  }))
);

watch(
  () => props.markerId,
  newVal => {
    const newMarker = useMapStore().getMarkerById(newVal);
    if (newMarker) {
      marker = { ...newMarker };
    }
  }
);

function handleSubmit() {
  useMapStore().removeMarker(marker.id);
  useMapStore().addMarker(marker);
  (dialog as any).hide();
}

onMounted(() => {});
</script>

<template>
  <q-dialog v-bind="$attrs" ref="dialog">
    <q-card>
      <q-card-section>
        <div text-lg>{{ t('marker_info.title') }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section pt-1 class="scroll">
        <q-form @submit="handleSubmit">
          <q-input v-model="marker.id" label="ID" disable />
          <q-input v-model="marker.name" :label="t('marker_info.name')" />
          <q-input
            v-model="marker.englishName"
            :label="t('marker_info.english_name')"
          />
          <q-select
            v-model="marker.type"
            :options="typeOptions"
            :label="t('marker_info.type')"
            emit-value
            map-options
          />
          <q-input
            v-model="marker.openTime"
            :label="t('marker_info.open_time')"
          />
          <q-input
            v-model="marker.color"
            :label="t('marker_info.color')"
            :rules="['anyColor']"
          >
            <template #append>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-color v-model="marker.color" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-btn
            color="primary"
            float-right
            type="submit"
            :label="t('marker_info.submit')"
          ></q-btn>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style></style>
