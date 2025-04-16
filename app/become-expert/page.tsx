"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Award, Check, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  bio: z.string().min(50, {
    message: "Bio must be at least 50 characters.",
  }),
  consultingRate: z.number().min(0, {
    message: "Consulting rate must be a positive number.",
  }),
  expertise: z.array(z.string()).min(1, {
    message: "You must select at least one area of expertise.",
  }),
});

export default function BecomeExpertPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isSignedIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newExpertise, setNewExpertise] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: "",
      consultingRate: 0,
      expertise: [],
    },
  });

  const { expertise } = form.watch();

  const addExpertise = () => {
    if (newExpertise && !expertise.includes(newExpertise)) {
      form.setValue("expertise", [...expertise, newExpertise]);
      setNewExpertise("");
    }
  };

  const removeExpertise = (item: string) => {
    form.setValue(
      "expertise",
      expertise.filter((i) => i !== item)
    );
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isSignedIn) {
      toast({
        title: "Not signed in",
        description: "You must be signed in to become an expert.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/expert/become-expert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast({
        title: "Application submitted!",
        description: "Your expert application has been submitted for review.",
      });

      router.push("/");
    } catch (error) {
      console.error("Error submitting expert application:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit application",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Award className="h-6 w-6 text-primary-500" />
              Become an Expert
            </CardTitle>
            <CardDescription>
              You must be signed in to apply as an expert.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Award className="h-6 w-6 text-primary-500" />
            Become an Expert
          </CardTitle>
          <CardDescription>
            Share your knowledge and expertise with the community. Experts can
            create knowledge base articles, code challenges, and offer paid
            consulting sessions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your professional background, experience, and areas of expertise..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be displayed on your expert profile. Highlight
                      your experience and skills.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expertise"
                render={() => (
                  <FormItem>
                    <FormLabel>Areas of Expertise</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {expertise.map((item) => (
                        <Badge
                          key={item}
                          variant="secondary"
                          className="px-3 py-1"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => removeExpertise(item)}
                            className="ml-2 text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add an area of expertise"
                        value={newExpertise}
                        onChange={(e) => setNewExpertise(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addExpertise())
                        }
                      />
                      <Button
                        type="button"
                        onClick={addExpertise}
                        variant="outline"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription>
                      Add technologies, frameworks, or domains you're proficient
                      in.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consultingRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Consulting Rate (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Set your hourly rate for consulting sessions. You can set
                      this to 0 if you don't want to offer consulting.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-muted/50 p-4 rounded-md">
                <h3 className="font-medium flex items-center gap-2 mb-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Expert Benefits
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Create and publish official knowledge base articles</li>
                  <li>Design coding challenges for the community</li>
                  <li>Offer paid consulting sessions</li>
                  <li>Earn reputation and recognition</li>
                  <li>Help shape the community's learning resources</li>
                </ul>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
