import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { useRef } from 'react';

interface CapabilityCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  tintColor: string;
  index: number;
}

export function CapabilityCard({ 
  icon: Icon, 
  title, 
  description, 
  tintColor,
  index 
}: CapabilityCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="relative" style={{ perspective: '1000px' }}>
      <motion.div
        ref={ref}
        className="relative p-6 rounded-xl cursor-pointer group overflow-hidden h-full flex flex-col"
        style={{
          backgroundColor: `${tintColor}80`,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ 
        scale: 1.02,
        z: 20,
      }}
    >
      {/* Gradient border effect */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(62, 106, 225, 0.3), rgba(73, 106, 154, 0.2))',
          padding: '1px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(62, 106, 225, 0.1), rgba(73, 106, 154, 0.05))',
        }}
        animate={{
          background: [
            'linear-gradient(135deg, rgba(62, 106, 225, 0.1), rgba(73, 106, 154, 0.05))',
            'linear-gradient(225deg, rgba(62, 106, 225, 0.15), rgba(73, 106, 154, 0.1))',
            'linear-gradient(135deg, rgba(62, 106, 225, 0.1), rgba(73, 106, 154, 0.05))',
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background: 'linear-gradient(110deg, transparent 40%, rgba(255, 255, 255, 0.3) 50%, transparent 60%)',
          backgroundSize: '200% 100%',
        }}
        animate={{
          backgroundPosition: ['200% 0', '-200% 0'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <div className="relative z-10">
        <div className="mb-4">
          <div className="w-12 h-12 rounded-lg bg-white/80 backdrop-blur-sm flex items-center justify-center group-hover:bg-white transition-all duration-300 shadow-lg group-hover:shadow-xl">
            <Icon className="text-[var(--accent-slate)] group-hover:text-[var(--accent-blue)] transition-colors duration-300" size={24} />
          </div>
        </div>
        
        <motion.h4 
          className="mb-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.2 }}
        >
          {title}
        </motion.h4>
        <motion.p 
          className="text-sm text-[var(--neutral-700)] leading-relaxed flex-grow"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.3 }}
        >
          {description}
        </motion.p>
      </div>

      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
        style={{
          boxShadow: '0 0 40px rgba(62, 106, 225, 0.3)',
        }}
      />
      </motion.div>
    </div>
  );
}
