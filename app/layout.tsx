import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ui/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata = {
  title: "C3 Chat",
  description: "AI Chat Interface",
  manifest: "/manifest.json", // Added manifest link
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  return (
    <html lang="en">
      {/* Added PWA meta tags */}
      <meta name="application-name" content="NextJS PWA" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="NextJS PWA" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-config" content="/icons/browserconfig.xml" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="theme-color" content="#000000" />

      <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" />
      <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" />

      <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />

      <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#000000" />
      <link rel="shortcut icon" href="/favicon.ico" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:url" content="https://yourdomain.com" />
      <meta name="twitter:title" content="NextJS PWA" />
      <meta name="twitter:description" content="Best NextJS PWA in the world" />
      <meta name="twitter:image" content="https://yourdomain.com/icons/android-chrome-192x192.png" />
      <meta name="twitter:creator" content="@DavidWShadow" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="NextJS PWA" />
      <meta property="og:description" content="Best NextJS PWA in the world" />
      <meta property="og:site_name" content="NextJS PWA" />
      <meta property="og:url" content="https://yourdomain.com" />
      <meta property="og:image" content="https://yourdomain.com/icons/apple-touch-icon.png" />

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider dynamic>
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SidebarProvider defaultOpen={defaultOpen}>
                <SignedIn>
                  {children}
                </SignedIn>
              </SidebarProvider>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </ThemeProvider>
          </ConvexClientProvider>
        </ClerkProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}