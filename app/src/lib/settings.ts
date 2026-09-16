export interface Settings {
  showTransliteration: boolean;
  showTranslation: boolean;
}

const KEYS = {
  showTransliteration: "azkar:showTransliteration",
  showTranslation: "azkar:showTranslation",
} as const;

function readBool(key: string, fallback: boolean): boolean {
  const raw = localStorage.getItem(key);
  return raw === null ? fallback : raw === "true";
}

export function loadSettings(): Settings {
  return {
    showTransliteration: readBool(KEYS.showTransliteration, true),
    showTranslation: readBool(KEYS.showTranslation, true),
  };
}

export function saveSetting(key: keyof Settings, value: boolean): void {
  localStorage.setItem(KEYS[key], String(value));
}
