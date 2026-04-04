import type { Scene } from './types';
import { SCENE_WIDTH, SCENE_HEIGHT } from './types';
import { SceneObjectSVG } from './SceneObject';

interface SceneCanvasProps {
  scene: Scene;
  visible: boolean;
}

export function SceneCanvas({ scene, visible }: SceneCanvasProps) {
  return (
    <div className="challenge-zone relative w-full max-w-[600px] mx-auto">
      <div
        className="transition-all duration-300"
        style={{
          opacity: visible ? 1 : 0,
          filter: visible ? 'none' : 'blur(20px)',
        }}
      >
        <svg
          viewBox={`0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`}
          className="w-full h-auto bg-[#F7FAFC] rounded-lg"
          style={{ aspectRatio: `${SCENE_WIDTH}/${SCENE_HEIGHT}` }}
        >
          {/* Subtle quadrant grid lines */}
          <line x1={SCENE_WIDTH / 2} y1={0} x2={SCENE_WIDTH / 2} y2={SCENE_HEIGHT}
            stroke="#E2E8F0" strokeWidth={1} strokeDasharray="8,8" />
          <line x1={0} y1={SCENE_HEIGHT / 2} x2={SCENE_WIDTH} y2={SCENE_HEIGHT / 2}
            stroke="#E2E8F0" strokeWidth={1} strokeDasharray="8,8" />

          {/* Objects */}
          {scene.objects.map((obj) => (
            <SceneObjectSVG key={obj.id} object={obj} />
          ))}
        </svg>
      </div>
    </div>
  );
}
