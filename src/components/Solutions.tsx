import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Package, Users, FileEdit, Warehouse, Truck, CreditCard, X } from 'lucide-react';

interface Solution {
  icon: any;
  title: string;
  summary: string;
  details: string;
  outcomes: string[];
}

function SolutionCard({ solution, index, onClick }: { solution: Solution; index: number; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-5deg', '5deg']);

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
    <div className="relative h-full" style={{ perspective: '1000px' }}>
      <motion.div
        ref={ref}
        className="relative p-6 rounded-xl cursor-pointer group overflow-hidden h-full flex flex-col"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4, delay: index * 0.08 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ 
          scale: 1.02,
          z: 20,
        }}
        onClick={onClick}
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
            background: 'linear-gradient(135deg, rgba(62, 106, 225, 0.08), rgba(73, 106, 154, 0.04))',
          }}
          animate={{
            background: [
              'linear-gradient(135deg, rgba(62, 106, 225, 0.08), rgba(73, 106, 154, 0.04))',
              'linear-gradient(225deg, rgba(62, 106, 225, 0.12), rgba(73, 106, 154, 0.06))',
              'linear-gradient(135deg, rgba(62, 106, 225, 0.08), rgba(73, 106, 154, 0.04))',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
          <div className="mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--surface-light)] to-white flex items-center justify-center group-hover:from-[var(--accent-blue)] group-hover:to-[#2E5AD1] transition-all duration-300 shadow-md group-hover:shadow-lg">
              <solution.icon className="text-[var(--accent-slate)] group-hover:text-white transition-colors duration-300" size={20} />
            </div>
          </div>
          
          <h4 className="mb-2 text-base">{solution.title}</h4>
          <p className="text-sm text-[var(--neutral-700)] leading-relaxed flex-grow">
            {solution.summary}
          </p>
          
          <motion.div 
            className="mt-4 text-xs text-[var(--accent-blue)] font-medium flex items-center gap-1"
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            View details
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              →
            </motion.span>
          </motion.div>
        </div>

        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
          style={{
            boxShadow: '0 0 30px rgba(62, 106, 225, 0.25)',
          }}
        />
      </motion.div>
    </div>
  );
}

export function Solutions() {
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);

  const solutions: Solution[] = [
    {
      icon: Package,
      title: 'Supplier Portal',
      summary: 'Streamlined vendor management with automated onboarding, quote requests, performance tracking.',
      details: 'A comprehensive supplier relationship management platform featuring automated vendor onboarding workflows, RFQ management, real-time performance analytics, and integrated communication channels. Built with secure authentication and role-based access control.',
      outcomes: [
        '60% reduction in vendor onboarding time',
        'Centralized communication reducing email by 70%',
        'Real-time performance metrics and compliance tracking'
      ]
    },
    {
      icon: Users,
      title: 'Customer Portal',
      summary: 'Self-service customer interface for orders, invoicing, support tickets, and account management.',
      details: 'Modern customer-facing platform with order tracking, invoice management, support ticket system, and personalized dashboards. Features responsive design, real-time updates, and integration with existing ERP systems.',
      outcomes: [
        '40% reduction in support ticket volume',
        'Improved customer satisfaction scores by 35%',
        '24/7 self-service access to account information'
      ]
    },
    {
      icon: FileEdit,
      title: 'PRC Template Creator',
      summary: 'Dynamic document generation engine for purchase requisitions with approval workflows and templates.',
      details: 'Intelligent document generation system with customizable templates, multi-stage approval workflows, version control, and audit trails. Integrates with procurement systems and supports complex business rules.',
      outcomes: [
        '80% faster document creation process',
        'Consistent compliance with purchasing policies',
        'Complete audit trail for regulatory requirements'
      ]
    },
    {
      icon: Warehouse,
      title: 'Warehouse Management System',
      summary: 'Real-time inventory tracking, picking optimization, and fulfillment automation for distribution centers.',
      details: 'Full-featured WMS with real-time inventory visibility, barcode scanning, automated picking routes, cross-docking capabilities, and integration with shipping carriers. Mobile-first design for warehouse floor operations.',
      outcomes: [
        '45% improvement in picking accuracy',
        '30% increase in throughput capacity',
        'Real-time inventory accuracy above 99%'
      ]
    },
    {
      icon: Truck,
      title: 'Import/Export Workflow',
      summary: 'End-to-end logistics management for international shipments with customs documentation and compliance.',
      details: 'Comprehensive trade management platform handling customs documentation, compliance checks, carrier coordination, and shipment tracking. Automated alerts for regulatory changes and document expiration.',
      outcomes: [
        '50% reduction in customs clearance delays',
        'Automated compliance documentation',
        'Full visibility across international supply chain'
      ]
    },
    {
      icon: CreditCard,
      title: 'Procure-to-Pay',
      summary: 'Integrated procurement platform connecting requisitions, approvals, purchasing, and payment processing.',
      details: 'End-to-end P2P solution with requisition management, three-way matching, automated approval routing, supplier integration, and payment processing. Features spend analytics and contract management.',
      outcomes: [
        '65% faster invoice processing cycle',
        'Improved spend visibility and control',
        '99.5% payment accuracy with automated matching'
      ]
    }
  ];

  return (
    <section id="solutions" className="py-[var(--s-8)] bg-[var(--surface-light)]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 xl:px-[120px]">
        <div className="mb-8 md:mb-12">
          <h2 className="mb-4">Solutions & Implementations</h2>
          <p className="text-base md:text-lg text-[var(--neutral-700)] max-w-2xl">
            Production systems delivering measurable business value
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((solution, index) => (
            <SolutionCard
              key={solution.title}
              solution={solution}
              index={index}
              onClick={() => setSelectedSolution(solution)}
            />
          ))}
        </div>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {selectedSolution && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSolution(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-4 md:p-8 max-w-2xl w-full mx-4 md:mx-auto max-h-[80vh] overflow-y-auto shadow-2xl border border-[var(--neutral-300)]"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--accent-blue)] flex items-center justify-center shadow-md">
                    <selectedSolution.icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-[var(--neutral-900)]">{selectedSolution.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedSolution(null)}
                  className="text-[var(--neutral-700)] hover:text-[var(--neutral-900)] transition-colors p-2 hover:bg-[var(--neutral-300)] rounded min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-[var(--neutral-700)] mb-6 leading-relaxed text-base">
                {selectedSolution.details}
              </p>
              
              <div className="bg-[var(--surface-light)] rounded-xl p-4 md:p-6">
                <h4 className="mb-3 text-base text-[var(--neutral-900)] font-semibold">Key Outcomes</h4>
                <ul className="space-y-3">
                  {selectedSolution.outcomes.map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-[var(--accent-blue)] mt-1 font-bold text-lg">✓</span>
                      <span className="text-[var(--neutral-700)] flex-1">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
