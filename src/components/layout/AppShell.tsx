import type { ReactNode } from 'react';
import { PixelNav } from './PixelNav';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-pixel-dark flex flex-col">
      <div className="flex-1 overflow-y-auto pb-20">
        {children}
      </div>
      <PixelNav />
    </div>
  );
}
