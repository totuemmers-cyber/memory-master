import { useGameStore } from '../../state/game-store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ScoreLineChart() {
  const history = useGameStore(s => s.history);

  const data = history.slice(-30).map((record, i) => ({
    index: i + 1,
    score: record.result.score,
    difficulty: record.result.difficulty,
    date: record.date,
  }));

  return (
    <div className="mb-8">
      <h2 className="text-pixel-sm text-white mb-4">Score History</h2>
      <div className="bg-pixel-surface p-4 pixel-border-muted" style={{ fontFamily: 'system-ui, sans-serif' }}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="index" stroke="#64748b" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: 4,
                fontSize: 12,
                fontFamily: 'system-ui',
              }}
              labelFormatter={(v) => `Session ${v}`}
            />
            <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: '#f59e0b' }} name="Score %" />
            <Line type="monotone" dataKey="difficulty" stroke="#10b981" strokeWidth={1} strokeDasharray="5 5" dot={false} name="Level" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
