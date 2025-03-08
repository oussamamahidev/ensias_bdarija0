"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import React, { useCallback, useState } from 'react'
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ProfileSchema } from "@/lib/validation";
import { updateUser } from "@/lib/actions/user.action";
import { toast } from "../ui/use-toast";

interface Props{

    clerkId: string;
    user: string;
}
const Profile = ({clerkId,user}:Props) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
    const parseUser= JSON.parse(user);

 

    const form = useForm<z.infer<typeof ProfileSchema>>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
          name: parseUser?.name ?? "",
          username: parseUser?.username ?? "",
          portfolioWebsite: parseUser?.portfolioWebsite ?? "",
          location: parseUser?.location ?? "",
          bio: parseUser?.bio ?? "",
        },
      });

      const onSubmit = useCallback(
        async (values: z.infer<typeof ProfileSchema>) => {
          setIsSubmitting(true);
          try {
            await updateUser({
              clerkId,
              updateData: {
                name: values.name,
                username: values.username,
                portfolioWebsite: values.portfolioWebsite,
                location: values.location,
                bio: values.bio,
              },
              path: pathname,
            });
            router.push('/profile');
            toast({
              title: "Update Profile successfully",
              variant: "default",
            });
          } catch (error) {
            console.log(error);
            toast({
              title: "Failed to update profile",
              variant: "destructive",
            });
          } finally {
            setIsSubmitting(false);
          }
        },
        [clerkId, pathname, router]
      );
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-9 flex w-full flex-col gap-9">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your name"
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Username <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your username"
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="portfolioWebsite"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Portfolio Link
              </FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="Your portfolio URL"
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Location
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Where are you from?"
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Bio <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What's special about you?"
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="mt-7 flex justify-end">
          <Button
            type="submit"
            className="primary-gradient w-fit !text-light-900"
            disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default Profile