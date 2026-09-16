import { useEffect, useState } from "preact/hooks";
import { loadProgress, saveCount, saveTotal } from "../lib/storage";
import { goalReachedHaptic } from "../lib/haptics";
import { GoalOverlay } from "./GoalOverlay";

interface CounterProps {
  id: string;
  targetCount: number;
}

export function Counter({ id, targetCount }: CounterProps) {
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadProgress(id).then((progress) => {
      if (cancelled) return;
      setCount(progress.count);
      setTotal(progress.total);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const goalReached = loaded && count >= targetCount;

  function handleTap() {
    // Block taps until the real stored progress has loaded — otherwise a tap
    // during the CloudStorage round-trip would start counting from 0 and then
    // either get clobbered by the real value or overwrite it with a wrong count.
    if (!loaded || goalReached) return;
    const nextCount = count + 1;
    const nextTotal = total + 1;
    setCount(nextCount);
    setTotal(nextTotal);
    saveCount(id, nextCount);
    saveTotal(id, nextTotal);
    if (nextCount >= targetCount) {
      goalReachedHaptic();
    }
  }

  function handleReset() {
    setCount(0);
    saveCount(id, 0);
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
