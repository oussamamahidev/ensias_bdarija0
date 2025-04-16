"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarDays, DollarSign, Search, Star, User } from "lucide-react";
import Link from "next/link";
import { getExperts } from "@/lib/actions/expert.action";

interface ConsultingPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function ConsultingPage({
  searchParams,
}: ConsultingPageProps) {
  const { expertise, q, page, sortBy = "rating" } = await searchParams;
  const currentPage = page ? Number.parseInt(page) : 1;

  const { experts, isNext } = await getExperts({
    expertise: expertise ? [expertise] : undefined,
    searchQuery: q,
    page: currentPage,
    pageSize: 9,
    sortBy,
  });

  const expertiseCategories = [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "MongoDB",
    "GraphQL",
    "AWS",
    "DevOps",
    "UI/UX",
  ];

  const sortOptions = [
    { value: "rating", label: "Highest Rated" },
    { value: "reviewCount", label: "Most Reviews" },
    { value: "consultingRate", label: "Lowest Price" },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Expert Consulting</h1>
        <p className="text-muted-foreground">
          Book one-on-one sessions with verified experts to get personalized
          help with your projects.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <form>
            <Input
              name="q"
              placeholder="Search experts..."
              className="pl-10"
              defaultValue={q}
            />
          </form>
        </div>
        <div className="flex gap-2">
          <select
            className="bg-background border rounded-md px-3 py-2 text-sm"
            defaultValue={sortBy}
            onChange={(e) => {
              const url = new URL(window.location.href);
              url.searchParams.set("sortBy", e.target.value);
              window.location.href = url.toString();
            }}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Link href="/consulting">
          <Badge
            variant={!expertise ? "default" : "outline"}
            className="cursor-pointer"
          >
            All
          </Badge>
        </Link>
        {expertiseCategories.map((category) => (
          <Link key={category} href={`/consulting?expertise=${category}`}>
            <Badge
              variant={expertise === category ? "default" : "outline"}
              className="cursor-pointer"
            >
              {category}
            </Badge>
          </Link>
        ))}
      </div>

      {experts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <User className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No experts found</h2>
          <p className="text-muted-foreground text-center max-w-md">
            We couldn't find any experts matching your search criteria. Try
            adjusting your search or browse all experts.
          </p>
          <Button asChild className="mt-4">
            <Link href="/consulting">View All Experts</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map((expert: any) => (
            <Card
              key={expert._id}
              className="flex flex-col h-full hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center">
                    {expert.user.picture ? (
                      <img
                        src={expert.user.picture || "/placeholder.svg"}
                        alt={expert.user.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-primary-500" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      <Link
                        href={`/consulting/${expert.user._id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {expert.user.name}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">
                        {expert.rating.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        ({expert.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {expert.bio}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {expert.expertise.slice(0, 3).map((skill: string) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                  {expert.expertise.length > 3 && (
                    <Badge variant="outline">
                      +{expert.expertise.length - 3} more
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span className="font-medium">
                    ${expert.consultingRate}/hour
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t">
                <Button asChild className="w-full">
                  <Link href={`/consulting/${expert.user._id}`}>
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Book Session
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-2 mt-8">
        {currentPage > 1 && (
          <Button variant="outline" asChild>
            <Link
              href={`/consulting?${new URLSearchParams({
                ...(expertise ? { expertise } : {}),
                ...(q ? { q } : {}),
                ...(sortBy ? { sortBy } : {}),
                page: (currentPage - 1).toString(),
              })}`}
            >
              Previous
            </Link>
          </Button>
        )}
        {isNext && (
          <Button variant="outline" asChild>
            <Link
              href={`/consulting?${new URLSearchParams({
                ...(expertise ? { expertise } : {}),
                ...(q ? { q } : {}),
                ...(sortBy ? { sortBy } : {}),
                page: (currentPage + 1).toString(),
              })}`}
            >
              Next
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
