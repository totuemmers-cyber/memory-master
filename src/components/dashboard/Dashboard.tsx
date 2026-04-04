import { GreetingHeader } from './GreetingHeader';
import { StreakDisplay } from './StreakDisplay';
import { DailyChallengeCards } from './DailyChallengeCards';
import { QuickStats } from './QuickStats';
import { useNavigate } from 'react-router';
import { PixelButton } from '../ui/PixelButton';

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <GreetingHeader />
      <StreakDisplay />
      <DailyChallengeCards />
      <QuickStats />
      <div className="text-center">
        <PixelButton variant="secondary" onClick={() => navigate('/free-training')}>
          Freies Training
        </PixelButton>
      </div>
    </div>
  );
}
