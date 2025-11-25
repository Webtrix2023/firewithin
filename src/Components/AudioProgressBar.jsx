import { useRef, useState, useEffect, useCallback } from "react";

export default function AudioProgressBar({
  value = 0,         // 0–100
  onChange,          // fires while dragging/clicking
  onSeekEnd          // fires ONCE when drag ends
}) {
  const barRef = useRef(null);
  const dragging = useRef(false);
  const [pos, setPos] = useState(value);

  // ✅ update only when NOT dragging
  useEffect(() => {
    if (!dragging.current) setPos(value);
  }, [value]);

  const calculatePercent = (clientX) => {
    const rect = barRef.current.getBoundingClientRect();
    let percent = ((clientX - rect.left) / rect.width) * 100;
    return Math.max(0, Math.min(100, percent));
  };

  const startDrag = (clientX) => {
    dragging.current = true;
    const percent = calculatePercent(clientX);
    setPos(percent);
    onChange?.(percent);
  };

  const updateDrag = useCallback(
    (clientX) => {
      if (!dragging.current) return;
      const percent = calculatePercent(clientX);
      setPos(percent);
      onChange?.(percent);
    },
    [onChange]
  );

  const endDrag = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    onSeekEnd?.(pos); // ✅ final commit
  }, [onSeekEnd, pos]);

  // ✅ global events only while dragging
  useEffect(() => {
    if (!dragging.current) return;

    const handleMove = (e) =>
      updateDrag(e.touches?.[0]?.clientX ?? e.clientX);

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", endDrag);

    document.addEventListener("touchmove", handleMove, { passive: true });
    document.addEventListener("touchend", endDrag);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", endDrag);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", endDrag);
    };
  }, [updateDrag, endDrag]);

  return (
    <div
      ref={barRef}
      className="relative w-full h-2 bg-gray-700 rounded-full cursor-pointer select-none"
      onMouseDown={(e) => startDrag(e.clientX)}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      style={{ touchAction: "pan-y" }} // ✅ scrolling still works
    >
      {/* ✅ completed bar */}
      <div
        className="absolute left-0 top-0 h-full bg-red-600 rounded-full"
        style={{ width: `${pos}%` }}
      />

      {/* ✅ scrubber/knob (like YouTube) */}
      <div
        className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-md"
        style={{
          left: `${pos}%`,
          transform: "translate(-50%, -50%)",
          transition: dragging.current ? "none" : "transform 0.12s ease"
        }}
      />
    </div>
  );
}
