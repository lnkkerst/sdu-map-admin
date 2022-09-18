import type ImageLayer from 'ol/layer/Image';
import type VectorLayer from 'ol/layer/Vector';
import type VectorSource from 'ol/source/Vector';
import type { Coordinate } from 'ol/coordinate';
import type { Feature } from 'ol';
import type EditableImage from '~/models/ol/EditableImageSource';

export type EditableImageLayer = ImageLayer<EditableImage>;
export type VectorSourceLayer = VectorLayer<VectorSource>;

export enum BuildingType {
  Teaching = 'TEACHING',
  Dormitory = 'DORMITORY',
  Lab = 'LAB',
  Functional = 'FUNCTIONAL',
  Landscape = 'LANDSCAPE',
  Unknown = 'UNKNOWN'
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
  type: BuildingType;
  openTime: string;
  extraInfo?: string;
  feature?: Feature;
}

export interface MapInfo {
  id: string;
  name: string;
  englishName?: string;
}
