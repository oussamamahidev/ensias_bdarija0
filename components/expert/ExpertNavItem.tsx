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

  useEffect(() => {
    const checkExpertStatus = async () => {
      if (!isSignedIn) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/expert/check-status");
        const data = await response.json();
        setExpertStatus(data);
      } catch (error) {
        console.error("Error checking expert status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkExpertStatus();
  }, [isSignedIn]);

  if (isLoading || !isSignedIn || !expertStatus?.isExpert) {
    return null;
  }

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
          <Link href="/expert-dashboard" className="cursor-pointer">
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/expert-dashboard?tab=knowledge-base"
            className="cursor-pointer"
          >
            Knowledge Base
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/expert-dashboard?tab=challenges"
            className="cursor-pointer"
          >
            Code Challenges
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/expert-dashboard?tab=consulting"
            className="cursor-pointer"
          >
            Consulting Calendar
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExpertNavItem;
