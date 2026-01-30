import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './AutoRefresh.module.css';

interface AutoRefreshProps {
  onRefresh: () => void;
  disabled?: boolean;
}

const PRESET_INTERVALS = [
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '15 min', value: 15 },
];

export const AutoRefresh = ({ onRefresh, disabled = false }: AutoRefreshProps) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [intervalMinutes, setIntervalMinutes] = useState(5);
  const [customMinutes, setCustomMinutes] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const countdownRef = useRef<number | null>(null);
  const pendingRefreshRef = useRef(false);
  const onRefreshRef = useRef(onRefresh);

  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  const clearCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const startCountdown = useCallback(() => {
    clearCountdown();
    const totalSeconds = intervalMinutes * 60;
    setSecondsRemaining(totalSeconds);
    pendingRefreshRef.current = false;

    countdownRef.current = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (document.hidden) {
            pendingRefreshRef.current = true;
          } else {
            onRefreshRef.current();
          }
          return intervalMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);
  }, [intervalMinutes, clearCountdown]);

  useEffect(() => {
    if (isEnabled && !disabled) {
      startCountdown();
    } else {
      clearCountdown();
      setSecondsRemaining(0);
      pendingRefreshRef.current = false;
    }

    return clearCountdown;
  }, [isEnabled, disabled, startCountdown, clearCountdown]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && pendingRefreshRef.current && isEnabled && !disabled) {
        pendingRefreshRef.current = false;
        onRefreshRef.current();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isEnabled, disabled]);

  const handleToggle = () => {
    setIsEnabled(!isEnabled);
  };

  const handlePresetClick = (minutes: number) => {
    setIntervalMinutes(minutes);
    setShowCustomInput(false);
    setCustomMinutes('');
  };

  const handleCustomClick = () => {
    setShowCustomInput(true);
  };

  const handleCustomSubmit = () => {
    const minutes = parseInt(customMinutes, 10);
    if (minutes >= 1 && minutes <= 60) {
      setIntervalMinutes(minutes);
      setShowCustomInput(false);
    }
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomSubmit();
    }
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={handleToggle}
            disabled={disabled}
            className={styles.checkbox}
          />
          <span className={styles.toggleText}>Auto-refresh</span>
        </label>
        {isEnabled && secondsRemaining > 0 && (
          <span className={styles.countdown}>
            Next refresh in {formatTime(secondsRemaining)}
          </span>
        )}
      </div>

      {isEnabled && (
        <div className={styles.controls}>
          <div className={styles.presets}>
            {PRESET_INTERVALS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => handlePresetClick(preset.value)}
                className={`${styles.presetButton} ${
                  intervalMinutes === preset.value && !showCustomInput ? styles.active : ''
                }`}
              >
                {preset.label}
              </button>
            ))}
            <button
              type="button"
              onClick={handleCustomClick}
              className={`${styles.presetButton} ${showCustomInput ? styles.active : ''}`}
            >
              Custom
            </button>
          </div>

          {showCustomInput && (
            <div className={styles.customInput}>
              <input
                type="number"
                min="1"
                max="60"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                onKeyDown={handleCustomKeyDown}
                placeholder="1-60"
                className={styles.input}
              />
              <span className={styles.inputLabel}>min</span>
              <button
                type="button"
                onClick={handleCustomSubmit}
                disabled={!customMinutes || parseInt(customMinutes, 10) < 1 || parseInt(customMinutes, 10) > 60}
                className={styles.setButton}
              >
                Set
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
