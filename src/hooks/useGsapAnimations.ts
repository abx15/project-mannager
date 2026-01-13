import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function usePageAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate page entrance
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return containerRef;
}

export function useCardAnimation() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll('[data-animate="card"]');
    
    const ctx = gsap.context(() => {
      cards.forEach((card, index) => {
        gsap.from(card, {
          opacity: 0,
          y: 30,
          duration: 0.5,
          delay: index * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });
      });
    }, cardsRef);

    return () => ctx.revert();
  }, []);

  return cardsRef;
}

export function useScrollAnimation(selector: string) {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((element) => {
      gsap.from(element, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [selector]);
}

export function useStaggerAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const items = containerRef.current.querySelectorAll('[data-animate="stagger"]');
    
    const ctx = gsap.context(() => {
      gsap.from(items, {
        opacity: 0,
        y: 20,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return containerRef;
}

export function useCountAnimation(targetValue: number, duration: number = 2) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const obj = { value: 0 };

    gsap.to(obj, {
      value: targetValue,
      duration,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        element.textContent = Math.round(obj.value).toLocaleString();
      },
    });
  }, [targetValue, duration]);

  return ref;
}

// Enhanced hover effect for cards/elements
export function useHoverAnimation() {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    const handleMouseEnter = () => {
      gsap.to(element, {
        scale: 1.02,
        y: -4,
        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        y: 0,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return elementRef;
}

// Parallax scrolling effect
export function useParallaxAnimation(speed: number = 0.5) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    const ctx = gsap.context(() => {
      gsap.to(element, {
        yPercent: -30 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [speed]);

  return elementRef;
}

// Staggered table row animation
export function useTableRowAnimation() {
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tableRef.current) return;

    const rows = tableRef.current.querySelectorAll('[data-animate="table-row"]');
    
    const ctx = gsap.context(() => {
      gsap.from(rows, {
        opacity: 0,
        x: -20,
        stagger: 0.05,
        duration: 0.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: tableRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }, tableRef);

    return () => ctx.revert();
  }, []);

  return tableRef;
}

// Interactive hover for table rows
export function useTableRowHover() {
  const setupRowHover = useCallback((row: HTMLElement) => {
    const handleMouseEnter = () => {
      gsap.to(row, {
        backgroundColor: 'rgba(0, 188, 160, 0.05)',
        x: 4,
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(row, {
        backgroundColor: 'transparent',
        x: 0,
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    row.addEventListener('mouseenter', handleMouseEnter);
    row.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      row.removeEventListener('mouseenter', handleMouseEnter);
      row.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return setupRowHover;
}

// Reveal animation for sections
export function useSectionReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 60,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return sectionRef;
}

// Chart animation
export function useChartAnimation() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(chartRef.current, { opacity: 0, scale: 0.95 });

      // Animate in when scrolled into view
      gsap.to(chartRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: chartRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }, chartRef);

    return () => ctx.revert();
  }, []);

  return chartRef;
}

// Floating animation for decorative elements
export function useFloatingAnimation() {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(elementRef.current, {
        y: -10,
        duration: 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }, elementRef);

    return () => ctx.revert();
  }, []);

  return elementRef;
}

// Button pulse animation
export function useButtonPulse() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;

    const handleMouseEnter = () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    const handleMouseDown = () => {
      gsap.to(button, {
        scale: 0.98,
        duration: 0.1,
      });
    };

    const handleMouseUp = () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.1,
      });
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('mousedown', handleMouseDown);
    button.addEventListener('mouseup', handleMouseUp);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('mousedown', handleMouseDown);
      button.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return buttonRef;
}
