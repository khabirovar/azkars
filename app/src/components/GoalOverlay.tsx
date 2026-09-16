interface GoalOverlayProps {
  onReset: () => void;
}

export function GoalOverlay({ onReset }: GoalOverlayProps) {
  return (
    <div class="goal-overlay" onClick={onReset}>
      Цель достигнута
      <br />
      (нажмите, чтобы сбросить)
    </div>
  );
}
