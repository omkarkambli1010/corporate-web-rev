
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

import BootstrapClient from "@/components/common/BootstrapClient/BootstrapClient";
import GoogleTagManager from "@/components/common/GoogleTagManager/GoogleTagManager";
import Loader from "@/components/common/Loader/Loader";
import LoaderRegistration from "@/components/common/Loader/LoaderRegistration";
import ToastContainer from "@/components/common/ToastContainer/ToastContainer";

import { appConfig } from "@/config/app.config";

import { AccessibilityProvider } from "@/context/AccessibilityContext";
import { LoaderProvider } from "@/context/LoaderContext";
import { ToastProvider } from "@/context/ToastContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.scss";
/* The --sb-* design tokens (light and dark) for every route — the header and
   footer read them too. The file holds only :root tokens and .sb-scope rules. */
import "@/components/home/sbi-home.scss";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(appConfig.siteUrl),

  applicationName: "SBI Securities",

  title: {
    default:
      "SBI Securities | Trading and Investment Services",
    template: "%s | SBI Securities",
  },

  description: "Explore trading, investment products, financial calculators, market insights and investor services with SBI Securities.",

  keywords: [
    "SBI Securities",
    "stock trading",
    "online trading",
    "Demat account",
    "investment products",
    "financial calculators",
    "market insights",
  ],

  authors: [
    {
      name: "SBI Securities",
    },
  ],

  creator: "SBI Securities",
  publisher: "SBI Securities",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "SBI Securities",
    title:
      "SBI Securities | Trading and Investment Services",
    description:
      "Explore trading, investment products, financial calculators, market insights and investor services with SBI Securities.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      data-theme="light"
      data-bs-theme="light"
      suppressHydrationWarning
    >
      <head>
        {/* Applies the saved accessibility theme and font size before first
            paint, so a dark-theme visitor never sees the page flash light.
            Keys match STORAGE_KEYS in src/context/AccessibilityContext.tsx. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement,t=localStorage.getItem("sbisecurities-theme");if(t==="dark"||t==="light"){d.setAttribute("data-theme",t);d.setAttribute("data-bs-theme",t)}var f=Number(localStorage.getItem("sbisecurities-font-size"));if(f>=14&&f<=22)d.style.setProperty("--font-size-base",f+"px")}catch(e){}})()`,
          }}
        />
      </head>
      <body className={openSans.variable}>
        <GoogleTagManager />
        <AccessibilityProvider>


          <LoaderProvider>
            <ToastProvider>
              <ToastContainer />
              <BootstrapClient />

              <a href="#main-content" className="skip-link">
                Skip to main content
              </a>
              <LoaderRegistration />
              <Loader />

              {children}

            </ToastProvider>
          </LoaderProvider>

        </AccessibilityProvider>
      </body>
    </html>
  );
}