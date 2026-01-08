import { motion, useInView } from 'motion/react';
import { useRef, useEffect, useState } from 'react';

function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    // Extract numeric value
    const numericMatch = value.match(/(\d+\.?\d*)/);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const targetValue = parseFloat(numericMatch[1]);
    const hasDecimal = numericMatch[0].includes('.');
    const duration = 2000;
    const steps = 60;
    const stepValue = targetValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(stepValue * step, targetValue);
      
      if (hasDecimal) {
        setDisplayValue(current.toFixed(2));
      } else {
        setDisplayValue(Math.floor(current).toString());
      }

      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(value.replace(/\d+\.?\d*/, numericMatch[0]));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-5xl md:text-6xl lg:text-7xl text-[var(--accent-blue)] font-semibold">
      {displayValue}{suffix}
    </span>
  );
}

export function Metrics() {
  const metrics = [
    {
      value: '20+',
      label: 'Enterprise Workflows',
      sublabel: 'Production systems',
      suffix: ''
    },
    {
      value: '30-60',
      label: 'Day MVPs',
      sublabel: 'Rapid delivery cycles',
      suffix: ''
    },
    {
      value: '99.99%',
      label: 'Uptime',
      sublabel: 'Production reliability',
      suffix: ''
    },
    {
      value: '100%',
      label: 'Client Satisfaction',
      sublabel: 'Ongoing partnerships',
      suffix: ''
    }
  ];

  return (
    <section className="py-[var(--s-7)] bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 xl:px-[120px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              className="text-center"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <motion.div 
                className="mb-2"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                {metric.value.includes('-') ? (
                  <span className="text-5xl md:text-6xl lg:text-7xl text-[var(--accent-blue)] font-semibold">{metric.value}</span>
                ) : (
                  <AnimatedCounter value={metric.value} suffix={metric.suffix} />
                )}
              </motion.div>
              <h4 className="mb-1 text-base">{metric.label}</h4>
              <p className="text-sm text-[var(--neutral-700)]">{metric.sublabel}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
