"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Award, ChevronDown } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@clerk/nextjs";

interface ExpertStatus {
  isExpert: boolean;
  isVerified: boolean;
  expertise?: string[];
  consultingRate?: number;
  rating?: number;
  reviewCount?: number;
}

const ExpertNavItem = () => {
  const { isSignedIn } = useAuth();
  const [expertStatus, setExpertStatus] = useState<ExpertStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Award className="h-4 w-4 text-primary-500" />
          Expert
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Expert Tools</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/expert" className="cursor-pointer">
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/expert?tab=knowledge-base" className="cursor-pointer">
            Knowledge Base
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/expert?tab=challenges" className="cursor-pointer">
            Code Challenges
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/expert?tab=consulting" className="cursor-pointer">
            Consulting Calendar
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExpertNavItem;
