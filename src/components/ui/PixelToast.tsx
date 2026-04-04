import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../state/game-store';
import { ALL_ACHIEVEMENTS } from '../../data/achievements';
import { PixelBadge } from './PixelBadge';
import { useSound } from '../../hooks/useSound';

interface ToastData {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: import('../../types').AchievementTier;
}

export function PixelToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const achievements = useGameStore(s => s.achievements);
  const { playAchievement } = useSound();
  const [lastCount, setLastCount] = useState(achievements.length);

  useEffect(() => {
    if (achievements.length > lastCount) {
      const newOnes = achievements.slice(lastCount);
      const toastData = newOnes
        .map(a => {
          const def = ALL_ACHIEVEMENTS.find(d => d.id === a.achievementId);
          if (!def) return null;
          return { id: def.id, name: def.name, description: def.description, icon: def.icon, tier: def.tier };
        })
        .filter((t): t is ToastData => t !== null);

      if (toastData.length > 0) {
        setToasts(prev => [...prev, ...toastData]);
        playAchievement();
      }
    }
    setLastCount(achievements.length);
  }, [achievements.length]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            onAnimationComplete={() => {
              setTimeout(() => removeToast(toast.id), 3000);
            }}
            className="bg-pixel-surface pixel-border p-4 flex items-center gap-3 min-w-[280px]"
          >
            <PixelBadge icon={toast.icon} tier={toast.tier} unlocked size="sm" />
            <div>
              <div className="text-pixel-gold text-pixel-xs mb-1">Achievement!</div>
              <div className="text-white text-pixel-sm">{toast.name}</div>
              <div className="text-pixel-muted text-pixel-xs mt-1">{toast.description}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
