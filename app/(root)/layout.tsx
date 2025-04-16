import React from "react"

import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/shared/navbar/Navbar"
import LeftSidebar from "@/components/shared/LeftSidbar"
import RightSidebar from "@/components/shared/RightSiedbar"

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative overflow-x-hidden">
      <Navbar />
      <div className="flex">
        <LeftSidebar />
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14 ml-[266px] xl:mr-[350px] transition-all duration-200">
          <div className="mx-auto w-full max-w-5xl">
            <React.Suspense fallback={<div>Loading...</div>}>{children}</React.Suspense>
          </div>
        </section>
        <RightSidebar />
      </div>
      <Toaster />
    </main>
  )
}

export default Layout

