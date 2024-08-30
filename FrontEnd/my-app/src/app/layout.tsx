import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {ThemeProvider} from "@/components/theme-provider";
import "./globals.css";

// import {Manrope} from "next/font/google";
// import {Chivo} from "next/font/google";
// const fontHeading = Manrope({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-heading",
// });

// const fontBody = Manrope({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-body",
// });

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Inventory",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
