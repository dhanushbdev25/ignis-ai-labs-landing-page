import { useState, useEffect, useRef } from 'react';

const textItems: string[] = [
  'Digital transformation',
  'ERP modernization',
  'Financial systems',
  'Analytics insights',
  'Integrations',
];

export default function TypeMorph() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const displayDuration = 3000; // 3 seconds showing text
    const transitionDuration = 600; // 0.6 seconds for fade transition

    const cycle = () => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Fade out current text
      setIsVisible(false);
      
      // After fade out completes, change text and fade in
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % textItems.length);
        setIsVisible(true);
      }, transitionDuration);
    };

    // Start cycling after initial display duration
    timeoutRef.current = setTimeout(cycle, displayDuration);

    // Set up interval for continuous cycling
    const totalCycle = displayDuration + transitionDuration;
    intervalRef.current = setInterval(cycle, totalCycle);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const currentText = textItems[currentIndex];

  return (
    <div className="type-morph-container">
      <span className="type-morph-text">
        <span className={`type-morph-item ${isVisible ? 'visible' : 'hidden'}`}>
          {currentText}
        </span>
      </span>
    </div>
  );
}
