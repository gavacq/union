import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
      <div className="grow flex flex-col">
          {children}
      </div>
  );
}
