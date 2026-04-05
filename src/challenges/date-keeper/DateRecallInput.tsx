import { useState, useCallback } from 'react';
import type { HistoricalEvent } from './event-generator';
import { formatEventDate, MONTH_NAMES } from './event-generator';
import type { DateKeeperDifficulty } from './difficulty-config';
import { cn } from '../../utils/cn';

interface DateRecallInputProps {
  event: HistoricalEvent;
  config: DateKeeperDifficulty;
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  feedback: { isCorrect: boolean; correctAnswer: string } | null;
  mcOptions?: string[];
}

export function DateRecallInput({
  event,
  config,
  questionIndex,
  totalQuestions,
  onAnswer,
  feedback,
  mcOptions,
}: DateRecallInputProps) {

  if (config.recallFormat === 'multipleChoice') {
    return (
      <MultipleChoiceInput
        event={event}
        config={config}
        questionIndex={questionIndex}
        totalQuestions={totalQuestions}
        onAnswer={onAnswer}
        feedback={feedback}
        options={mcOptions || []}
      />
    );
  }

  return (
    <DropdownInput
      event={event}
      config={config}
      questionIndex={questionIndex}
      totalQuestions={totalQuestions}
      onAnswer={onAnswer}
      feedback={feedback}
    />
  );
}

/* ---------- Multiple Choice ---------- */

function MultipleChoiceInput({
  event,
  config,
  questionIndex,
  totalQuestions,
  onAnswer,
  feedback,
  options,
}: DateRecallInputProps & { options: string[] }) {
  const correctAnswer = formatEventDate(event, config.dateFormat);

  return (
    <div className="challenge-zone max-w-lg mx-auto p-6">
      <div className="text-pixel-muted text-pixel-xs mb-6 text-center font-pixel">
        Event {questionIndex + 1} / {totalQuestions}
      </div>

      <h3 className="text-lg font-medium text-white mb-8 text-center leading-relaxed">
        When did <span className="text-pixel-gold">{event.name}</span> happen?
      </h3>

      <div className="flex flex-col gap-3">
        {options.map((option, i) => (
          <button
            key={i}
            onClick={() => !feedback && onAnswer(option)}
            disabled={!!feedback}
            className={cn(
              'w-full py-3 px-4 text-left rounded-lg border-2 transition-all text-base',
              feedback
                ? option === correctAnswer
                  ? 'border-pixel-emerald bg-pixel-emerald/20 text-pixel-emerald'
                  : 'border-pixel-surface-light bg-pixel-surface text-pixel-muted'
                : 'border-pixel-surface-light bg-pixel-surface text-white hover:border-pixel-gold hover:bg-pixel-surface-light cursor-pointer'
            )}
          >
            <span className="font-pixel text-pixel-xs text-pixel-muted mr-3">{i + 1}.</span>
            {option}
          </button>
        ))}
      </div>

      {feedback && (
        <div className={cn(
          'mt-6 text-center font-pixel text-pixel-sm',
          feedback.isCorrect ? 'text-pixel-emerald' : 'text-pixel-red'
        )}>
          {feedback.isCorrect ? 'Correct!' : `Wrong! Answer: ${feedback.correctAnswer}`}
        </div>
      )}
    </div>
  );
}

/* ---------- Dropdown ---------- */

function DropdownInput({
  event,
  config,
  questionIndex,
  totalQuestions,
  onAnswer,
  feedback,
}: Omit<DateRecallInputProps, 'mcOptions'>) {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // Generate year range around the correct year
  const yearStart = Math.max(1000, event.year - 20);
  const yearEnd = Math.min(2030, event.year + 20);
  const years: number[] = [];
  for (let y = yearStart; y <= yearEnd; y++) years.push(y);

  const days: number[] = [];
  for (let d = 1; d <= 31; d++) days.push(d);

  const handleSubmit = useCallback(() => {
    if (feedback) return;
    let answer: string;
    if (config.dateFormat === 'year') {
      answer = selectedYear;
    } else if (config.dateFormat === 'monthYear') {
      answer = `${selectedMonth} ${selectedYear}`;
    } else {
      answer = `${selectedMonth} ${selectedDay}, ${selectedYear}`;
    }
    onAnswer(answer);
  }, [config.dateFormat, selectedMonth, selectedDay, selectedYear, onAnswer, feedback]);

  const isComplete = (() => {
    if (config.dateFormat === 'year') return !!selectedYear;
    if (config.dateFormat === 'monthYear') return !!selectedMonth && !!selectedYear;
    return !!selectedMonth && !!selectedDay && !!selectedYear;
  })();

  const selectClasses = cn(
    'bg-pixel-surface border-2 border-pixel-surface-light text-white rounded-lg',
    'px-3 py-2 font-pixel text-pixel-xs outline-none appearance-none cursor-pointer',
    'focus:border-pixel-gold hover:border-pixel-gold/60',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  );

  return (
    <div className="challenge-zone max-w-lg mx-auto p-6">
      <div className="text-pixel-muted text-pixel-xs mb-6 text-center font-pixel">
        Event {questionIndex + 1} / {totalQuestions}
      </div>

      <h3 className="text-lg font-medium text-white mb-8 text-center leading-relaxed">
        When did <span className="text-pixel-gold">{event.name}</span> happen?
      </h3>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        {/* Month selector (for monthYear and full) */}
        {(config.dateFormat === 'monthYear' || config.dateFormat === 'full') && (
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            disabled={!!feedback}
            className={selectClasses}
          >
            <option value="" disabled>Month</option>
            {MONTH_NAMES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        )}

        {/* Day selector (for full) */}
        {config.dateFormat === 'full' && (
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            disabled={!!feedback}
            className={selectClasses}
          >
            <option value="" disabled>Day</option>
            {days.map((d) => (
              <option key={d} value={String(d)}>{d}</option>
            ))}
          </select>
        )}

        {/* Year selector */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          disabled={!!feedback}
          className={selectClasses}
        >
          <option value="" disabled>Year</option>
          {years.map((y) => (
            <option key={y} value={String(y)}>{y}</option>
          ))}
        </select>
      </div>

      {!feedback && (
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className="px-6 py-2 bg-pixel-gold text-pixel-dark font-pixel text-pixel-sm rounded-lg hover:bg-pixel-gold/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm
          </button>
        </div>
      )}

      {feedback && (
        <div className={cn(
          'mt-6 text-center font-pixel text-pixel-sm',
          feedback.isCorrect ? 'text-pixel-emerald' : 'text-pixel-red'
        )}>
          {feedback.isCorrect ? 'Correct!' : `Wrong! Answer: ${feedback.correctAnswer}`}
        </div>
      )}
    </div>
  );
}
