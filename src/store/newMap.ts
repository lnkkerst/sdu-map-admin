import { acceptHMRUpdate, defineStore } from 'pinia';
import type Map from 'ol/Map';
import type { Coordinate } from 'ol/coordinate';
import type ImageLayer from 'ol/layer/Image';
import type VectorLayer from 'ol/layer/Vector';
import type { Feature } from 'ol';
import type VectorSource from 'ol/source/Vector';
import { v4 as uuid } from 'uuid';
import type EditableImage from '~/models/ol/EditableImageSource';
import {
  createFeatureForImageLayer,
  createImageLayer,
  createMarker
} from '~/utils/map';

export type EditableImageLayer = ImageLayer<EditableImage>;
export type VectorSourceLayer = VectorLayer<VectorSource>;

export enum BuildingType {
  Teaching,
  Dormitory,
  Lab,
  Functional,
  Landscape
}

export interface MapImage {
  id: string;
  url: string;
  size: [number, number];
  scale: number;
  center: Coordinate;
  rotate: number;
  priority?: number;
  extraInfo?: string;
  layer?: EditableImageLayer;
}

export interface MapMarker {
  id: string;
  coordinate: Coordinate;
  color: string;
  mapId: string;
  name: string;
  englishName: string;
  openTime: string;
  extraInfo?: string;
  feature?: Feature;
}

export interface MapInfo {
  id: string;
  name: string;
  englishName?: string;
}

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
      name: '',
      englishName: '',
      coordinate: options.coordinate ??
        map.value?.getView().getCenter() ?? [0, 0],
      color: options.color ?? '#000',
      mapId: options.mapId ?? info.value.id ?? 'unknown',
      openTime: '',
      extraInfo: ''
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
