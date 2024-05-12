'use client'
import { useState } from "react";
import { saveEmail } from "../app/(app)/actions";
import SubmitButton from "./SubmitButton";

export default function EmailSignupForm() {
  const [email, setEmail] = useState('');

  return (
    <form action={saveEmail} className="flex flex-col space-y-4 ">
      <input type="email" name="email" placeholder="Enter your email" className="rounded h-10 bg-gray1-light placeholder-black border-black border px-2" onChange={(e) => setEmail(e.target.value)}/>
      <SubmitButton input={email} name="Get Started" />
    </form>
  );
}

