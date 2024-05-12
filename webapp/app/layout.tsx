import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './global.css';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../tailwind.config.cjs';
import { PostHogContext } from 'posthog-js/react';
import { CSPostHogProvider } from 'providers/PostHog';
// import NotificationSender from "components/NotificationSender";
// import { Open_Sans, Roboto_Mono } from 'next/font/google'


const APP_NAME = 'Union';
const APP_DESCRIPTION =
  'Simplify immigration sponsorship through chatlog insights';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: '%s - Union',
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    shortcut: '/favicon.ico',
  },
};

const fullConfig = resolveConfig(tailwindConfig);
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // maximumScale: 1, // this causes a vertical scrollbar to appear
  minimumScale: 1,
  userScalable: false,
  themeColor: fullConfig.theme.colors['red1'],
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col h-screen">
            <CSPostHogProvider>
              <main className="flex grow">{children}</main>
            </CSPostHogProvider>
        </div>
      </body>
    </html>
  );
}
