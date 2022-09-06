import { acceptHMRUpdate, defineStore } from 'pinia';
import Map from 'ol/Map';
import type { Coordinate } from 'ol/coordinate';
import { distance } from 'ol/coordinate';
import ImageLayer from 'ol/layer/Image';
import type StaticImage from 'ol/source/ImageStatic';
import type VectorLayer from 'ol/layer/Vector';
import { Feature } from 'ol';
import { Polygon } from 'ol/geom';
import type VectorSource from 'ol/source/Vector';
import EditableImage from '~/models/ol/EditableImageSource';
import { calcCenter, calcExtent, calcRect } from '~/utils/map';

type StaticImageLayer = ImageLayer<StaticImage>;
type VectorSourceLayer = VectorLayer<VectorSource>;

const settings = useSetting();

export interface MapImage {
  id: string;
  url: string;
  size: [number, number];
  scale: number;
  center: Coordinate;
  rotate: number;
  priority?: number;
}
export interface Marker {
  id: string;
  coordinate: Coordinate;
}

export interface MapInfo {
  id: string;
  name: string;
  englishName: string;
}

export const useMapStore = defineStore('new_map', () => {
  const map = ref<Map>();
  const vLayer = ref<VectorSourceLayer>();
  const info = ref<MapInfo>({
    id: '',
    name: '',
    englishName: ''
  });
  const images = ref<MapImage[]>([]);
  const markers = ref<Marker[]>([]);
  const idMap = new Map();
  const withModifyKey = ref(true);

  function setMap(newMap: { map: Map; vLayer: VectorSourceLayer }) {
    map.value = newMap.map;
    vLayer.value = newMap.vLayer;
  }

  function addImage(img: MapImage) {
    const { id, url, size, rotate, center, priority, scale } = img;
    images.value.push(img);
    const source = new EditableImage({
      url,
      imageScale: scale,
      imageCenter: center,
      imageRotate: rotate
    });
    const imgLayer = new ImageLayer({
      source,
      zIndex: priority ?? 1
    });
    imgLayer.set('srcImage', img);
    map.value?.addLayer(imgLayer);

    let rect = calcRect({
      extent: calcExtent(center, size),
      center,
      rotate,
      scale
    });
    rect = [...rect, rect[0]];
    const rectFeature = new Feature(new Polygon([rect]));
    rectFeature.set('imgLayer', imgLayer);
    imgLayer.set('featureController', rectFeature);
    rectFeature.on('change', e => {
      const geometry = (e.target as Feature).get('modifyGeometry');
      const source = imgLayer.getSource();
      if (geometry?.center) {
        const curCenter = geometry.center;
        const pos = (geometry.geometry as Polygon).getCoordinates()[0][0];
        const pPos = rect[0];
        const pCenter = center;
        const angle = Math.atan2(pos[1] - curCenter[1], pos[0] - curCenter[0]);
        if (source) {
          if (settings.value.scale) {
            source.setScale(
              (distance(pos, curCenter) / distance(pPos, pCenter)) * scale
            );
          }
          if (settings.value.rotate) {
            source.setRotation(-angle - Math.atan(size[1] / size[0]));
          }
          source.setCenter(geometry.center);
        }
      } else {
        source?.setCenter(
          calcCenter((e.target as Feature).getGeometry() as Polygon).center
        );
      }
    });
    vLayer.value?.getSource()?.addFeature(rectFeature);

    idMap.set(id, imgLayer);
    return imgLayer;
  }

  function rmImage(img: StaticImageLayer | string): boolean {
    if (typeof img === 'string') {
      if (idMap.get(img) === undefined) {
        return false;
      }
      map.value?.removeLayer(idMap.get(img) as StaticImageLayer);
      return true;
    }

    try {
      map.value?.removeLayer(img);
    } catch (_e) {
      const e = _e as Error;
      console.error(e.message);
      return false;
    }
    return true;
  }

  function getLayerById(id: string): StaticImageLayer | undefined {
    return idMap.get(id);
  }

  return {
    info,
    images,
    markers,
    map,
    vLayer,
    withModifyKey,
    addImage,
    setMap,
    rmImage,
    getLayerById
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMapStore, import.meta.hot));
}
