import { HashRouter, Routes, Route } from 'react-router';
import { AppShell } from './components/layout/AppShell';
import { PixelToast } from './components/ui/PixelToast';
import { Dashboard } from './components/dashboard/Dashboard';
import { ChallengeRunner } from './components/challenge/ChallengeRunner';
import { FreeTrainingPicker } from './components/dashboard/FreeTrainingPicker';
import { StatsPage } from './components/stats/StatsPage';
import { AchievementGallery } from './components/achievements/AchievementGallery';
import { SettingsPage } from './components/settings/SettingsPage';
import './challenges';

function App() {
  return (
    <HashRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/challenge/:id" element={<ChallengeRunner />} />
          <Route path="/free-training" element={<FreeTrainingPicker />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/achievements" element={<AchievementGallery />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppShell>
      <PixelToast />
    </HashRouter>
  );
}

export default App;
