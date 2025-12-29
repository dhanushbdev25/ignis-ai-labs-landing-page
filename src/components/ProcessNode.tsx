import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface ProcessNodeProps {
  icon: LucideIcon;
  title: string;
  description: string;
  details: string[];
  index: number;
  isLast?: boolean;
}

export function ProcessNode({ 
  icon: Icon, 
  title, 
  description, 
  details,
  index,
  isLast = false 
}: ProcessNodeProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-center relative group">
      {/* Node Circle */}
      <motion.div
        className="relative z-10 mb-4"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
      >
        <motion.div
          className="w-14 h-14 rounded-full border-2 border-[var(--accent-blue)] bg-white flex items-center justify-center cursor-pointer shadow-md"
          whileHover={{ 
            y: -4, 
            scale: 1.05,
            boxShadow: 'var(--shadow-lifted)'
          }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="text-[var(--accent-blue)]" size={24} />
        </motion.div>

        {/* Connector Line Highlight */}
        {!isLast && (
          <motion.div
            className="absolute top-1/2 left-full w-full h-0.5 bg-[var(--accent-blue)] origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ transform: 'translateY(-50%)' }}
          />
        )}
      </motion.div>

      {/* Content */}
      <div className="text-center max-w-[200px]">
        <h4 className="mb-2 text-base">{title}</h4>
        <p className="text-sm text-[var(--neutral-700)] mb-2">
          {description}
        </p>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute top-full mt-4 bg-white border border-[var(--neutral-300)] rounded-lg p-4 shadow-lg z-20 w-64"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.16 }}
          >
            <ul className="space-y-2 text-sm text-[var(--neutral-700)]">
              {details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[var(--accent-blue)] mt-1">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
