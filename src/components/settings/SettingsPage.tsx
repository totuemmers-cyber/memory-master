import { useRef } from 'react';
import { useGameStore } from '../../state/game-store';
import { exportGameState, importGameState, downloadAsFile } from '../../state/persistence';
import { PixelButton } from '../ui/PixelButton';
import { PixelCard } from '../ui/PixelCard';

export function SettingsPage() {
  const soundEnabled = useGameStore(s => s.settings.soundEnabled);
  const setSoundEnabled = useGameStore(s => s.setSoundEnabled);
  const resetState = useGameStore(s => s.resetState);
  const importState = useGameStore(s => s.importState);
  const getState = useGameStore(s => s.getState);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const state = getState();
    const json = exportGameState(state);
    const date = new Date().toISOString().slice(0, 10);
    downloadAsFile(json, `memory-master-backup-${date}.json`);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const json = ev.target?.result as string;
      const result = importGameState(json);
      if (result.success && result.state) {
        importState(result.state);
        alert('Data imported successfully!');
      } else {
        alert('Import error: ' + (result.error || 'Unknown'));
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Delete all data? This cannot be undone!')) {
      resetState();
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-pixel-gold text-pixel-xl text-center mb-6">Settings</h1>

      <div className="space-y-4">
        {/* Sound */}
        <PixelCard>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-pixel-sm">Sound</div>
              <div className="text-pixel-muted text-pixel-xs mt-1">8-bit sounds</div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 ${
                soundEnabled ? 'bg-pixel-emerald' : 'bg-pixel-surface-light'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </PixelCard>

        {/* Export */}
        <PixelCard>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-pixel-sm">Export Data</div>
              <div className="text-pixel-muted text-pixel-xs mt-1">Save as JSON file</div>
            </div>
            <PixelButton size="sm" variant="secondary" onClick={handleExport}>
              Export
            </PixelButton>
          </div>
        </PixelCard>

        {/* Import */}
        <PixelCard>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-pixel-sm">Import Data</div>
              <div className="text-pixel-muted text-pixel-xs mt-1">Load JSON file</div>
            </div>
            <div>
              <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                onChange={handleImport}
                className="hidden"
              />
              <PixelButton size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                Import
              </PixelButton>
            </div>
          </div>
        </PixelCard>

        {/* Reset */}
        <PixelCard>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-pixel-sm">Reset Data</div>
              <div className="text-pixel-muted text-pixel-xs mt-1">Delete everything</div>
            </div>
            <PixelButton size="sm" variant="danger" onClick={handleReset}>
              Reset
            </PixelButton>
          </div>
        </PixelCard>
      </div>
    </div>
  );
}
