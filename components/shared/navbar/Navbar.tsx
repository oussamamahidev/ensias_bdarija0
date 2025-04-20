"use client";

import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";
import { SignedIn } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import Theme from "./Theme";
import MobileNav from "./MobileNav";
import GlobalSearch from "../search/GlobalSearch";
import Notifications from "./Notification";
// Import the ExpertNavItem component
import ExpertNavItem from "@/components/expert/ExpertNavItem";

const Navbar = () => {
  return (
    <nav className="fixed z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 overflow-hidden rounded-full bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform duration-300">
            <Image
              src="/assets/images/site-logo.svg"
              width={20}
              height={20}
              alt="Ensias bDarija"
              className="relative z-10"
            />
          </div>
          <p className="font-spaceGrotesk font-bold text-xl text-gray-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
            Ensias<span className="text-primary-500">bDarija</span>
          </p>
        </Link>

        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
          <Suspense
            fallback={
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
            }
          >
            <GlobalSearch />
          </Suspense>
        </div>

        <div className="flex items-center gap-4">
          <Notifications />
          <Theme />
          <SignedIn>
            {/* Expert Nav Item will only show if user is an expert */}
            {/* Add this to your navbar links */}
            <ExpertNavItem />
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox:
                    "h-9 w-9 border-2 border-primary-500/20 hover:border-primary-500 transition-all duration-200",
                },
                variables: {
                  colorPrimary: "#FF7000",
                },
              }}
            />
          </SignedIn>
          <MobileNav />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
