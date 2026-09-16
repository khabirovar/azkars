import { useEffect, useState } from "preact/hooks";
import type { AzkarEntry, TimeOfDay } from "../types/azkar";
import { getByTimeOfDay } from "../lib/azkarStore";

const TITLES: Record<TimeOfDay, string> = {
  morning: "Утренние азкары",
  evening: "Вечерние азкары",
  "after-prayer": "Поминания после молитвы",
};

interface AzkarListProps {
  timeOfDay: TimeOfDay;
  onSelect: (index: number) => void;
}

export function AzkarList({ timeOfDay, onSelect }: AzkarListProps) {
  const [entries, setEntries] = useState<AzkarEntry[] | null>(null);

  useEffect(() => {
    getByTimeOfDay(timeOfDay).then(setEntries);
  }, [timeOfDay]);

  return (
    <div class="screen">
      <div class="list-header">{TITLES[timeOfDay]}</div>
      {entries?.map((entry, i) => (
        <div class="list-item" key={entry.id} onClick={() => onSelect(i)}>
          <div class="list-item-arabic">{entry.arabicText}</div>
          <div class="list-item-target">×{entry.targetCount}</div>
        </div>
      ))}
    </div>
  );
}
