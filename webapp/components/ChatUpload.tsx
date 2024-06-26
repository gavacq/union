'use client'

import { analyzeChatlog } from "app/(app)/actions"
import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import SubmitButton from "./SubmitButton"
import Image from 'next/image'
import ChatScreenshot from "./ChatScreenshot"
import ChatScreenshotPicker from "./ChatScreenshotPicker"

interface Chatlog {
  name: string
  date: string
  time: number
  message_text: string
}

interface Results {
  data: Array<Array<Chatlog>>
  plots: Array<string>
}

export default function ChatUpload() {
  const [chatlog, setChatlog] = useState<File | null>(null)
  const [results, setResults] = useState<Results | null>(null)
  const [demo, setDemo] = useState(false)

  return results ? (
    <div className="container">
      <p>
        Review the generated chatlog screenshots carefully before downloading them.
      </p>
      <ChatScreenshotPicker data={results.data}/>
      <h2 className="font-bold">Relationship insights found in your chatlogs</h2>
      <div className="grid grid-cols-1 gap-4">
        {results.plots.map((plot, index) => (
          <Image key={index} src={`data:image/png;base64,${plot}`} alt="Plot" width={300} height={300} />
        ))}
      </div>
    </div>
  ):(

    <form action={
      async (formData: FormData) => {
        const results = await analyzeChatlog(formData, demo)
        setResults(results)
      }
    } className="flex flex-col space-y-10 ">
      {/* <input type="file" name="chatlog" placeholder="Upload chatlog" className="rounded-lg h-20 bg-gray1-light placeholder-black border-black border-dotted border-2 px-2" onChange={(e) => setChatlog(e.target.value)}/> */}
        <label className="rounded-lg h-20 bg-gray1 placeholder-black border-dashed border-2 border-green-400 px-2 flex flex-col items-center justify-center cursor-pointer py-6">
          <FontAwesomeIcon icon={faUpload} className="text-green-500 text-2xl"/>
          <span className="text-green-600 mt-2">{chatlog ? chatlog.name : 'Upload WhatsApp Chat (zip)'}</span>
          <input type="file" name="file" placeholder="Upload chat" className="hidden" onChange={(e) => e.target.files && setChatlog(e.target.files[0])} />
          
        </label>

        {/* <input type="file" name="chatlog" placeholder="Upload chatlog" className="rounded h-10 bg-gray1-light placeholder-black border-black border px-2" onChange={(e) => setChatlog(e.target.value)}/> */}
        {/* <button className={`${chatlog ? 'bg-red1':'bg-gray1-dark'} text-black p-2 rounded text-bold border-black`} type="submit" disabled={!chatlog}>Analyze Chat</button> */}

        <SubmitButton input={chatlog || demo} name="Analyze Chat" />
        <label className="flex space-x-2">
          <input type="checkbox" checked={demo} onChange={(e) => setDemo(e.target.checked)} />
          <p>Use demo chatlog</p>
        </label>
      </form>
    
    // add a demo button that will upload a sample chatlog
    
  )
}