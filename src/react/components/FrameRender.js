import React, { useEffect, useRef, useState } from 'react';
import { getFrameDimensions } from '../utils/frame';

const FrameRender = ({ payload }) => {

  const frameCanvas = useRef(null);
  const macroBlockCanvas = useRef(null);

  const [frameContext, setFrameContext] = useState(null);
  const [macroBlockContext, setMacroBlockContext] = useState(null);

  useEffect(() => {
    if (frameCanvas.current) {
      setFrameContext(frameCanvas.current.getContext('2d'));
    }
  }, [frameCanvas.current]);

  useEffect(() => {
    if (macroBlockCanvas.current) {
      setMacroBlockContext(macroBlockCanvas.current.getContext('2d'));
    }
  }, [macroBlockCanvas.current]);

  useEffect(() => {
    if (!payload || !frameCanvas || !macroBlockCanvas || !frameContext || !macroBlockContext) {
      return;
    }

    const dimensions = getFrameDimensions(payload.sps);
    if (!dimensions) {
      return;
    }

    const { width, height, widthInMbs, heightInMbs } = dimensions;

    console.log(`Frame Dimensions: ${width}x${height} pixels`);
    console.log(`Frame Dimensions: ${widthInMbs}x${heightInMbs} macroblocks`);

    // Set canvas dimensions
    if (frameCanvas.current) {
      frameCanvas.current.width = width;
      frameCanvas.current.height = height;
    }
    if (macroBlockCanvas.current) {
      macroBlockCanvas.current.width = width;
      macroBlockCanvas.current.height = height;
    }

    macroBlockContext.clearRect(0, 0, macroBlockCanvas.current.width, macroBlockCanvas.current.height);

    for (let y = 0; y < heightInMbs; y++) {
      for (let x = 0; x < widthInMbs; x++) {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        macroBlockContext.fillStyle = `rgba(${r},${g},${b},0.2)`;
        macroBlockContext.fillRect(x * 16, y * 16, 16, 16);
      }
    }

  }, [payload, frameCanvas, macroBlockCanvas, frameContext, macroBlockContext]);

  if (!payload || !payload.header || !payload.sps) {
    return <div>Select a NALU to see the frame.</div>;
  }

  if (payload.header.type !== 1 && payload.header.type !== 5) {
    return <div>Select a coded picture slice to render frame</div>;
  }

  console.log('Found Payload:', payload);

  return (
    <div className="frame-render" style={{ position: 'relative', height: '80vh' }}>
      <canvas id="frame-canvas" ref={frameCanvas} style={{ position: 'absolute', top: 0, left: 0, maxWidth: '100%', maxHeight: '100%' }} />
      <canvas id="macro-block-canvas" ref={macroBlockCanvas} style={{position: 'absolute', top: 0, left: 0, pointerEvents: 'none', maxWidth: '100%', maxHeight: '100%'}} />
    </div>
  );
};

export default FrameRender;
