import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Choco Pie OS Web UI",
  description: "A browser-based Choco Pie desktop recreation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var theme = localStorage.getItem('desktop-theme') || localStorage.getItem('pi-site-theme') || 'light';
                  if (theme === 'light' || theme === 'dark') {
                    document.documentElement.setAttribute('data-os-theme', theme);
                  }
                } catch (error) {}
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
