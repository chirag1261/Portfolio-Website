"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const DESKTOP_BREAKPOINT = 1024;

export function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    // Wait a frame so sections are rendered and measured
    const rafId = requestAnimationFrame(() => {
      const panels = gsap.utils.toArray<HTMLElement>(
        wrapper.querySelectorAll(":scope > *"),
      );
      if (panels.length === 0) return;

      // Calculate total scroll width (scrollWidth includes gaps)
      const scrollDistance = wrapper.scrollWidth - window.innerWidth;

      if (scrollDistance <= 0) return;

      const tween = gsap.to(wrapper, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          end: () => `+=${scrollDistance}`,
          invalidateOnRefresh: true,
        },
      });

      // Refresh after a slight delay so all DOM is settled
      ScrollTrigger.refresh();

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => {
      cancelAnimationFrame(rafId);
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === container) t.kill();
      });
    };
  }, [isDesktop]);

  // Mobile: render children in normal vertical flow
  if (!isDesktop) {
    return <>{children}</>;
  }

  // Desktop: horizontal scroll
  return (
    <div
      ref={containerRef}
      data-horizontal-scroll
      className="relative overflow-hidden"
    >
      <div
        ref={wrapperRef}
        data-horizontal-wrapper
        className="flex flex-nowrap will-change-transform"
        style={{ width: "max-content" }}
      >
        {children}
      </div>
    </div>
  );
}
