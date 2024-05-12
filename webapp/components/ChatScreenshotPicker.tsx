'use client'

import { useState } from "react";
import ChatScreenshot from "./ChatScreenshot"

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



  return (
      <div className="grid grid-cols-2 gap-4">
        {data.map((chatlog, index) => (
          <ChatScreenshot key={index} chatlogs={chatlog} setSelectedChatLogs={setSelectedChatlogs} selectedChatLogs={selectedChatlogs} id={index} />
        ))}
      </div>
  )
}
