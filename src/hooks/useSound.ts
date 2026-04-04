import { useEffect, useCallback } from 'react';
import { soundEngine } from '../sound/sound-engine';
import { useGameStore } from '../state/game-store';

export function useSound() {
  const soundEnabled = useGameStore(s => s.settings.soundEnabled);
  const soundVolume = useGameStore(s => s.settings.soundVolume);

  useEffect(() => {
    soundEngine.setEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    soundEngine.setVolume(soundVolume);
  }, [soundVolume]);

  return {
    playCorrect: useCallback(() => soundEngine.playCorrect(), []),
    playWrong: useCallback(() => soundEngine.playWrong(), []),
    playAchievement: useCallback(() => soundEngine.playAchievement(), []),
    playLevelUp: useCallback(() => soundEngine.playLevelUp(), []),
    playClick: useCallback(() => soundEngine.playClick(), []),
    playTimerWarning: useCallback(() => soundEngine.playTimerWarning(), []),
    playCountdown: useCallback(() => soundEngine.playCountdown(), []),
    playStart: useCallback(() => soundEngine.playStart(), []),
  };
}
