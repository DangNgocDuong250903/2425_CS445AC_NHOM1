import { useCallback, useRef } from "react";

const DragToScroll = ({ direction = "horizontal", children, className }) => {
  const containerRef = useRef();

  const handleMouseDown = useCallback(
    (e) => {
      const ele = containerRef.current;
      if (!ele) return;

      const startPos = {
        left: ele.scrollLeft,
        top: ele.scrollTop,
        x: e.clientX,
        y: e.clientY,
      };

      const handleMouseMove = (e) => {
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;
        if (direction === "horizontal") {
          ele.scrollLeft = startPos.left - dx;
        } else {
          ele.scrollTop = startPos.top - dy;
        }
        updateCursor(ele);
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        resetCursor(ele);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [direction]
  );

  const handleTouchStart = useCallback(
    (e) => {
      const ele = containerRef.current;
      if (!ele) return;

      const touch = e.touches[0];
      const startPos = {
        left: ele.scrollLeft,
        top: ele.scrollTop,
        x: touch.clientX,
        y: touch.clientY,
      };

      const handleTouchMove = (e) => {
        const touch = e.touches[0];
        const dx = touch.clientX - startPos.x;
        const dy = touch.clientY - startPos.y;
        if (direction === "horizontal") {
          ele.scrollLeft = startPos.left - dx;
        } else {
          ele.scrollTop = startPos.top - dy;
        }
        updateCursor(ele);
      };

      const handleTouchEnd = () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
        resetCursor(ele);
      };

      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    },
    [direction]
  );

  const updateCursor = (ele) => {
    ele.style.cursor = "grabbing";
    ele.style.userSelect = "none";
  };

  const resetCursor = (ele) => {
    ele.style.cursor = "grab";
    ele.style.removeProperty("user-select");
  };

  return (
    <div
      className={`container ${className} ${
        direction === "horizontal" ? "horizontal" : "vertical"
      }`}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {children}
    </div>
  );
};

export default DragToScroll;
