import type { Metadata } from "next";
import { Titillium_Web, Public_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/store/cart-context";
import { ResetProvider } from "@/store/reset-context";
import NextUIProvider from "@/store/next-ui-provider";
import MainHeader from "@/components/navigation/main-header";
import Footer from "@/components/footer";
const titillium = Titillium_Web({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700", "900"],
});
import ClientSideRouter from "@/components/ClientSideRouter";
import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Banner from "@/components/navigation/Banner";
import { CSPostHogProvider } from "@/lib/providers/PostHogClientProvider";
import CookieBanner from "@/components/cookie-banner/cookie-banner";

export const metadata: Metadata = {
  title: "CAI - GRUPPO REGIONALE ALTO ADIGE",
  description: "Attività del CAI - GRUPPO REGIONALE ALTO ADIGE",
};

async function getEvents() {
  return directus.request(
    readItems("activities", {
      limit: 2000,
    })
  );
}

async function getAnnouncements() {
  return directus.request(
    readItems("announcements", {
      filter: {
        status: {
          _eq: "published",
        },
      },
    })
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const events = await getEvents();
  const announcements = await getAnnouncements();

  return (
    <html lang="en">
      <CSPostHogProvider>
        <body className={titillium.className}>
          <NextUIProvider>
            <CartProvider>
              <ResetProvider>
                <Banner announcements={announcements} />
                <MainHeader events={events} />
                {children}
              </ResetProvider>
            </CartProvider>
            <Footer />
            <CookieBanner />
          </NextUIProvider>
        </body>
      </CSPostHogProvider>
    </html>
  );
}
