import React, { useState, useEffect } from 'react';

export default function DragHint() {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="hint" className={fadeOut ? 'fade-out' : ''}>
      Drag to explore →
    </div>
  );
}
