/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownLeftAndUpRightToCenter } from '@fortawesome/free-solid-svg-icons';
import { faCircle as faFullCircle } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';


export default function ChatScreenshot({ id, chatlogs, setSelectedChatLogs, selectedChatLogs, width = 370, height = 650 }) {
    const canvasRef = useRef(null);
    const [imageUrl, setImageUrl] = useState<null | string>(null)
    const [isModalOpen, setModalOpen] = useState(false);

    const getLeftAndRightUsers = (chatlogs) => {
        // Get the first two unique users in the chatlogs
        const users = chatlogs.reduce((acc, log) => {
            if (acc.length === 2) return acc;
            if (!acc.includes(log.name)) {
                acc.push(log.name);
            }
            return acc;
        }
        , []);

        return {
          leftUser: users[0],
          rightUser: users[1]
        }
    }

    useEffect(() => {
      if (canvasRef.current) {
        const canvas = canvasRef.current as HTMLCanvasElement; // Add type assertion
        canvas.width = width; // Ensure the canvas width is set correctly
        canvas.height = height; // Ensure the canvas height is set correctly
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, width, height); // Clear previous drawings
            let yOffset = 20; // Starting y-offset for the first message

            const maxBubbleWidth = width / 2; // Maximum bubble width is half the canvas width
            const lineHeight = 20; // Line height for text wrapping
            const padding = 5; // Padding inside the bubble
            const borderRadius = 10; // Border radius for rounded rectangles

            const { leftUser, rightUser } = getLeftAndRightUsers(chatlogs);
            ctx.fillStyle = '#070711'; // Change '#ffffff' to any desired color
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // TODO: handle consecutive messages from the same user
               chatlogs.forEach((log, index) => {
            const { maxWidth: maxLineWidth, lines } = wrapText(ctx, log.message_text, maxBubbleWidth - 2 * padding);

            const bubbleHeight = lines.length * lineHeight + 2 * padding;
            const bubbleWidth = maxLineWidth + 2 * padding;
            const xOffset = log.name === leftUser ? 10 : width - bubbleWidth;
            const nameHeight = lineHeight; // Height for the name text

            // Draw the user's name above the bubble
            ctx.fillStyle = '#ffffff'; // Text color for the name
            ctx.fillText(`${log.name}, ${log.date} - ${log.time}`, xOffset, yOffset);

            yOffset += 10; // Move down to draw the bubble

            // Draw rounded rectangle for the message bubble
            ctx.fillStyle = log.name === leftUser ? '#334956' : '#015d48'; 
            roundRect(ctx, xOffset, yOffset, bubbleWidth, bubbleHeight, borderRadius, true, false);

            // Draw text inside the bubble
            ctx.fillStyle = '#ffffff'; // Text color for the message
            lines.forEach((line, lineIndex) => {
              ctx.fillText(line, xOffset + padding, yOffset + padding + lineHeight * (lineIndex + 1));
            });

            yOffset += bubbleHeight + 10; // Increase y-offset for the next name and bubble
          });

          const dataUrl = canvas.toDataURL('image/jpeg');
          setImageUrl(dataUrl);
          setSelectedChatLogs(prev => ({ ...prev, [id]: dataUrl }));
        }
      }
    }, [chatlogs, width, height, setImageUrl, setSelectedChatLogs, id]);

    function wrapText(context, text, maxWidth) {
        const words = text.split(' ');
        const lines: Array<string> = [];
        let currentLine = words[0];
        let currentMaxWidth = context.measureText(currentLine).width;

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = context.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
            currentMaxWidth = Math.max(currentMaxWidth, context.measureText(currentLine).width);
        }
        lines.push(currentLine);
        return {
          lines,
          maxWidth: currentMaxWidth
        };
    }

    // Function to draw a rounded rectangle
    function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke === 'undefined') {
            stroke = true;
        }
        if (typeof radius === 'undefined') {
            radius = 5;
        }
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }
    }

    const toggleSelection = () => {
      if (isModalOpen) return;
      if (selectedChatLogs[id]) {
        const { [id]: removed, ...rest } = selectedChatLogs;
        setSelectedChatLogs(rest);
      } else {
        setSelectedChatLogs(prev => ({ ...prev, [id]: imageUrl }));
      }
    };

return (
  <div>
    {imageUrl && (
      <div 
        className={`relative border-2 ${selectedChatLogs[id] ? 'border-red-500' : 'border-transparent'}`}
        onClick={toggleSelection}
      >
        <Image src={imageUrl} alt="Chat Screenshot" width={370} height={650} />
        <button 
          className="absolute top-0 right-0 p-1" 
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setModalOpen(true);
          }}
        >
          <FontAwesomeIcon className="text-white" icon={faDownLeftAndUpRightToCenter} />
        </button>
          <FontAwesomeIcon className="text-red1 absolute top-0 left-0 p-1" icon={selectedChatLogs[id] ? faFullCircle : faCircle} />
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
  // return (
  //   <div>
  //     {imageUrl && (
  //       <div 
  //         className={`relative border-2 ${selectedChatLogs[id] ? 'border-red-500' : 'border-transparent'}`}
  //         onClick={toggleSelection}
  //         style={{
  //           width: '50%', // Adjusts width for side-by-side previews
  //           height: '100%', // Adjust height as necessary
  //           overflow: 'hidden' // Hides the overflow
  //         }}
  //       >
  //         <Image src={imageUrl} alt="Chat Screenshot" width={370} height={650} />
  //         <button 
  //           className="absolute top-0 right-0 p-1" 
  //           onClick={(e) => {
  //             e.stopPropagation();
  //             e.preventDefault();
  //             setModalOpen(true);
  //           }}
  //         >
  //           <FontAwesomeIcon className="text-white" icon={faDownLeftAndUpRightToCenter} />
  //         </button>
  //           <FontAwesomeIcon className="text-red1 absolute top-0 left-0 p-1" icon={selectedChatLogs[id] ? faFullCircle : faCircle} />
  //         {isModalOpen && (
  //           <div 
  //             className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" 
  //             onClick={() => setModalOpen(false)}
  //           >
  //            <Image src={imageUrl} alt="Chat Screenshot" layout="fill" objectFit="contain" />
  //           </div>
  //         )}
  //       </div>
  //     )}
  //     <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
  //   </div>
  // );
}
