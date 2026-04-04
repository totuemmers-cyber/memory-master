import { useState } from 'react';
import type { Question, Quadrant } from './types';
import { QUADRANT_LABELS_DE } from './types';
import { cn } from '../../utils/cn';

interface QuestionPanelProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  feedback: { isCorrect: boolean; correctAnswer: string } | null;
}

export function QuestionPanel({ question, questionNumber, totalQuestions, onAnswer, feedback }: QuestionPanelProps) {
  const [numberValue, setNumberValue] = useState('');

  return (
    <div className="challenge-zone max-w-lg mx-auto p-6">
      {/* Progress */}
      <div className="text-pixel-muted text-pixel-xs mb-6 text-center font-pixel">
        Frage {questionNumber} / {totalQuestions}
      </div>

      {/* Question text */}
      <h3 className="text-lg font-medium text-white mb-8 text-center leading-relaxed">
        {question.text}
      </h3>

      {/* Answer input */}
      {question.answerFormat === 'multipleChoice' && question.options && (
        <div className="flex flex-col gap-3">
          {question.options.map((option, i) => (
            <button
              key={i}
              onClick={() => !feedback && onAnswer(option)}
              disabled={!!feedback}
              className={cn(
                'w-full py-3 px-4 text-left rounded-lg border-2 transition-all text-base',
                feedback
                  ? option === feedback.correctAnswer
                    ? 'border-pixel-emerald bg-pixel-emerald/20 text-pixel-emerald'
                    : option === question.correctAnswer
                      ? 'border-pixel-emerald bg-pixel-emerald/20 text-pixel-emerald'
                      : feedback.isCorrect
                        ? 'border-pixel-surface-light bg-pixel-surface text-pixel-muted'
                        : 'border-pixel-surface-light bg-pixel-surface text-pixel-muted'
                  : 'border-pixel-surface-light bg-pixel-surface text-white hover:border-pixel-gold hover:bg-pixel-surface-light cursor-pointer'
              )}
            >
              <span className="font-pixel text-pixel-xs text-pixel-muted mr-3">{i + 1}.</span>
              {option}
            </button>
          ))}
        </div>
      )}

      {question.answerFormat === 'yesNo' && (
        <div className="flex gap-4 justify-center">
          {['Ja', 'Nein'].map((option) => (
            <button
              key={option}
              onClick={() => !feedback && onAnswer(option)}
              disabled={!!feedback}
              className={cn(
                'px-8 py-3 rounded-lg border-2 transition-all text-base font-medium min-w-[100px]',
                feedback
                  ? option === feedback.correctAnswer
                    ? 'border-pixel-emerald bg-pixel-emerald/20 text-pixel-emerald'
                    : 'border-pixel-surface-light bg-pixel-surface text-pixel-muted'
                  : 'border-pixel-surface-light bg-pixel-surface text-white hover:border-pixel-gold cursor-pointer'
              )}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {question.answerFormat === 'numberInput' && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNumberValue(v => String(Math.max(question.min || 0, (parseInt(v) || 0) - 1)))}
              disabled={!!feedback}
              className="w-10 h-10 bg-pixel-surface border-2 border-pixel-surface-light text-white rounded-lg text-xl hover:border-pixel-gold disabled:opacity-50"
            >
              -
            </button>
            <input
              type="number"
              value={numberValue}
              onChange={(e) => setNumberValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && numberValue && !feedback) {
                  onAnswer(numberValue);
                }
              }}
              disabled={!!feedback}
              min={question.min}
              max={question.max}
              className="w-20 h-12 text-center text-xl bg-pixel-surface border-2 border-pixel-surface-light text-white rounded-lg focus:border-pixel-gold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={() => setNumberValue(v => String(Math.min(question.max || 99, (parseInt(v) || 0) + 1)))}
              disabled={!!feedback}
              className="w-10 h-10 bg-pixel-surface border-2 border-pixel-surface-light text-white rounded-lg text-xl hover:border-pixel-gold disabled:opacity-50"
            >
              +
            </button>
          </div>
          {!feedback && (
            <button
              onClick={() => numberValue && onAnswer(numberValue)}
              disabled={!numberValue}
              className="px-6 py-2 bg-pixel-gold text-pixel-dark font-pixel text-pixel-sm rounded-lg hover:bg-pixel-gold/90 disabled:opacity-50"
            >
              Bestaetigen
            </button>
          )}
        </div>
      )}

      {question.answerFormat === 'quadrantSelect' && (
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
          {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as Quadrant[]).map((q) => (
            <button
              key={q}
              onClick={() => !feedback && onAnswer(QUADRANT_LABELS_DE[q])}
              disabled={!!feedback}
              className={cn(
                'py-4 px-3 rounded-lg border-2 transition-all text-sm text-center',
                feedback
                  ? QUADRANT_LABELS_DE[q] === feedback.correctAnswer
                    ? 'border-pixel-emerald bg-pixel-emerald/20 text-pixel-emerald'
                    : 'border-pixel-surface-light bg-pixel-surface text-pixel-muted'
                  : 'border-pixel-surface-light bg-pixel-surface text-white hover:border-pixel-gold cursor-pointer'
              )}
            >
              {QUADRANT_LABELS_DE[q]}
            </button>
          ))}
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div className={cn(
          'mt-6 text-center font-pixel text-pixel-sm',
          feedback.isCorrect ? 'text-pixel-emerald' : 'text-pixel-red'
        )}>
          {feedback.isCorrect ? 'Richtig!' : `Falsch! Richtig: ${feedback.correctAnswer}`}
        </div>
      )}
    </div>
  );
}
