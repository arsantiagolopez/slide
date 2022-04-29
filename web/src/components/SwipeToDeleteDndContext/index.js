import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import React from "react";

const SwipeToDeleteDndContext = ({
  children,
  setActiveDelete,
  setActiveTransform,
}) => {
  // Set activeDelete
  const handleDragStart = (event) => {
    const { active } = event;

    setActiveDelete(active.id);
    setActiveTransform(null);
  };

  const handleDragEnd = (event) => {
    const { delta, active } = event;

    // If dragged further enough left, stay there
    if (delta.x < -100) {
      return setActiveTransform({
        id: active.id,
        transform: "translateX(-20%)",
      });
    }
  };

  // Custom modifier to prevent drag to the right
  const preventRightDrag = ({ transform }) => {
    return {
      ...transform,
      x: transform.x > 0 ? 0 : transform.x,
    };
  };

  // Require the mouse to move by 10 pixels before activating
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 50,
      tolerance: 5,
    },
  });

  // Press delay of 250ms, with tolerance of 5px of movement
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });

  return (
    <DndContext
      sensors={useSensors(touchSensor, mouseSensor)}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToHorizontalAxis, preventRightDrag]}
    >
      {children}
    </DndContext>
  );
};

export { SwipeToDeleteDndContext };
