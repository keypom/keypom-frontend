import { useState } from 'react';

interface useStepsProps {
  maxSteps: number;
}

export const useSteps = ({ maxSteps }: useStepsProps) => {
  const [currentIndex, setIndex] = useState(0);
  const onNext = () => {
    if (currentIndex + 1 < maxSteps) {
      setIndex(currentIndex + 1);
    }
  };

  const onPrevious = () => {
    if (currentIndex - 1 >= 0) {
      setIndex(currentIndex - 1);
    }
  };

  return { onNext, onPrevious, currentIndex };
};
