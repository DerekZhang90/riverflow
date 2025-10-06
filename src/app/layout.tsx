import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.jpeg" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SV211BP0EQ"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SV211BP0EQ');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
