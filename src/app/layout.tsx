import type { Metadata } from "next";
import { Titillium_Web, Public_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/store/cart-context";
import { ResetProvider } from "@/store/reset-context";
import NextUIProvider from "@/store/next-ui-provider";
import MainHeader from "@/components/navigation/main-header";
import Footer from "@/components/footer";
const titillium = Titillium_Web({ subsets: ["latin"], weight:["200", "300", "400", "600", "700", "900"] });
import ClientSideRouter from "@/components/ClientSideRouter";

export const metadata: Metadata = {
  title: "CAI - GRUPPO REGIONALE ALTO ADIGE",
  description: "Attività del CAI - GRUPPO REGIONALE ALTO ADIGE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={titillium.className}>
        <NextUIProvider>
          <CartProvider>
            <ResetProvider>
              <ClientSideRouter route={`/news/1`}>
                <div className="py-4 bg-[#0e4d71] relative z-50">
                  <h3 className="text-white text-center md:text-xl px-4">Benvenuti sulla nuova piattaforma del CAI Alto Adige!</h3>
                </div>
              </ClientSideRouter>
               <MainHeader/>
              {children}
            </ResetProvider>
          </CartProvider>
          <Footer/>
        </NextUIProvider>
      </body>
    </html>
  );
}
