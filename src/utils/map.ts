import { distance } from 'ol/coordinate';
import { Point, Polygon } from 'ol/geom';
import ImageLayer from 'ol/layer/Image';
import { Feature } from 'ol';
import { Icon, Style } from 'ol/style';
import type {
  EditableImageLayer,
  MapImage,
  MapMarker
} from './../store/newMap';
/**
 * Create a ImageLayer with static image
 * @param  {MapImage} img
 * @returns EditableImageLayer
 */
import { calcCenter, calcExtent, calcRect } from '~/utils/geom';
import EditableImage from '~/models/ol/EditableImageSource';
import markerSVG from '~/assets/images/map-marker.svg?raw';

export function createImageLayer(img: MapImage): EditableImageLayer {
  const { url, rotate, center, priority, scale } = img;
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
  /**
   * Create a feature for controlling the image layer.
   * @param  {EditableImageLayer} imageLayer - The image layer to be controlled.
   * @returns Feature - The rectangle feature which can control the image layer.
   */
  imgLayer.set('srcImage', img);
  return imgLayer;
}

export function createFeatureForImageLayer(
  imageLayer: EditableImageLayer
): Feature | undefined {
  const settings = useSetting();
  const source = imageLayer.getSource();
  if (!source) {
    return;
  }
  const img = source.getSrcImage();
  let rect = calcRect({
    extent: calcExtent(source.getCenter(), [img.width, img.height]),
    scale: source.getScale()[0],
    rotate: source.getRotation(),
    center: source.getCenter()
  });

  const initLength = distance(source.getCenter(), rect[0]);

  rect = [...rect, rect[0]];
  const feature = new Feature(new Polygon([rect]));

  feature.on('change', e => {
    const geometry = (e.target as Feature).get('modifyGeometry');
    if (geometry?.center) {
      const curCenter = geometry.center;
      const pos = (geometry.geometry as Polygon).getCoordinates()[0][0];
      const angle = Math.atan2(pos[1] - curCenter[1], pos[0] - curCenter[0]);
      if (settings.value.scale) {
        source.setScale(distance(pos, curCenter) / initLength);
      }
      if (settings.value.rotate) {
        source.setRotation(-angle - Math.atan(img.height / img.width));
      }
      source.setCenter(geometry.center);
    } else {
      source.setCenter(
        calcCenter((e.target as Feature).getGeometry() as Polygon).center
      );
    }
  });
  /**
   * Create a marker.
   * @param  {MapMarker} mk - The source Marker.
   * @returns Feature - The marker.
   */
  feature.set('imageLayer', imageLayer);
  return feature;
}

export function createMarker(mk: MapMarker): Feature {
  const { coordinate, color } = mk;
  const img = new Image();
  img.src = `data:image/svg+xml;utf8,${encodeURIComponent(markerSVG)}`;
  img.style.color = 'red';
  const iconFeature = new Feature({
    geometry: new Point(coordinate)
  });
  const iconStyle = new Style({
    image: new Icon({
      src: `data:image/svg+xml;utf8,${encodeURIComponent(
        markerSVG.replace('currentColor', color)
      )}`,
      scale: 1,
      anchor: [0.5, 1]
    })
  });

  iconFeature.setStyle(iconStyle);

  return iconFeature;
}
