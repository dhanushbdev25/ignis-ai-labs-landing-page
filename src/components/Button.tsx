import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
  className?: string;
}

export function Button({ 
  variant = 'primary', 
  children, 
  onClick, 
  icon: Icon,
  className = '' 
}: ButtonProps) {
  const baseStyles = "h-10 px-8 rounded-lg transition-all duration-200 flex items-center gap-2 justify-center cursor-pointer";
  
  const variants = {
    primary: "bg-[var(--accent-blue)] text-white hover:bg-[#2E5AD1] shadow-sm",
    secondary: "border border-[var(--accent-blue)] text-[var(--accent-blue)] bg-transparent hover:bg-[rgba(62,106,225,0.06)]"
  };

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      whileHover={{ y: -4, boxShadow: 'var(--shadow-lifted)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {Icon && <Icon size={18} />}
      <span>{children}</span>
    </motion.button>
  );
}
