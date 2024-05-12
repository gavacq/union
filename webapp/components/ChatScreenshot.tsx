/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

export default function ChatScreenshot({ chatlogs, width = 500, height = 300 }) {
    const canvasRef = useRef(null);
    // const [isModalOpen, setModalOpen] = useState(false);
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
    }, []); // Redraw when chatlogs or dimensions change

    // const downloadImage = () => {
    //   const canvas = canvasRef.current as unknown as HTMLCanvasElement; // Add type assertion
    //   if (canvas) {
    //     const image = canvas.toDataURL('image/jpeg');
    //     const link = document.createElement('a');
    //     link.href = image;
    //     link.download = 'chat_image.jpg';
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //   }
    // };

    // const toggleModal = () => {
    //   setModalOpen(!isModalOpen);
    // };

    return (
      // <div>
      //   <div style={{ width: '50vw', height: 'auto', position: 'relative', display: 'inline-block' }}>
      //     <canvas ref={canvasRef} width={width} height={height} style={{ width: '100%', height: 'auto', border: '1px solid #ccc' }} />
      //     <button onClick={toggleModal} style={{ position: 'absolute', top: 0, right: 0 }}>
      //       {isModalOpen ? 'Minimize' : 'Maximize'}
      //     </button>
      //   </div>
      //   <Image src={(canvasRef.current as unknown as HTMLCanvasElement)?.toDataURL('image/jpeg')} alt="Chat Image" style={{ maxWidth: '90%', maxHeight: '90%' }} />
      // </div>
    <div>
      {imageUrl && <Image src={imageUrl} alt="Chat Screenshot" width={500} height={300} />}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
    );
}
