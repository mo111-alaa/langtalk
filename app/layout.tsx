import type { Metadata } from "next";
import "./globals.css";

// استخدام المسار المباشر بـ @ بعد ضبط tsconfig.json
import { LocalizationProvider } from "@/components/ui/LocalizationProvider";

export const metadata: Metadata = {
  title: "LangTalk",
  description: "Practice languages with real people",
  verification: {
    google: "r4hF0pN1a1sbAwI7I2aqz6auibkwdx9sH2rS92op_Og",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <LocalizationProvider>
          {children}
        </LocalizationProvider>
      </body>
    </html>
  );
}