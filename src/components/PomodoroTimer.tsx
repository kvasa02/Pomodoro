import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Maximize2, Settings, Move, X } from 'lucide-react';
import TaskManager from './TaskManager';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

interface TimerConfig {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
}

const defaultConfig: TimerConfig = {
  pomodoro: 25 * 60, // 25 minutes in seconds
  shortBreak: 5 * 60, // 5 minutes in seconds
  longBreak: 15 * 60, // 15 minutes in seconds
};

const modeLabels = {
  pomodoro: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(defaultConfig.pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(defaultConfig.pomodoro);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDraggable, setIsDraggable] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    const newTime = defaultConfig[newMode];
    setTimeLeft(newTime);
    setInitialTime(newTime);
    setIsRunning(false);
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  const addTime = (minutes: number) => {
    const newTime = timeLeft + (minutes * 60);
    setTimeLeft(newTime);
    setInitialTime(newTime);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const toggleDraggable = () => {
    setIsDraggable(!isDraggable);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;
  const isBreakMode = mode === 'shortBreak' || mode === 'longBreak';

  return (
    <div className={`bg-background ${isFullScreen ? 'fixed inset-0 z-50' : 'min-h-screen'} flex`}>
      {/* Left Panel - Task Manager */}
      <div className="w-1/2 p-6">
        <TaskManager />
      </div>

      {/* Right Panel - Timer */}
      <div className="w-1/2 p-6">
        <Card className="p-8 bg-card shadow-soft h-full">
          {/* Timer Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-2">
              {Object.entries(modeLabels).map(([key, label]) => (
                <Button
                  key={key}
                  variant={mode === key ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => handleModeChange(key as TimerMode)}
                  className={mode === key ? (isBreakMode ? 'bg-break hover:bg-break/90' : 'bg-pomodoro hover:bg-pomodoro/90') : ''}
                >
                  {label}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleFullScreen}
                title={isFullScreen ? "Exit full screen" : "Enter full screen"}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleSettings}
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleDraggable}
                title={isDraggable ? "Disable drag mode" : "Enable drag mode"}
                className={isDraggable ? "bg-primary/20" : ""}
              >
                <Move className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Settings Modal */}
          {showSettings && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="p-6 w-96">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Settings</h2>
                  <Button variant="ghost" size="sm" onClick={toggleSettings}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Timer Durations (minutes)</label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Focus</label>
                        <input 
                          type="number" 
                          defaultValue={defaultConfig.pomodoro / 60}
                          className="w-full p-2 border rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Short Break</label>
                        <input 
                          type="number" 
                          defaultValue={defaultConfig.shortBreak / 60}
                          className="w-full p-2 border rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Long Break</label>
                        <input 
                          type="number" 
                          defaultValue={defaultConfig.longBreak / 60}
                          className="w-full p-2 border rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={toggleSettings}>Cancel</Button>
                    <Button onClick={toggleSettings}>Save</Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Timer Display */}
          <div className="text-center space-y-8">
            <div className="text-6xl font-mono font-bold text-foreground">
              {formatTime(timeLeft)}
            </div>

            {/* Time Adjustment Options */}
            <div className="flex justify-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => addTime(25)}
                disabled={isRunning}
              >
                + 25 min
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => addTime(10)}
                disabled={isRunning}
              >
                + 10 min
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => addTime(5)}
                disabled={isRunning}
              >
                + 5 min
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => addTime(1)}
                disabled={isRunning}
              >
                + 1 min
              </Button>
            </div>

            {/* Start Button */}
            <div className="pt-4">
              <Button
                size="lg"
                onClick={handlePlayPause}
                className={`px-12 py-3 text-lg ${
                  isBreakMode 
                    ? 'bg-break hover:bg-break/90' 
                    : 'bg-pomodoro hover:bg-pomodoro/90'
                } shadow-glow`}
              >
                {isRunning ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                {isRunning ? 'Pause' : 'Start'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}