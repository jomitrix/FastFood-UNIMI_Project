"use client";
import { WaveClean } from "@/components/waves";
import SimpleNavbar from '@/components/app/SimpleNavbar';

export default function CustomError() {
  return (
    <>
      <SimpleNavbar />
      
      <div className="w-full flex flex-col min-h-screen bg-[#f5f3f5]">
        <div className="w-full bg-[#ff8844] flex items-center justify-center pb-5 md:pb-0 lg:pb-10">
          <div className="w-full flex flex-col md:flex-row text-center md:text-left items-center lg:w-3/5 p-5 lg:p-0 gap-10">
            <img src="/images/500.png" alt="Burger" className="w-[50%] md:w-1/2" />
            <div className="flex flex-col w-[75%] md:w-1/2 -mt-8 md:mt-0 md:w-1/2 gap-2 md:gap-3 lg:gap-5 items-center md:items-start ">
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
                500 - Something went wrong!
              </h1>
              <h3 className="text-xl md:text:3xl lg:text-4xl">
                Try again
              </h3>
            </div>
          </div>
        </div>
        <div className="w-full">
          <WaveClean className="h-10 sm:h-20" />
        </div>
      </div>
    </>
  );
}