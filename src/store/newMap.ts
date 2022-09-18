import { acceptHMRUpdate, defineStore } from 'pinia';
import type Map from 'ol/Map';
import type { Feature } from 'ol';
import { v4 as uuid } from 'uuid';
import {
  createFeatureForImageLayer,
  createImageLayer,
  createMarker
} from '~/utils/map';
import type {
  EditableImageLayer,
  MapImage,
  MapInfo,
  MapMarker,
  VectorSourceLayer
} from '~/models/map';
import { BuildingType } from '~/models/map';

export const useMapStore = defineStore('new_map', () => {
  const map = ref<Map>();
  const vectorLayer = ref<VectorSourceLayer>();
  const markerLayer = ref<VectorSourceLayer>();
  const info = ref<MapInfo>({
    id: '',
    name: '',
    englishName: ''
  });
  const images = ref<Record<string, MapImage>>({});
  const markers = ref<Record<string, MapMarker>>({});

  function setMap(newMap: {
    map: Map;
    vectorLayer: VectorSourceLayer;
    markerLayer: VectorSourceLayer;
  }) {
    map.value = newMap.map;
    vectorLayer.value = newMap.vectorLayer;
    markerLayer.value = newMap.markerLayer;
  }

  function addImage(img: MapImage) {
    const { id } = img;
    images.value[id] = img;
    const imgLayer = createImageLayer(img);
    map.value?.addLayer(imgLayer);

    const feature = createFeatureForImageLayer(imgLayer);
    imgLayer.set('featureController', feature);
    vectorLayer.value?.getSource()?.addFeature(feature as Feature);
    return imgLayer;
  }

  function removeImage(img: EditableImageLayer | string): boolean {
    if (!map.value) {
      return false;
    }
    if (typeof img === 'string') {
      if (!images.value[img] || !images.value[img].layer) {
        return false;
      }
      const imageLayer = images.value[img].layer as EditableImageLayer;
      map.value.removeLayer(imageLayer);
      vectorLayer.value
        ?.getSource()
        ?.removeFeature(imageLayer.get('featureController'));
      delete images.value[img];
      return true;
    }

    try {
      map.value.removeLayer(img);
      vectorLayer.value
        ?.getSource()
        ?.removeFeature(img.get('featureController'));
      delete images.value[(img.get('srcImage') as MapImage).id];
      return true;
    } catch (_e) {
      const e = _e as Error;
      console.error(e.message);
      return false;
    }
  }

  function getImageLayerById(id: string): EditableImageLayer | undefined {
    return images.value[id].layer;
  }

  function getImageById(id: string): MapImage | undefined {
    return images.value[id];
  }

  function addMarker(options: Partial<MapMarker>): Feature {
    const marker: MapMarker = {
      id: options.id ?? uuid(),
      name: options.name ?? '',
      englishName: options.englishName ?? '',
      coordinate: options.coordinate ??
        map.value?.getView().getCenter() ?? [0, 0],
      color: options.color ?? '#000',
      mapId: options.mapId ?? info.value.id ?? 'unknown',
      type: options.type ?? BuildingType.Unknown,
      openTime: options.openTime ?? '',
      extraInfo: options.extraInfo ?? ''
    };
    const markerFeature = createMarker(marker);
    markerFeature.set('srcMarker', marker);
    marker.feature = markerFeature;
    markers.value[marker.id] = marker;
    markerLayer.value?.getSource()?.addFeature(markerFeature);
    return markerFeature;
  }

  function removeMarker(marker: Feature | string): boolean {
    if (!markerLayer.value) {
      return false;
    }
    if (typeof marker === 'string') {
      if (!markers.value[marker] || !markers.value[marker].feature) {
        return false;
      }
      markerLayer.value
        .getSource()
        ?.removeFeature(markers.value[marker].feature as Feature);
      delete markers.value[marker];
      return true;
    }

    try {
      markerLayer.value.getSource()?.removeFeature(marker);
      delete markers.value[(marker.get('srcMarker') as MapMarker).id];
      return true;
    } catch (_e) {
      const e = _e as Error;
      console.error(e.message);
      return false;
    }
  }

  function getMarkerById(id: string): MapMarker | undefined {
    return markers.value[id];
  }

  function getMarkerFeatureById(id: string): Feature | undefined {
    return markers.value[id].feature;
  }

  return {
    info,
    images,
    markers,
    map,
    vectorLayer,
    markerLayer,
    addImage,
    setMap,
    removeImage,
    getImageLayerById,
    getImageById,
    addMarker,
    removeMarker,
    getMarkerFeatureById,
    getMarkerById
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMapStore, import.meta.hot));
}
