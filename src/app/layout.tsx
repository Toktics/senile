import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "S.E.N.I.L.E. Interactive Archive",
  description: "Institutional archive of domestic anomaly containment records.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="appShell">
          <SiteHeader />
          <div className="appContent">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
