"use client";

import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { UserContextProvider } from "@/app/contexts/UserContext";
import { RefetchContextProvider } from "@/app/contexts/RefetchContext";

export default function RootLayout({ children }) {
  return (
    <UserContextProvider>
      <RefetchContextProvider>
        <html lang="en">
          <body>
            <Navbar />
            <div className="main-container">{children}</div>
            <Footer />
          </body>
        </html>
      </RefetchContextProvider>
    </UserContextProvider>
  );
}
