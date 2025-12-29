import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface Node {
  id: number;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  layer: number;
  vx: number;
  vy: number;
  glow: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  maxRadius: number;
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scrollY = useMotionValue(0);
  const scrollVelocity = useMotionValue(0);
  
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const smoothScrollY = useSpring(scrollY, { stiffness: 100, damping: 30 });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const ripplesRef = useRef<Ripple[]>([]);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Track scroll position and velocity
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const currentTime = Date.now();
          const timeDelta = currentTime - lastScrollTime.current;
          
          if (timeDelta > 0) {
            const velocity = Math.abs(currentScrollY - lastScrollY.current) / timeDelta * 1000;
            scrollVelocity.set(Math.min(velocity / 10, 1)); // Normalize to 0-1
          }
          
          scrollY.set(currentScrollY);
          lastScrollY.current = currentScrollY;
          lastScrollTime.current = currentTime;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY, scrollVelocity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Generate more nodes across three layers (60-80 particles)
    const nodeCount = Math.floor(Math.random() * 21) + 60; // 60-80
    const generatedNodes: Node[] = [];
    
    for (let i = 0; i < nodeCount; i++) {
      const x = Math.random() * canvas.offsetWidth;
      const y = Math.random() * canvas.offsetHeight;
      const layer = Math.floor(Math.random() * 3); // 0: bg, 1: mid, 2: fg
      
      generatedNodes.push({
        id: i,
        x,
        y,
        baseX: x,
        baseY: y,
        layer,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        glow: 0
      });
    }
    
    setNodes(generatedNodes);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const unsubscribeX = smoothMouseX.on('change', () => draw());
    const unsubscribeY = smoothMouseY.on('change', () => draw());
    const unsubscribeScroll = smoothScrollY.on('change', () => draw());
    const unsubscribeVelocity = scrollVelocity.on('change', () => draw());

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      const currentMouseX = smoothMouseX.get();
      const currentMouseY = smoothMouseY.get();
      const currentScrollY = smoothScrollY.get();
      const currentVelocity = scrollVelocity.get();
      
      // Update ripples
      ripplesRef.current = ripplesRef.current.filter(ripple => {
        ripple.radius += 2;
        ripple.opacity = Math.max(0, ripple.opacity - 0.02);
        return ripple.radius < ripple.maxRadius && ripple.opacity > 0;
      });
      
      // Draw ripples
      ripplesRef.current.forEach(ripple => {
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(62, 106, 225, ${ripple.opacity * 0.3})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
      
      // Update and draw nodes
      nodes.forEach((node) => {
        // Layer-based parallax multipliers
        const layerMultipliers = [0.15, 0.5, 1.0]; // bg, mid, fg
        const multiplier = layerMultipliers[node.layer];
        
        // Scroll-based parallax (particles move based on scroll)
        const scrollParallax = currentScrollY * multiplier * 0.1;
        
        // Scroll velocity effect (particles react to scroll speed)
        const velocityEffect = currentVelocity * multiplier * 5;
        
        // Idle drift with velocity influence
        const driftX = Math.sin(time * 0.0008 + node.id) * (0.8 + velocityEffect);
        const driftY = Math.cos(time * 0.0006 + node.id) * (0.8 + velocityEffect);
        
        // Mouse parallax offset
        const parallaxX = (currentMouseX - canvas.offsetWidth / 2) * multiplier * 0.02;
        const parallaxY = (currentMouseY - canvas.offsetHeight / 2) * multiplier * 0.02;
        
        // Update position
        node.x = node.baseX + parallaxX + driftX - scrollParallax * 0.1;
        node.y = node.baseY + parallaxY + driftY;
        
        // Distance to mouse for hover effect
        const dx = currentMouseX - node.x;
        const dy = currentMouseY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const hoverThreshold = 100;
        
        // Magnetic effect - particles slightly attract to cursor
        if (distance < hoverThreshold && distance > 0) {
          const force = (1 - distance / hoverThreshold) * 0.3;
          node.x += (dx / distance) * force;
          node.y += (dy / distance) * force;
        }
        
        // Update glow based on hover
        if (distance < hoverThreshold) {
          node.glow = Math.min(1, node.glow + 0.1);
        } else {
          node.glow = Math.max(0, node.glow - 0.05);
        }
        
        let radius = 3 + node.layer * 0.8;
        let opacity = 0.15 + node.layer * 0.08;
        
        if (distance < hoverThreshold) {
          const hoverFactor = 1 - (distance / hoverThreshold);
          radius = radius + hoverFactor * 4;
          opacity = opacity + hoverFactor * 0.25;
        }
        
        // Draw glow effect
        if (node.glow > 0) {
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 4);
          gradient.addColorStop(0, `rgba(62, 106, 225, ${node.glow * 0.4})`);
          gradient.addColorStop(0.5, `rgba(62, 106, 225, ${node.glow * 0.15})`);
          gradient.addColorStop(1, 'rgba(62, 106, 225, 0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(node.x - radius * 4, node.y - radius * 4, radius * 8, radius * 8);
        }
        
        // Draw node with glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(62, 106, 225, ${opacity + node.glow * 0.2})`;
        ctx.fill();
        
        // Add inner highlight for more visibility
        if (radius > 2) {
          const highlightGradient = ctx.createRadialGradient(
            node.x - radius * 0.3, node.y - radius * 0.3, 0,
            node.x, node.y, radius
          );
          highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.5})`);
          highlightGradient.addColorStop(1, 'rgba(62, 106, 225, 0)');
          ctx.fillStyle = highlightGradient;
          ctx.fill();
        }
      });
      
      // Draw connections between nearby nodes (dynamic distance based on scroll)
      const baseConnectionDistance = 150;
      const scrollConnectionBoost = currentVelocity * 50;
      const connectionDistance = baseConnectionDistance + scrollConnectionBoost;
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < connectionDistance) {
            const connectionStrength = 1 - (distance / connectionDistance);
            const opacity = connectionStrength * 0.2;
            
            // Create gradient for connection
            const gradient = ctx.createLinearGradient(
              nodes[i].x, nodes[i].y,
              nodes[j].x, nodes[j].y
            );
            gradient.addColorStop(0, `rgba(62, 106, 225, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(73, 106, 154, ${opacity * 0.9})`);
            gradient.addColorStop(1, `rgba(62, 106, 225, ${opacity})`);
            
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1 + connectionStrength * 0.8;
            ctx.stroke();
          }
        }
      }
      
      time += 16; // Approximate frame time
    };

    const animate = () => {
      draw();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      unsubscribeX();
      unsubscribeY();
      unsubscribeScroll();
      unsubscribeVelocity();
    };
  }, [nodes, smoothMouseX, smoothMouseY, smoothScrollY, scrollVelocity, prefersReducedMotion]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Only update if mouse is within container bounds
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouseX.set(x);
        mouseY.set(y);
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const handleClick = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      
      // Check if click target is an interactive element (button, link, etc.)
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]')
      ) {
        // Let the click pass through to the interactive element
        return;
      }
      
      const rect = container.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      // Only create ripple if clicking within the container bounds
      if (
        clickX < 0 || clickX > rect.width ||
        clickY < 0 || clickY > rect.height
      ) {
        return;
      }
      
      // Create ripple effect
      ripplesRef.current.push({
        x: clickX,
        y: clickY,
        radius: 0,
        opacity: 1,
        maxRadius: 200
      });
      
      // Create particle cluster effect - attract nearby nodes
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      setNodes(prevNodes => prevNodes.map(node => {
        const dx = clickX - node.x;
        const dy = clickY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          // Push particles away from click point
          const force = (1 - distance / 150) * 20;
          return {
            ...node,
            baseX: node.baseX + (dx / distance) * force,
            baseY: node.baseY + (dy / distance) * force,
            vx: (dx / distance) * 0.5,
            vy: (dy / distance) * 0.5
          };
        }
        return node;
      }));
    };
    
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [prefersReducedMotion]);

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      />
    </motion.div>
  );
}
