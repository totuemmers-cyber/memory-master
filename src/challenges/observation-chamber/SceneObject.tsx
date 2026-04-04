import { COLOR_HEX, SIZE_RADIUS } from './types';
import type { SceneObject as SceneObjectType } from './types';
import { getShapePath } from './svg-shapes';

export function SceneObjectSVG({ object }: { object: SceneObjectType }) {
  const r = SIZE_RADIUS[object.size];
  const fill = COLOR_HEX[object.color];
  const { element, props } = getShapePath(object.shape, object.x, object.y, r);

  const commonProps = {
    fill,
    stroke: '#1a202c',
    strokeWidth: 2,
    ...props,
  };

  switch (element) {
    case 'circle':
      return <circle {...commonProps} />;
    case 'rect':
      return <rect {...commonProps} />;
    case 'polygon':
      return <polygon {...commonProps} />;
    case 'path':
      return <path {...commonProps} />;
    default:
      return null;
  }
}
