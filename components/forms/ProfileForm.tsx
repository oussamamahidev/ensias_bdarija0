"use client";

import type React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/user.actions";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

const ProfileSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  portfolioWebsite: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional()
    .or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
});

const ProfileForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const clerkId = user?.id || "";

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user?.firstName || "",
      username: user?.username || "",
      portfolioWebsite:
        (user?.publicMetadata?.portfolioWebsite as string) || "",
      location: (user?.publicMetadata?.location as string) || "",
      bio: (user?.publicMetadata?.bio as string) || "",
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof ProfileSchema>) => {
      setIsSubmitting(true);
      try {
        // Include the profile and cover images in the update data
        await updateUser({
          clerkId,
          updateData: {
            name: values.name,
            username: values.username,
            portfolioWebsite: values.portfolioWebsite,
            location: values.location,
            bio: values.bio,
            // Add the profile image if it exists
            ...(profileImage && { picture: profileImage }),
          },
          path: pathname,
        });

        toast({
          title: "Profile updated successfully",
          description: "Your profile information has been saved.",
          variant: "default",
        });

        router.back();
      } catch (error) {
        console.log(error);
        toast({
          title: "Failed to update profile",
          description:
            "There was an error updating your profile. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [clerkId, pathname, router, toast, profileImage]
  );

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Profile image must be less than 2MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Cover image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCoverImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="portfolioWebsite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://your-portfolio.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-1 lg:col-span-2">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <FormLabel>Profile Image</FormLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
          />
          {profileImage && (
            <Image
              src={profileImage || "/placeholder.svg"}
              alt="Profile Preview"
              width={100}
              height={100}
              className="rounded-full object-cover mt-2"
            />
          )}
        </div>
        <div>
          <FormLabel>Cover Image</FormLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
          />
          {coverImage && (
            <Image
              src={coverImage || "/placeholder.svg"}
              alt="Cover Preview"
              width={200}
              height={100}
              className="object-cover mt-2"
            />
          )}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
