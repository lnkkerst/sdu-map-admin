import type { Coordinate } from 'ol/coordinate';
import type { Extent } from 'ol/extent';
import { getCenter, getHeight, getWidth } from 'ol/extent';
import type { Geometry, LineString, Polygon } from 'ol/geom';

const { cos, sin } = Math;

export function calcRotate(
  point: Coordinate,
  center: Coordinate,
  rotate: number
): Coordinate {
  const sinX = sin(-rotate);
  const cosX = cos(-rotate);
  const x =
    (point[0] - center[0]) * cosX - (point[1] - center[1]) * sinX + center[0];
  const y =
    (point[0] - center[0]) * sinX + (point[1] - center[1]) * cosX + center[1];
  return [x, y];
}

export function calcScale(
  point: Coordinate,
  center: Coordinate,
  scale: number
): Coordinate {
  const disX = (point[0] - center[0]) * scale;
  const disY = (point[1] - center[1]) * scale;
  return [center[0] + disX, center[1] + disY];
}

export function calcScaleAndRotate(
  point: Coordinate,
  center: Coordinate,
  scale: number,
  rotate: number
): Coordinate {
  return calcRotate(calcScale(point, center, scale), center, rotate);
}

export function calcRect({
  extent,
  center,
  scale,
  rotate
}: {
  extent: Extent;
  center: Coordinate;
  scale: number;
  rotate: number;
}): Coordinate[] {
  return [
    calcScaleAndRotate([extent[2], extent[1]], center, scale, rotate),
    calcScaleAndRotate([extent[0], extent[1]], center, scale, rotate),
    calcScaleAndRotate([extent[0], extent[3]], center, scale, rotate),
    calcScaleAndRotate([extent[2], extent[3]], center, scale, rotate)
  ];
}

export function calcExtent(center: Coordinate, size: [number, number]): Extent {
  return [
    center[0] - size[0] / 2,
    center[1] - size[1] / 2,
    center[0] + size[0] / 2,
    center[1] + size[1] / 2
  ];
}

export function calcExtentCenter(extent: Extent): Coordinate {
  return [(extent[2] - extent[0]) / 2, (extent[3] - extent[1]) / 2];
}

export function calcRectCenter(rect: Coordinate[] | number[]): Coordinate {
  rect = rect.flat();
  return [(rect[0] + rect[4]) / 2, (rect[1] + rect[5]) / 2];
}

export function calcCenter(geometry: Geometry) {
  let center: Coordinate, coordinates: Coordinate[] | undefined, minRadius;
  const type = geometry.getType();
  if (type === 'Polygon') {
    let x = 0;
    let y = 0;
    let i = 0;
    coordinates = (geometry as Polygon).getCoordinates()[0].slice(1);
    coordinates.forEach(coordinate => {
      x += coordinate[0];
      y += coordinate[1];
      i++;
    });
    center = [x / i, y / i];
  } else if (type === 'LineString') {
    center = (geometry as LineString).getCoordinateAt(0.5);
    coordinates = (geometry as LineString).getCoordinates();
  } else {
    center = getCenter(geometry.getExtent());
  }
  let sqDistances;
  if (coordinates) {
    sqDistances = coordinates.map(coordinate => {
      const dx = coordinate[0] - center[0];
      const dy = coordinate[1] - center[1];
      return dx * dx + dy * dy;
    });
    minRadius = Math.sqrt(Math.max(...sqDistances)) / 3;
  } else {
    minRadius =
      Math.max(
        getWidth(geometry.getExtent()),
        getHeight(geometry.getExtent())
      ) / 3;
  }
  return {
    center,
    coordinates,
    minRadius,
    sqDistances
  };
}
