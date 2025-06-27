'use client';
import { WaveClean } from "@/components/waves";
import SectionSwitcher from "@/components/app/account/SectionSwitcher";

export default function AccountHeader({accountType, title, subtitle}) {
  return (
    <>
      <div className="w-full bg-[#ff8844] flex flex-col items-center text-center">
        <div className="h-24 flex flex-col items-center justify-center">
            <h1 className="text-3xl sm:text-4xl font-bold">
                {title}
            </h1>
            { subtitle &&
              <h3 className="text-md sm:text-lg font-medium">
                {subtitle}
              </h3>
            }
        </div>
        { accountType === "user" &&
          <SectionSwitcher />
        }
      </div>
      <div className="w-full">
        <WaveClean className="h-10 sm:h-20" />
      </div>
    </>
  );
}