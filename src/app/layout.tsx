import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Header from "@/components/Header";
import "./globals.css";
import UpdateUserStatus from "@/services/UpdateUserStatus";

const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });

export const metadata: Metadata = 
{
  title: "Convex Chat",
  description: "Chat app created in nextjs using convex",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) 
{
  // const user = await currentUser();
  // const userId = user?.id;

  // setInterval(async () => await UpdateUserStatus(userId!), 3000);

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.variable} antialiased`}>
          <ConvexClientProvider>
            <Header/>
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
