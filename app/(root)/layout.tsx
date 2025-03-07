import Navbar from '@/components/shared/navbar/Navbar'
import React, { Suspense } from 'react'
import LeftSidbar from '@/components/shared/LeftSidbar'
import RightSiedbar from '@/components/shared/RightSiedbar'
import { Toaster } from '@/components/ui/toaster'


const Layout = ({children}: {children: React. ReactNode}) => {
  return (
    <div>
        <main className="background-light850_dark100 relative">
            <Navbar />
            <div className="flex">
                <LeftSidbar />
                
                <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">

                    <div className="mx-auto w-full max-w-5xl">
                    <Suspense>{children}</Suspense>
                    </div>
                </section> 
                <RightSiedbar />
                </div>
                <Toaster />
        </main>
    </div>
  )
}

export default Layout