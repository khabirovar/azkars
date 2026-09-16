interface GoalOverlayProps {
  onReset: () => void;
}

export function GoalOverlay({ onReset }: GoalOverlayProps) {
  // Stop the click from bubbling to the parent counter's own onClick (handleTap) —
  // otherwise the same tap that resets the count immediately re-increments it.
  function handleClick(e: MouseEvent) {
    e.stopPropagation();
    onReset();
  }

  return (
    <div class="goal-overlay" onClick={handleClick}>
      Цель достигнута
      <br />
      (нажмите, чтобы сбросить)
    </div>
  );
}
