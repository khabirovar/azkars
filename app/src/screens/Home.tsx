import type { TimeOfDay } from "../types/azkar";
import type { Settings } from "../lib/settings";

interface HomeProps {
  onSelect: (timeOfDay: TimeOfDay) => void;
  settings: Settings;
  onSettingChange: (key: keyof Settings, value: boolean) => void;
}

const OPTIONS: { timeOfDay: TimeOfDay; label: string }[] = [
  { timeOfDay: "morning", label: "Утро" },
  { timeOfDay: "evening", label: "Вечер" },
  { timeOfDay: "after-prayer", label: "После молитвы" },
];

export function Home({ onSelect, settings, onSettingChange }: HomeProps) {
  return (
    <div class="screen home">
      <div class="home-title">Азкары</div>
      {OPTIONS.map((opt) => (
        <button key={opt.timeOfDay} class="home-button" onClick={() => onSelect(opt.timeOfDay)}>
          {opt.label}
        </button>
      ))}
      <div class="home-settings">
        <label class="home-checkbox">
          <input
            type="checkbox"
            checked={settings.showTransliteration}
            onChange={(e) => onSettingChange("showTransliteration", e.currentTarget.checked)}
          />
          Транслит
        </label>
        <label class="home-checkbox">
          <input
            type="checkbox"
            checked={settings.showTranslation}
            onChange={(e) => onSettingChange("showTranslation", e.currentTarget.checked)}
          />
          Перевод
        </label>
      </div>
    </div>
  );
}
