import type { TimeOfDay } from "../types/azkar";

interface HomeProps {
  onSelect: (timeOfDay: TimeOfDay) => void;
}

const OPTIONS: { timeOfDay: TimeOfDay; label: string }[] = [
  { timeOfDay: "morning", label: "Утро" },
  { timeOfDay: "evening", label: "Вечер" },
  { timeOfDay: "after-prayer", label: "После молитвы" },
];

export function Home({ onSelect }: HomeProps) {
  return (
    <div class="screen home">
      <div class="home-title">Азкары</div>
      {OPTIONS.map((opt) => (
        <button key={opt.timeOfDay} class="home-button" onClick={() => onSelect(opt.timeOfDay)}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}
