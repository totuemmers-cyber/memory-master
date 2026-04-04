import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GameState, PlayerProfile, DailyState, SessionRecord, UserSettings } from '../types';
import type { ChallengeCategory, ChallengeResult } from '../types';
import { getTodayString, isYesterday } from '../utils/date';
import { calculateNewDifficulty } from '../engine/adaptive-difficulty';
import { checkAchievements } from '../engine/achievement-engine';
import { v4Id } from './persistence';

const STORAGE_KEY = 'memory-master-state';

const defaultProfile: PlayerProfile = {
  createdAt: Date.now(),
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
  totalSessions: 0,
  categoryDifficulties: {},
  categoryHistory: {},
};

const defaultDailyState: DailyState = {
  date: '',
  challenges: [],
  completed: [false, false, false],
};

const defaultSettings: UserSettings = {
  soundEnabled: true,
  soundVolume: 0.5,
};

const initialState: GameState = {
  version: 1,
  profile: defaultProfile,
  history: [],
  achievements: [],
  dailyState: defaultDailyState,
  settings: defaultSettings,
};

interface GameActions {
  recordChallengeResult: (challengeId: string, category: ChallengeCategory, result: ChallengeResult, mode: 'daily' | 'free', dailySlot?: 1 | 2 | 3) => string[];
  setDailyChallenges: (state: DailyState) => void;
  unlockAchievement: (achievementId: string) => void;
  updateStreak: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;
  resetState: () => void;
  importState: (state: GameState) => void;
  getState: () => GameState;
}

export type GameStore = GameState & GameActions;

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      recordChallengeResult: (challengeId, category, result, mode, dailySlot) => {
        const record: SessionRecord = {
          id: v4Id(),
          challengeId,
          category,
          result,
          mode,
          date: getTodayString(),
        };

        const currentState = get();
        const currentDiff = currentState.profile.categoryDifficulties[category] || 1;
        const history = [...(currentState.profile.categoryHistory[category] || [])];
        history.unshift({ score: result.score, difficulty: result.difficulty, timestamp: result.timestamp });
        if (history.length > 20) history.length = 20;

        const { newDifficulty } = calculateNewDifficulty(currentDiff, history);

        const newCompleted = [...currentState.dailyState.completed];
        if (mode === 'daily' && dailySlot) {
          newCompleted[dailySlot - 1] = true;
        }

        const newDailyChallenges = currentState.dailyState.challenges.map((c, i) => {
          if (mode === 'daily' && dailySlot && i === dailySlot - 1) {
            return { ...c, result };
          }
          return c;
        });

        set((state) => ({
          history: [...state.history, record],
          profile: {
            ...state.profile,
            totalSessions: state.profile.totalSessions + 1,
            categoryDifficulties: {
              ...state.profile.categoryDifficulties,
              [category]: newDifficulty,
            },
            categoryHistory: {
              ...state.profile.categoryHistory,
              [category]: history,
            },
          },
          dailyState: {
            ...state.dailyState,
            completed: newCompleted,
            challenges: newDailyChallenges,
          },
        }));

        // Check achievements
        const updatedState = get();
        const newAchievements = checkAchievements(updatedState, {
          type: 'challenge_completed',
          result,
          record,
        });

        if (newAchievements.length > 0) {
          set((state) => ({
            achievements: [
              ...state.achievements,
              ...newAchievements.map((id) => ({
                achievementId: id,
                unlocked: true,
                unlockedAt: Date.now(),
              })),
            ],
          }));
        }

        // Check if all dailies complete -> update streak
        const finalState = get();
        if (finalState.dailyState.completed.every(Boolean)) {
          get().updateStreak();
        }

        return newAchievements;
      },

      setDailyChallenges: (dailyState) => set({ dailyState }),

      unlockAchievement: (achievementId) => {
        set((state) => {
          if (state.achievements.find((a) => a.achievementId === achievementId && a.unlocked)) {
            return state;
          }
          return {
            achievements: [
              ...state.achievements,
              { achievementId, unlocked: true, unlockedAt: Date.now() },
            ],
          };
        });
      },

      updateStreak: () => {
        const today = getTodayString();
        set((state) => {
          const { lastActiveDate, currentStreak } = state.profile;
          let newStreak: number;
          if (lastActiveDate === today) {
            newStreak = currentStreak;
          } else if (isYesterday(lastActiveDate) || lastActiveDate === '') {
            newStreak = currentStreak + 1;
          } else {
            newStreak = 1;
          }
          return {
            profile: {
              ...state.profile,
              currentStreak: newStreak,
              longestStreak: Math.max(state.profile.longestStreak, newStreak),
              lastActiveDate: today,
            },
          };
        });

        // Check streak achievements
        const updatedState = get();
        const streakAchievements = checkAchievements(updatedState, {
          type: 'streak_updated',
          streak: updatedState.profile.currentStreak,
        });
        if (streakAchievements.length > 0) {
          set((state) => ({
            achievements: [
              ...state.achievements,
              ...streakAchievements.map((id) => ({
                achievementId: id,
                unlocked: true,
                unlockedAt: Date.now(),
              })),
            ],
          }));
        }
      },

      setSoundEnabled: (enabled) => set((s) => ({ settings: { ...s.settings, soundEnabled: enabled } })),
      setSoundVolume: (volume) => set((s) => ({ settings: { ...s.settings, soundVolume: volume } })),
      resetState: () => set({ ...initialState, profile: { ...defaultProfile, createdAt: Date.now() } }),
      importState: (state) => set(state),
      getState: () => {
        const { recordChallengeResult, setDailyChallenges, unlockAchievement, updateStreak, setSoundEnabled, setSoundVolume, resetState, importState, getState, ...state } = get();
        return state as GameState;
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
