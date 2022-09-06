import Map from 'ol/Map';
import View from 'ol/View';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Modify, Translate, defaults } from 'ol/interaction';
import { MultiPoint, Point, Polygon } from 'ol/geom';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { getCenter } from 'ol/extent';
import {
  never,
  platformModifierKeyOnly,
  primaryAction
} from 'ol/events/condition';
import { Projection } from 'ol/proj';
import Select from 'ol/interaction/Select';
import { calcExtent, calcRect, calcCenter as calculateCenter } from './map';
import { useSetting } from '~/composables/setting';

const settings = useSetting();

export function createVectorLayer() {
  const source = new VectorSource();
  const style = new Style({
    geometry(feature) {
      const modifyGeometry = feature.get('modifyGeometry');
      return modifyGeometry ? modifyGeometry.geometry : feature.getGeometry();
    },
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new Stroke({
      color: '#3299cc',
      width: 3
    }),
    image: new CircleStyle({
      radius: 7,
      fill: new Fill({
        color: '#ffcc33'
      })
    })
  });

  const layer = new VectorLayer({
    source,
    zIndex: 114514,
    style: new Style({
      fill: new Fill({ color: 'rgba(255, 255, 255, 0)' })
    })
  });

  const select = new Select({
    style(feature) {
      const styles = [style];
      const modifyGeometry = feature.get('modifyGeometry');
      const geometry = modifyGeometry
        ? modifyGeometry.geometry
        : feature.getGeometry();
      const result = calculateCenter(geometry);
      const center = result.center;
      if (center) {
        styles.push(
          new Style({
            geometry: new Point(center),
            image: new CircleStyle({
              radius: 4,
              fill: new Fill({
                color: '#ff3333'
              })
            })
          })
        );
        const coordinates = result.coordinates;
        if (coordinates) {
          const minRadius = result.minRadius;
          const sqDistances = result.sqDistances;
          const rsq = minRadius * minRadius;
          const points = coordinates.filter((coordinate, index) => {
            return sqDistances[index] > rsq;
          });
          styles.push(
            new Style({
              geometry: new MultiPoint(points),
              image: new CircleStyle({
                radius: 6,
                fill: new Fill({
                  color: '#33cc33'
                })
              })
            })
          );
        }
      }
      return styles;
    }
  });
  const translate = new Translate({
    features: select.getFeatures(),
    condition(evt) {
      return (
        primaryAction(evt) &&
        (settings.value.dragWithoutModifyKey || platformModifierKeyOnly(evt))
      );
    }
  });

  const defaultStyle = new Modify({ source }).getOverlay().getStyleFunction();

  const modify = new Modify({
    // source,
    features: select.getFeatures(),
    condition(evt) {
      return primaryAction(evt) && !platformModifierKeyOnly(evt);
    },
    deleteCondition: never,
    insertVertexCondition: never,
    style(feature) {
      feature.get('features').forEach(modifyFeature => {
        const modifyGeometry = modifyFeature.get('modifyGeometry');
        if (modifyGeometry) {
          const point = feature.getGeometry().getCoordinates();
          let modifyPoint = modifyGeometry.point;
          if (!modifyPoint) {
            // save the initial geometry and vertex position
            modifyPoint = point;
            modifyGeometry.point = modifyPoint;
            modifyGeometry.geometry0 = modifyGeometry.geometry;
            // get anchor and minimum radius of vertices to be used
            const result = calculateCenter(modifyGeometry.geometry0);
            modifyGeometry.center = result.center;
            modifyGeometry.minRadius = result.minRadius;
          }

          const center = modifyGeometry.center;
          const minRadius = modifyGeometry.minRadius;
          let dx, dy;
          dx = modifyPoint[0] - center[0];
          dy = modifyPoint[1] - center[1];
          const initialRadius = Math.sqrt(dx * dx + dy * dy);
          if (initialRadius > minRadius) {
            const initialAngle = Math.atan2(dy, dx);
            dx = point[0] - center[0];
            dy = point[1] - center[1];
            const currentRadius = Math.sqrt(dx * dx + dy * dy);
            if (currentRadius > 0) {
              const currentAngle = Math.atan2(dy, dx);
              const geometry = modifyGeometry.geometry0.clone();
              geometry.scale(currentRadius / initialRadius, undefined, center);
              geometry.rotate(currentAngle - initialAngle, center);
              modifyGeometry.geometry = geometry;
            }
          }
        }
      });
      return defaultStyle(feature);
    }
  });

  modify.on('modifystart', event => {
    event.features.forEach(feature => {
      feature.set(
        'modifyGeometry',
        { geometry: feature.getGeometry().clone() },
        true
      );
    });
  });

  modify.on('modifyend', event => {
    event.features.forEach(feature => {
      const modifyGeometry = feature.get('modifyGeometry');
      if (modifyGeometry) {
        feature.setGeometry(modifyGeometry.geometry);
        feature.unset('modifyGeometry', true);
      }
      const imgLayer = feature.get('imgLayer');
      if (imgLayer) {
        const source = imgLayer.getSource();
        let rect = calcRect({
          extent: calcExtent(source.getCenter(), [
            source.getSrcImage().width,
            source.getSrcImage().height
          ]),
          center: source.getCenter(),
          rotate: source.getRotation(),
          scale: source.getScale()[0]
        });
        rect = [...rect, rect[0]];
        feature.setGeometry(new Polygon([rect]));
      }
    });
  });

  return {
    layer,
    interactions: [modify, select, translate]
  };
}

export default function createMap(el) {
  const vLayer = createVectorLayer();

  const extent = [-2560, -1440, 2560, 1440];
  const projection = new Projection({
    code: 'image',
    units: 'pixels',
    extent
  });
  const map = new Map({
    interactions: defaults().extend([...vLayer.interactions]),
    layers: [vLayer.layer],
    target: el,
    view: new View({
      projection,
      center: getCenter(extent),
      zoom: 3,
      maxZoom: 10,
      minZoom: 0.1
    })
  });

  return {
    map,
    vLayer: vLayer.layer
  };
}

export { createMap };
