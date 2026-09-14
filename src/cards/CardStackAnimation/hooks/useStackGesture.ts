import { PanResponder } from 'react-native';
import { useRef } from 'react';

type UseStackGestureParams = {
  onDrag: (dy: number) => void;
  onRelease: (dy: number) => void;
  onCancel: () => void;
};

export function useStackGesture({
  onDrag,
  onRelease,
  onCancel,
}: UseStackGestureParams) {
  const onDragRef = useRef(onDrag);
  const onReleaseRef = useRef(onRelease);
  const onCancelRef = useRef(onCancel);

  onDragRef.current = onDrag;
  onReleaseRef.current = onRelease;
  onCancelRef.current = onCancel;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 5 &&
        Math.abs(gestureState.dy) > Math.abs(gestureState.dx),

      onPanResponderMove: (_, gestureState) => {
        onDragRef.current(gestureState.dy);
      },

      onPanResponderRelease: (_, gestureState) => {
        onReleaseRef.current(gestureState.dy);
      },

      onPanResponderTerminate: () => {
        onCancelRef.current();
      },
    })
  ).current;

  return panResponder;
}
