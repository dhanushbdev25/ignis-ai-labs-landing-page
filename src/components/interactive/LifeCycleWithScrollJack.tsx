import { useState } from 'react';
import ScrollJackHost from './ScrollJackHost';
import LifeCycleVisualization from './LifeCycleVisualization';

interface Phase {
  _id: string;
  title: string;
  description: string;
  order: number;
}

interface LifeCycleWithScrollJackProps {
  phases: Phase[];
}

/**
 * Wrapper component that combines ScrollJackHost with LifeCycleVisualization
 * Manages progress state and passes it to the visualization
 */
export default function LifeCycleWithScrollJack({ phases }: LifeCycleWithScrollJackProps) {
  const [progress, setProgress] = useState(0);

  return (
    <ScrollJackHost
      onProgress={setProgress}
      sensitivity={0.5}
      activationThreshold={0.2}
      className="lifecycle-scrolljack-wrapper"
    >
      <div className="visualization-container">
        <LifeCycleVisualization phases={phases} progress={progress} />
      </div>
    </ScrollJackHost>
  );
}
