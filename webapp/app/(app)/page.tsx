import Image from "next/image";
import type { Metadata } from "next";
import EmailSignupForm from "../../components/EmailSignup";

export const metadata: Metadata = {
  title: "Home",
};

export default function Page() {
  return (
    <div className="bg-[url('/landing-page-background.png')] h-screen bg-cover bg-center">
      <div className="flex flex-col h-full justify-center items-center w-full">
        <div className="flex items-center space-x-4">
          <Image src="/union-logo.svg" alt="Union" width={100} height={100} />
          <h1 className="text-4xl">Union</h1>
        </div>
        <p className="font-bold mt-6 mb-10 text-center">Simplify immigration sponsorship through chatlog insights</p>
          <EmailSignupForm />
        <p className='text-center'>
        By continuing you confirm that you agree with out Terms and Conditions
        </p>
    </div>
    </div>
  )
}
