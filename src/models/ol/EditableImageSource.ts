import type { Coordinate } from 'ol/coordinate';
import type { Extent } from 'ol/extent';
import { boundingExtent } from 'ol/extent';
import type { Size } from 'ol/size';
import type { Options as CanvasOptions } from 'ol/source/ImageCanvas';
import ImageCanvas from 'ol/source/ImageCanvas';
import { fromExtent } from 'ol/geom/Polygon';

interface Options extends CanvasOptions {
  imageCenter?: Coordinate;
  imageScale?: [number, number] | number;
  imageRotate?: number;
  url: string;
}

export default class EditableImageSource extends ImageCanvas {
  private scale: [number, number] = [1, 1];
  private image: HTMLImageElement = new Image();
  private imageSize: [number, number] | undefined;
  private center: Coordinate = [0, 0];
  private rotate: number;

  constructor(options: Options) {
    super(options);
    (this as any).canvasFunction_ = this.canvasFunction;
    if (options.imageScale !== undefined) {
      this.setScale(options.imageScale);
    }
    this.center = options.imageCenter ?? [0, 0];
    this.rotate = options.imageRotate ?? 0;
    this.image.src = options.url;
    this.image.onload = () => {
      this.imageSize = [this.image.naturalWidth, this.image.naturalHeight];
      this.changed();
    };
    this.on('change', () => {
      this.set('extent', this.calculateExtent());
    });
  }

  getCenter() {
    return this.center;
  }

  setCenter(center: Coordinate) {
    this.center = center;
    this.changed();
  }

  getScale() {
    return this.scale;
  }

  setScale(scale: [number, number] | number) {
    if (typeof scale === 'number') {
      this.scale = [scale, scale];
    } else {
      this.scale = scale;
    }
    this.changed();
  }

  getRotation() {
    return this.rotate;
  }

  setRotation(angle: number) {
    this.rotate = angle;
    this.changed();
  }

  canvasFunction(
    extent: Extent,
    resolution: number,
    pixelRatio: number,
    size: Size
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = size[0];
    canvas.height = size[1];
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    if (!this.imageSize) {
      return canvas;
    }

    function tr(xy: number[]) {
      return [
        ((xy[0] - extent[0]) / (extent[2] - extent[0])) * size[0],
        ((xy[1] - extent[3]) / (extent[1] - extent[3])) * size[1]
      ];
    }

    const pixel = tr(this.center);
    const dx =
      (((this.image.naturalWidth / 2) * this.scale[0]) / resolution) *
      pixelRatio;
    const dy =
      (((this.image.naturalHeight / 2) * this.scale[1]) / resolution) *
      pixelRatio;
    const sx = ((this.imageSize[0] * this.scale[0]) / resolution) * pixelRatio;
    const sy = ((this.imageSize[1] * this.scale[1]) / resolution) * pixelRatio;

    ctx.translate(pixel[0], pixel[1]);
    if (this.rotate) {
      ctx.rotate(this.rotate);
    }
    ctx.drawImage(
      this.image,
      0,
      0,
      this.imageSize[0],
      this.imageSize[1],
      -dx,
      -dy,
      sx,
      sy
    );
    return canvas;
  }

  getSrcImage() {
    return this.image;
  }

  getExtent() {
    return this.calculateExtent();
    // return this.get('extent');
  }

  calculateExtent() {
    const center = this.getCenter();
    const scale = this.getScale();
    const width = this.getSrcImage().width * scale[0];
    const height = this.getSrcImage().height * scale[1];
    const extent = boundingExtent([
      [center[0] - width / 2, center[1] - height / 2],
      [center[0] + width / 2, center[1] + height / 2]
    ]);
    const polygon = fromExtent(extent);
    polygon.rotate(-this.getRotation(), center);
    const ext = polygon.getExtent();
    return ext;
  }
}
