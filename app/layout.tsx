import type { Metadata } from "next";
import { Theme } from "@radix-ui/themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Labs",
  description: "Small experiments and interactive demos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Theme accentColor="purple" grayColor="slate" radius="large">
          {children}
        </Theme>
      </body>
    </html>
  );
}
