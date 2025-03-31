import Image from "next/image";
import HeroImage from "@/assets/AG_Prato_Piazza.jpeg";

export default function HeroTest() {
    return (
      <div className="w-full min-h-[400px] lg:min-h-[600px] relative isolate overflow-hidden bg-gray-900 pt-12 shadow-xl">
        <div className="absolute inset-0">
          <Image src={HeroImage} alt="Altopiano di Sennes" layout="fill" objectFit="cover" />
        </div>
        <div className="container px-0 absolute bottom-24 z-10 left-1/2 -translate-x-1/2">
          <h1 className="text-3xl lg:text-7xl font-semibold max-w-4xl">
              <span className="bg-[#0e4d71] text-white inline px-4">Scopri le attività</span> 
              <br/>
              <span className="bg-[#0e4d71] text-white inline-block px-4 pb-6 pt-1">delle nostre sezioni</span>
          </h1>
        </div>
      </div>
    )
}
