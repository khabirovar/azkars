import { useEffect, useState } from "preact/hooks";
import type { AzkarEntry, TimeOfDay } from "../types/azkar";
import type { Settings } from "../lib/settings";
import { SwipeDeck } from "../components/SwipeDeck";
import { Counter } from "../components/Counter";

interface ReaderProps {
  timeOfDay: TimeOfDay;
  entries: AzkarEntry[];
  index: number;
  onIndexChange: (index: number) => void;
  settings: Settings;
}

export function Reader({ entries, index, onIndexChange, settings }: ReaderProps) {
  const [sourceOpenFor, setSourceOpenFor] = useState<string | null>(null);
  const openEntry = entries.find((e) => e.id === sourceOpenFor);

  // Close the popup on swipe — otherwise it stays open over whatever card
  // the user swipes to next, showing the previous entry's source text.
  useEffect(() => {
    setSourceOpenFor(null);
  }, [index]);

  return (
    <div class="screen reader">
      <SwipeDeck
        items={entries}
        index={index}
        onIndexChange={onIndexChange}
        renderItem={(entry, i) => (
          <>
            <div class="reader-top">
              <div class="reader-position">
                {i + 1}/{entries.length}
              </div>
              {entry.sourceRu && (
                <button class="reader-info-button" onClick={() => setSourceOpenFor(entry.id)}>
                  i
                </button>
              )}
              <div class="reader-top-content">
                <div class="reader-arabic">{entry.arabicText}</div>
                {settings.showTransliteration && (
                  <div class="reader-transliteration">{entry.transliterationRu}</div>
                )}
                {settings.showTranslation && <div class="reader-translation">{entry.translationRu}</div>}
              </div>
            </div>
            <Counter targetCount={entry.targetCount} />
          </>
        )}
      />
      {openEntry && (
        <div class="source-popup" onClick={() => setSourceOpenFor(null)}>
          <div class="source-popup-content" onClick={(e) => e.stopPropagation()}>
            {openEntry.sourceRu}
          </div>
        </div>
      )}
    </div>
  );
}
