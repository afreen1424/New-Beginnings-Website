import { useEffect, useRef, useState } from "react";

export default function RevealBlock({ children, direction = "up", delay = 0, testId = "reveal-block" }) {
  const [visible, setVisible] = useState(false);
  const blockRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    if (blockRef.current) observer.observe(blockRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={blockRef}
      className={`reveal-block reveal-${direction} ${visible ? "visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
      data-testid={testId}
    >
      {children}
    </div>
  );
}