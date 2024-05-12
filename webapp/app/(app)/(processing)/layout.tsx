import Image from "next/image";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
      <div className="grow flex flex-col">
        <div className="flex mt-4 ml-5 items-center">
          <Image src="/union-logo.svg" alt="Union" width={50} height={50} />
          <span className="font-bold ml-2">
            Union
          </span>
        </div>
          {children}
      </div>
  );
}
