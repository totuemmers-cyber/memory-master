import type { Shape } from './types';

export function getShapePath(shape: Shape, cx: number, cy: number, r: number): { element: string; props: Record<string, string | number> } {
  switch (shape) {
    case 'circle':
      return { element: 'circle', props: { cx, cy, r } };

    case 'square':
      return { element: 'rect', props: { x: cx - r * 0.85, y: cy - r * 0.85, width: r * 1.7, height: r * 1.7 } };

    case 'triangle': {
      const points = [
        [cx, cy - r],
        [cx - r * 0.866, cy + r * 0.5],
        [cx + r * 0.866, cy + r * 0.5],
      ].map(p => p.join(',')).join(' ');
      return { element: 'polygon', props: { points } };
    }

    case 'star': {
      const pts: string[] = [];
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI / 2) * -1 + (i * Math.PI) / 5;
        const radius = i % 2 === 0 ? r : r * 0.4;
        pts.push(`${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`);
      }
      return { element: 'polygon', props: { points: pts.join(' ') } };
    }

    case 'diamond': {
      const points = [
        [cx, cy - r],
        [cx + r * 0.65, cy],
        [cx, cy + r],
        [cx - r * 0.65, cy],
      ].map(p => p.join(',')).join(' ');
      return { element: 'polygon', props: { points } };
    }

    case 'heart': {
      const d = `M ${cx} ${cy + r * 0.7}
        C ${cx} ${cy + r * 0.7}, ${cx - r} ${cy + r * 0.1}, ${cx - r} ${cy - r * 0.2}
        C ${cx - r} ${cy - r * 0.7}, ${cx - r * 0.3} ${cy - r * 0.9}, ${cx} ${cy - r * 0.4}
        C ${cx + r * 0.3} ${cy - r * 0.9}, ${cx + r} ${cy - r * 0.7}, ${cx + r} ${cy - r * 0.2}
        C ${cx + r} ${cy + r * 0.1}, ${cx} ${cy + r * 0.7}, ${cx} ${cy + r * 0.7} Z`;
      return { element: 'path', props: { d } };
    }

    case 'hexagon': {
      const pts: string[] = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        pts.push(`${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`);
      }
      return { element: 'polygon', props: { points: pts.join(' ') } };
    }

    case 'pentagon': {
      const pts: string[] = [];
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
        pts.push(`${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`);
      }
      return { element: 'polygon', props: { points: pts.join(' ') } };
    }
  }
}
