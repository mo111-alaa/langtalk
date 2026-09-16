import type { Metadata } from "next";
import "./globals.css";

import { LocalizationProvider } from "@/components/ui/LocalizationProvider";

export const metadata: Metadata = {
  title: "LWA",
description: "Practice languages with real people on LWA",};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta
          name="google-site-verification"
          content="r4hF0pN1a1sbAwI7I2aqz6auibkwdx9sH2rS92op_Og"
        />
      </head>

      <body>
        <LocalizationProvider>
          {children}
        </LocalizationProvider>
      </body>
    </html>
  );
}