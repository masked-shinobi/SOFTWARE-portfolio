import React, { useRef } from 'react';
import useDraggableSticker from '../hooks/useDraggableSticker';

export default function FloatingSticker({ id, src, alt, style, imgStyle }) {
  const stickerRef = useRef(null);
  useDraggableSticker(stickerRef);

  return (
    <div
      id={`${id}-container`}
      className="draggable-sticker-container"
      ref={stickerRef}
      style={style}
    >
      <img
        src={src}
        id={id}
        className="floating-sticker"
        alt={alt}
        style={imgStyle}
      />
    </div>
  );
}
