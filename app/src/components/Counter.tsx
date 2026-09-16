import { useState } from "preact/hooks";
import { goalReachedHaptic } from "../lib/haptics";
import { GoalOverlay } from "./GoalOverlay";

interface CounterProps {
  targetCount: number;
}

// Progress is intentionally in-memory only, not persisted anywhere: it lives
// for as long as this Mini App session is open (SwipeDeck keeps every card's
// Counter mounted, so it survives swiping between azkars) and starts fresh
// at 0 the next time the app is opened, with no special "on close" handling.
export function Counter({ targetCount }: CounterProps) {
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);

  const goalReached = count >= targetCount;

  function handleTap() {
    if (goalReached) return;
    const nextCount = count + 1;
    setCount(nextCount);
    setTotal(total + 1);
    if (nextCount >= targetCount) {
      goalReachedHaptic();
    }
  }

  function handleReset() {
    setCount(0);
  }

  return (
    <div class="reader-bottom" onClick={handleTap}>
      <div class="reader-target">{targetCount}</div>
      <div class="reader-count">{count}</div>
      <div class="reader-total">{total}</div>
      {goalReached && <GoalOverlay onReset={handleReset} />}
    </div>
  );
}
