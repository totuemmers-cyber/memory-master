import { useState, useCallback, useEffect, useRef } from 'react';
import type { ChallengeProps } from '../../types';
import type { Scene, Question, AnsweredQuestion, GamePhase } from './types';
import { getDifficultyConfig } from './difficulty-config';
import { generateScene } from './scene-generator';
import { generateQuestions } from './question-generator';
import { calculateScore } from '../../engine/scoring';
import { calculateNewDifficulty } from '../../engine/adaptive-difficulty';
import { useGameStore } from '../../state/game-store';
import { useTimer } from '../../hooks/useTimer';
import { useSound } from '../../hooks/useSound';
import { SceneCanvas } from './SceneCanvas';
import { TimerBar } from './TimerBar';
import { CountdownOverlay } from './CountdownOverlay';
import { QuestionPanel } from './QuestionPanel';
import { ResultsScreen } from './ResultsScreen';
import { PixelButton } from '../../components/ui/PixelButton';

export function ObservationChamber({ difficulty, onComplete, onQuit }: ChallengeProps) {
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [scene, setScene] = useState<Scene | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answered, setAnswered] = useState<AnsweredQuestion[]>([]);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; correctAnswer: string } | null>(null);
  const [countdownValue, setCountdownValue] = useState(3);
  const [score, setScore] = useState(0);
  const [difficultyChange, setDifficultyChange] = useState<'up' | 'down' | 'stable'>('stable');
  const questionStartRef = useRef(performance.now());
  const sound = useSound();

  const config = getDifficultyConfig(difficulty);
  const viewDurationMs = config.viewingTime * 1000;

  // View timer
  const viewTimer = useTimer({
    durationMs: viewDurationMs,
    onComplete: useCallback(() => {
      setPhase('questions');
      setCurrentQIndex(0);
      questionStartRef.current = performance.now();
    }, []),
  });

  // Handle tab visibility during viewing
  useEffect(() => {
    if (phase !== 'viewing') return;
    const handleVisibility = () => {
      if (document.hidden) viewTimer.pause();
      else viewTimer.resume();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [phase, viewTimer]);

  const startRound = useCallback(() => {
    const newScene = generateScene(config);
    const newQuestions = generateQuestions(newScene, config);
    setScene(newScene);
    setQuestions(newQuestions);
    setAnswered([]);
    setFeedback(null);
    setCurrentQIndex(0);
    setScore(0);
    setDifficultyChange('stable');

    // Start countdown
    setPhase('countdown');
    setCountdownValue(3);
    sound.playCountdown();

    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdownValue(count);
        sound.playCountdown();
      } else {
        clearInterval(interval);
        setPhase('viewing');
        viewTimer.start();
        sound.playStart();
      }
    }, 1000);
  }, [config, sound, viewTimer]);

  const handleAnswer = useCallback((answer: string) => {
    const q = questions[currentQIndex];
    const isCorrect = answer === q.correctAnswer;
    const timeTaken = performance.now() - questionStartRef.current;

    if (isCorrect) sound.playCorrect();
    else sound.playWrong();

    const aq: AnsweredQuestion = {
      question: q,
      playerAnswer: answer,
      isCorrect,
      timeTakenMs: timeTaken,
    };

    setFeedback({ isCorrect, correctAnswer: q.correctAnswer });
    setAnswered(prev => [...prev, aq]);

    // Move to next question after delay
    setTimeout(() => {
      setFeedback(null);
      const nextIndex = currentQIndex + 1;
      if (nextIndex >= questions.length) {
        // All questions answered
        const allAnswered = [...answered, aq];
        const finalScore = calculateScore(
          allAnswered.filter(a => a.isCorrect).length,
          allAnswered.length
        );
        setScore(finalScore);

        // Calculate difficulty change
        const categoryHistory = useGameStore.getState().profile.categoryHistory['observation'] || [];
        const withNew = [{ score: finalScore, difficulty, timestamp: Date.now() }, ...categoryHistory];
        const { reason } = calculateNewDifficulty(difficulty, withNew);
        setDifficultyChange(reason);

        setPhase('results');

        // Report to parent
        onComplete({
          challengeId: 'observation-chamber',
          difficulty,
          score: finalScore,
          accuracy: allAnswered.filter(a => a.isCorrect).length / allAnswered.length,
          totalQuestions: allAnswered.length,
          correctAnswers: allAnswered.filter(a => a.isCorrect).length,
          timeUsed: allAnswered.reduce((sum, a) => sum + a.timeTakenMs, 0),
          timeAllowed: viewDurationMs,
          timestamp: Date.now(),
        });
      } else {
        setCurrentQIndex(nextIndex);
        questionStartRef.current = performance.now();
      }
    }, 1200);
  }, [questions, currentQIndex, answered, difficulty, viewDurationMs, onComplete, sound]);

  // IDLE phase
  if (phase === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6">
        <div className="text-pixel-gold font-pixel text-pixel-xl mb-2">Beobachtungskammer</div>
        <div className="text-pixel-muted font-pixel text-pixel-xs mb-2">Level {difficulty}</div>
        <div className="challenge-zone text-center text-sm text-gray-400 max-w-md leading-relaxed mb-4">
          Praege dir die Objekte ein. Danach wirst du Fragen dazu beantworten.
          <br /><br />
          <span className="text-pixel-gold font-pixel text-pixel-xs">{config.objectCount} Objekte — {config.viewingTime}s — {config.questionCount} Fragen</span>
        </div>
        <div className="flex gap-3">
          <PixelButton variant="secondary" onClick={onQuit}>Abbrechen</PixelButton>
          <PixelButton variant="primary" size="lg" onClick={startRound}>Start</PixelButton>
        </div>
      </div>
    );
  }

  // COUNTDOWN phase
  if (phase === 'countdown') {
    return <CountdownOverlay value={countdownValue} />;
  }

  // VIEWING phase
  if (phase === 'viewing' && scene) {
    return (
      <div className="p-6">
        <TimerBar totalMs={viewDurationMs} remainingMs={viewTimer.remainingMs} />
        <SceneCanvas scene={scene} visible />
        <div className="text-center mt-4 font-pixel text-pixel-xs text-pixel-muted">
          Praege dir alles ein!
        </div>
      </div>
    );
  }

  // QUESTIONS phase
  if ((phase === 'questions' || phase === 'feedback') && questions[currentQIndex]) {
    return (
      <div className="p-6">
        {scene && <SceneCanvas scene={scene} visible={false} />}
        <QuestionPanel
          question={questions[currentQIndex]}
          questionNumber={currentQIndex + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
          feedback={feedback}
        />
      </div>
    );
  }

  // RESULTS phase
  if (phase === 'results') {
    return (
      <ResultsScreen
        score={score}
        answeredQuestions={answered}
        difficulty={difficulty}
        difficultyChange={difficultyChange}
        onPlayAgain={startRound}
        onBack={onQuit}
      />
    );
  }

  return null;
}
