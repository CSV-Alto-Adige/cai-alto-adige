import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Sponsor from "@/assets/banner-fondazione-cassa-risparmio-bolzano.png";

export default function Footer() {
  return (
    <footer className="" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="flex flex-col justify-center items-center pb-12">
        <Image
          src={Sponsor}
          alt="Fondazione cassa di risparmio di Bolzano"
          className="w-60"
        />
        <p className="text-gray-600 text-sm mt-4 text-center">
          SITO REALIZZATO CON IL CONTRIBUTO DELLA FONDAZIONE CASSA DI RISPARMIO
        </p>
      </div>
      <div className="bg-[#0e4d71]">
        <div className="mx-auto max-w-7xl px-6 pb-8 pt-10 sm:pt-24 lg:px-8 lg:pt-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex flex-col md:flex-row gap-x-6 items-center justify-center text-center lg:text-left">
              <div className="flex items-center gap-x-1">
                <p className="mt-8 leading-5 text-white md:mt-0 font-thin">
                  Tel:
                </p>
                <Link
                  href="tel:0471402144"
                  className="mt-8 leading-5 text-white md:mt-0"
                >
                  0471.402.144
                </Link>
              </div>
              <div className="flex items-center gap-x-1">
                <p className="mt-8 leading-5 text-white md:mt-0 font-thin">
                  Mail:
                </p>
                <Link
                  href="mailto:segreteria@caialtoadige.it"
                  className="mt-8 leading-5 text-white md:mt-0"
                >
                  segreteria@caialtoadige.it
                </Link>
              </div>
              <Link
                href="https://www.cai.it/privacy-policy/"
                className="mt-8 leading-5 text-white md:mt-0"
              >
                Privacy Policy
              </Link>
            </div>
            <p className="mt-8 leading-5 text-white md:mt-0 font-thin text-center text-sm lg:text-left lg:text-base">
              &copy; 2024 CAI -{" "}
              <span className=""> GRUPPO REGIONALE ALTO ADIGE</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
