import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

const Draggable = ({ children, id, styles, activeTransform }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  let updatedTransform = CSS.Translate.toString(transform);

  // SwipeToDelete: Disregard draggable motion, stick to left
  if (activeTransform) {
    if (activeTransform.id === id) {
      updatedTransform = activeTransform.transform;
    }
  }

  const style = {
    transform: updatedTransform,
    ...styles,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      touch-action="none"
    >
      {children}
    </div>
  );
};

export { Draggable };
