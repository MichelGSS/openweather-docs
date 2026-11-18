import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

type RevealProps = {
  children: React.ReactNode;
  /** Delay in ms before the element animates in once visible. */
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
};

/**
 * Fades + slides its children into view when scrolled into the viewport.
 *
 * SSR-safe: before hydration no animation class is applied, so the content is
 * always present in the static HTML (and visible without JS). Respects the
 * user's prefers-reduced-motion setting.
 */
export default function Reveal({ children, delay = 0, className, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px 20px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as as 'div';

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={clsx('reveal', entered && 'reveal--enter', className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
