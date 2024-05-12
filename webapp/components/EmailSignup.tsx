'use client'
import { useState } from "react";
import { saveEmail } from "../app/(app)/actions";

export default function EmailSignupForm() {
  const [email, setEmail] = useState('');

  return (
    <form action={saveEmail} className="flex flex-col space-y-4 ">
      <input type="email" name="email" placeholder="Enter your email" className="rounded h-10 bg-gray1-light placeholder-black border-black border px-2" onChange={(e) => setEmail(e.target.value)}/>
      <button className={`${email ? 'bg-red1':'bg-gray1-dark'} text-black p-2 rounded text-bold border-black`} type="submit" disabled={!email}>Get Started</button>
    </form>
  );
}

