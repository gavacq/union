'use client'

import { use, useState } from "react";
import ChatScreenshot from "./ChatScreenshot"
import JSZip from 'jszip';


interface ChatlogToDownload {
  [key: string]: string
}

export default function ChatScreenshotPicker({data}) {
  // TODO:
  // handle chatlog deselection here
  // each chatlog should have a checkbox to select/deselect. Initial state is selected
  // maintain an object of selected chatlogs
  // key: chatlog name, value: chatlog data (image)
  const [selectedChatlogs, setSelectedChatlogs] = useState<ChatlogToDownload>({})

  // when a chatlog is deselected, remove it from the list
  // when a chatlog is selected, add it to the list
  // when download button is clicked, download all selected chatlogs
  // Function to download all selected chatlogs
  const downloadSelectedChatlogsAsZip = () => {
      const zip = new JSZip();

      Object.entries(selectedChatlogs).forEach(([key, dataUrl]) => {
              // Add image to zip
              // Assuming the data URL does not have the prefix `data:image/jpeg;base64,`, you would need to handle it if present.
              const imgData = dataUrl.split('base64,')[1]; // Split to remove the Data URL prefix if present
              zip.file(`chatlog-${key}.jpg`, imgData, {base64: true});
      });

      // Generate zip file and trigger download
      zip.generateAsync({type:"blob"}).then(function(content) {
          const url = URL.createObjectURL(content);
          const link = document.createElement('a');
          link.href = url;
          link.download = "chatlogs.zip";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);  // Clean up the URL object
      });
  };

  const disabled = Object.keys(selectedChatlogs).length === 0;



  return (
    <div className="flex flex-col items-center py-10">
      <div className="grid grid-cols-2 gap-4">
        {data.map((chatlog, index) => (
          <ChatScreenshot key={index} chatlogs={chatlog} setSelectedChatLogs={setSelectedChatlogs} selectedChatLogs={selectedChatlogs} id={index} />
        ))}
      </div>
        <button onClick={downloadSelectedChatlogsAsZip} className={`${!disabled ? 'bg-red1':'bg-gray1-dark'} text-black p-2  mt-6 rounded text-bold border-black`} type="submit" disabled={disabled}>Download Screenshots</button>
      </div>
  )
}
