/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownLeftAndUpRightToCenter } from '@fortawesome/free-solid-svg-icons';

export default function ChatScreenshot({ chatlogs, width = 500, height = 300 }) {
    const canvasRef = useRef(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState<null | string>(null)

    useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current as HTMLCanvasElement; // Add type assertion
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);  // Clear previous drawings
        let yOffset = 20; // Reset yOffset for each render
        chatlogs.forEach((log, index) => {
          const xOffset = index % 2 === 0 ? 10 : width / 2; // Alternate alignment
          ctx.fillStyle = index % 2 === 0 ? '#add8e6' : '#ffb6c1'; // Alternate colors
          ctx.fillText(`${log.name}: ${log.message_text}`, xOffset, yOffset);
          yOffset += 30; // Increase y-offset for the next line
        });
      }
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImageUrl(dataUrl)
    }
    }, [chatlogs, width, height]); // Include missing dependencies in the dependency array

  return (
  <div>
    {imageUrl && (
      <div className="relative">
        <Image src={imageUrl} alt="Chat Screenshot" width={500} height={300} />
        <button 
          className="absolute top-0 right-0 p-1" 
          onClick={() => setModalOpen(true)}
        >
          <FontAwesomeIcon className="text-white" icon={faDownLeftAndUpRightToCenter} />
        </button>
        {isModalOpen && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" 
            onClick={() => setModalOpen(false)}
          >
            <Image src={imageUrl} alt="Chat Screenshot" layout="fill" objectFit="contain" />
          </div>
        )}
      </div>
    )}
    <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
  </div>
  );
}
