import { useState, useEffect } from 'react';

interface MorphPair {
  from: string;
  to: string;
}

const morphPairs: MorphPair[] = [
  { from: 'Software', to: 'Intelligence' },
  { from: 'Code', to: 'Capability' },
  { from: 'Data', to: 'Decisions' },
];

export default function TypeMorph() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'showing' | 'morphing' | 'paused'>('showing');

  useEffect(() => {
    const showDuration = 3000; // 3 seconds showing "from"
    const morphDuration = 3500; // 3.5 seconds morphing
    const pauseDuration = 2000; // 2 seconds pause after morph

    const cycle = () => {
      // Show "from" text
      setPhase('showing');
      
      // Start morphing
      setTimeout(() => {
        setPhase('morphing');
        
        // Complete morph and pause
        setTimeout(() => {
          setPhase('paused');
          
          // Move to next pair
          setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % morphPairs.length);
          }, pauseDuration);
        }, morphDuration);
      }, showDuration);
    };

    // Initial delay
    const initialTimeout = setTimeout(cycle, 1000);

    // Set up interval for continuous cycling
    const totalCycle = showDuration + morphDuration + pauseDuration;
    const interval = setInterval(cycle, totalCycle);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const currentPair = morphPairs[currentIndex];

  return (
    <div className="type-morph-container">
      <span className="type-morph-text">
        <span className={`type-morph-from ${phase === 'morphing' ? 'morphing' : phase === 'showing' ? 'visible' : 'hidden'}`}>
          {currentPair.from}
        </span>
        <span className={`type-morph-to ${phase === 'morphing' ? 'morphing' : phase === 'paused' ? 'visible' : 'hidden'}`}>
          {currentPair.to}
        </span>
      </span>
    </div>
  );
}
