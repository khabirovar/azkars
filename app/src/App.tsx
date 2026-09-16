import { useEffect, useState } from "preact/hooks";
import type { AzkarEntry, TimeOfDay } from "./types/azkar";
import { getByTimeOfDay } from "./lib/azkarStore";
import { safeTg } from "./lib/telegram";
import { loadSettings, saveSetting, type Settings } from "./lib/settings";
import { Home } from "./screens/Home";
import { AzkarList } from "./screens/AzkarList";
import { Reader } from "./screens/Reader";

type Screen = { name: "home" } | { name: "list"; timeOfDay: TimeOfDay } | { name: "reader"; timeOfDay: TimeOfDay; index: number };

export function App() {
  const [screen, setScreen] = useState<Screen>({ name: "home" });
  const [entries, setEntries] = useState<AzkarEntry[]>([]);
  const [settings, setSettings] = useState<Settings>(() => loadSettings());

  function handleSettingChange(key: keyof Settings, value: boolean) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    saveSetting(key, value);
  }

  useEffect(() => {
    if (screen.name === "home") {
      safeTg((w) => w.BackButton.hide());
      return;
    }
    const goBack = () => {
      if (screen.name === "reader") {
        setScreen({ name: "list", timeOfDay: screen.timeOfDay });
      } else {
        setScreen({ name: "home" });
      }
    };
    safeTg((w) => w.BackButton.show());
    safeTg((w) => w.BackButton.onClick(goBack));
    return () => safeTg((w) => w.BackButton.offClick(goBack));
  }, [screen]);

  useEffect(() => {
    if (screen.name === "home") return;
    let cancelled = false;
    getByTimeOfDay(screen.timeOfDay).then((result) => {
      // Guard against a stale response arriving after the user has already
      // switched to a different category — without this, a slow/reordered
      // fetch for the previous category could overwrite the current one's entries.
      if (!cancelled) setEntries(result);
    });
    return () => {
      cancelled = true;
    };
  }, [screen.name === "home" ? null : screen.timeOfDay]);

  if (screen.name === "home") {
    return (
      <Home
        onSelect={(timeOfDay) => setScreen({ name: "list", timeOfDay })}
        settings={settings}
        onSettingChange={handleSettingChange}
      />
    );
  }

  if (screen.name === "list") {
    return (
      <AzkarList
        timeOfDay={screen.timeOfDay}
        onSelect={(index) => setScreen({ name: "reader", timeOfDay: screen.timeOfDay, index })}
      />
    );
  }

  return (
    <Reader
      timeOfDay={screen.timeOfDay}
      entries={entries}
      index={screen.index}
      onIndexChange={(index) => setScreen({ name: "reader", timeOfDay: screen.timeOfDay, index })}
      settings={settings}
    />
  );
}
