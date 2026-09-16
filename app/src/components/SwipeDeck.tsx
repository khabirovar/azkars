import { useRef, useState } from "preact/hooks";
import type { JSX } from "preact";

interface SwipeDeckProps<T> {
  items: T[];
  index: number;
  onIndexChange: (index: number) => void;
  renderItem: (item: T, index: number) => JSX.Element;
}

const SWIPE_THRESHOLD_PX = 60;

export function SwipeDeck<T>({ items, index, onIndexChange, renderItem }: SwipeDeckProps<T>) {
  // dragX (state) drives the visual transform; dragXRef mirrors it for reading
  // inside endDrag synchronously — state updates are async, so a fast sequence
  // of pointer events (all pointermoves + pointerup before Preact re-renders)
  // would otherwise make endDrag see a stale dragX from before the drag.
  const [dragX, setDragX] = useState(0);
  const dragXRef = useRef(0);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const horizontal = useRef(false);

  function onPointerDown(e: PointerEvent) {
    startX.current = e.clientX;
    startY.current = e.clientY;
    horizontal.current = false;
  }

  function onPointerMove(e: PointerEvent) {
    if (startX.current === null || startY.current === null) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    if (!horizontal.current) {
      // Only claim the gesture once it's clearly horizontal, so vertical
      // scrolling inside a card (and Telegram's own swipe-to-close) still work.
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      horizontal.current = Math.abs(dx) > Math.abs(dy) * 1.2;
      if (!horizontal.current) return;
      // Capture only once a real horizontal drag is confirmed — not on every
      // pointerdown — so plain taps (counter, goal overlay, info button) never
      // touch pointer capture at all. Guarantees pointerup/pointercancel still
      // reaches this element even if the finger leaves it mid-drag.
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    }
    dragXRef.current = dx;
    setDragX(dx);
  }

  function endDrag() {
    if (horizontal.current) {
      const finalDragX = dragXRef.current;
      if (finalDragX <= -SWIPE_THRESHOLD_PX && index < items.length - 1) {
        onIndexChange(index + 1);
      } else if (finalDragX >= SWIPE_THRESHOLD_PX && index > 0) {
        onIndexChange(index - 1);
      }
    }
    startX.current = null;
    startY.current = null;
    horizontal.current = false;
    dragXRef.current = 0;
    setDragX(0);
  }

  const offsetPercent = -index * 100;
  const dragPercent = items.length ? (dragX / window.innerWidth) * 100 : 0;

  return (
    <div
      class="reader-deck"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          transform: `translateX(${offsetPercent + dragPercent}%)`,
          transition: horizontal.current && dragX !== 0 ? "none" : "transform 0.25s ease-out",
        }}
      >
        {items.map((item, i) => (
          <div class="reader-card" key={i}>
            {renderItem(item, i)}
          </div>
        ))}
      </div>
    </div>
  );
}
