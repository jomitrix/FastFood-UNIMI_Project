'use client';
import { WaveClean } from "@/components/waves";
import SectionSwitcher from "@/components/app/account/SectionSwitcher";

export default function AccountHeader({accountType, title, subtitle}) {
  return (
    <>
      <div className="w-full bg-[#ff8844] flex flex-col items-center text-center">
        <div className="h-24 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">
                {title}
            </h1>
            { subtitle &&
              <h3 className="text-lg font-medium">
                {subtitle}
              </h3>
            }
        </div>
        <SectionSwitcher 
            accountType={accountType}
        />
      </div>
      <div className="w-full">
        <WaveClean className="h-10 sm:h-20" />
      </div>
    </>
  );
}