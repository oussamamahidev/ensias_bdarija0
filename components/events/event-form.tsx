/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  Loader2,
  X,
  Plus,
  MapPin,
  Users,
  DollarSign,
  Sparkles,
  Zap,
  Heart,
  Star,
  Rocket,
  Trophy,
  Target,
  Mic,
  Video,
  Globe,
  Palette,
  Coffee,
  Gift,
  Crown,
  Diamond,
  MagnetIcon as Magic,
  Wand2,
  PartyPopper,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createEvent } from "@/lib/actions/expert.action";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Enhanced form schema with new fields
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  location: z.string().min(2, "Location is required"),
  country: z.string().min(2, "Country is required"),
  technologies: z.array(z.string()).default([]),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  organizer: z.string().min(2, "Organizer is required"),
  isVirtual: z.boolean().default(false),
  eventType: z.enum([
    "conference",
    "webinar",
    "hackathon",
    "meetup",
    "workshop",
    "other",
  ]),
  // New enhanced fields
  capacity: z.number().min(1).max(100000).default(100),
  isPaid: z.boolean().default(false),
  price: z.number().min(0).default(0),
  difficulty: z
    .enum(["beginner", "intermediate", "advanced", "expert"])
    .default("beginner"),
  tags: z.array(z.string()).default([]),
  speakers: z.array(z.string()).default([]),
  agenda: z.string().optional(),
  requirements: z.string().optional(),
  benefits: z.array(z.string()).default([]),
  socialLinks: z
    .object({
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      discord: z.string().optional(),
      slack: z.string().optional(),
    })
    .default({}),
  isRecorded: z.boolean().default(false),
  language: z.string().default("English"),
  timezone: z.string().default("UTC"),
  category: z
    .enum([
      "development",
      "design",
      "business",
      "marketing",
      "data",
      "ai",
      "mobile",
      "web",
      "devops",
      "security",
    ])
    .default("development"),
});

type FormValues = z.infer<typeof formSchema>;

interface EventFormProps {
  userId: string;
}

// Predefined suggestions
const techSuggestions = [
  "React",
  "Vue",
  "Angular",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "Go",
  "Rust",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "Node.js",
  "Express",
  "Next.js",
  "Nuxt.js",
  "Machine Learning",
  "AI",
  "Data Science",
  "Blockchain",
  "Web3",
  "GraphQL",
  "REST API",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "Elasticsearch",
  "Firebase",
  "Supabase",
];

const speakerSuggestions = [
  "John Doe - Senior Developer at Google",
  "Jane Smith - CTO at Startup Inc",
  "Alex Johnson - ML Engineer at OpenAI",
  "Sarah Wilson - Design Lead at Figma",
  "Mike Brown - DevOps Expert at Netflix",
];

const benefitSuggestions = [
  "Networking opportunities",
  "Certificate of completion",
  "Free swag",
  "Recording access",
  "1-on-1 mentorship",
  "Job placement assistance",
  "Exclusive community access",
  "Free resources",
];

export default function EventForm({ userId }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [techInput, setTechInput] = useState("");
  const [speakerInput, setSpeakerInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [speakers, setSpeakers] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [formProgress, setFormProgress] = useState(0);
  const [calendarHover, setCalendarHover] = useState(false);
  const confettiRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      country: "",
      website: "",
      organizer: "",
      isVirtual: false,
      eventType: "conference",
      technologies: [],
      capacity: 100,
      isPaid: false,
      price: 0,
      difficulty: "beginner",
      tags: [],
      speakers: [],
      agenda: "",
      requirements: "",
      benefits: [],
      socialLinks: {},
      isRecorded: false,
      language: "English",
      timezone: "UTC",
      category: "development",
    },
  });

  // Auto-save functionality
  useEffect(() => {
    if (autoSave) {
      const subscription = form.watch(() => {
        const formData = form.getValues();
        localStorage.setItem("eventFormDraft", JSON.stringify(formData));
      });
      return () => subscription.unsubscribe();
    }
  }, [form, autoSave]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem("eventFormDraft");
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        Object.keys(draftData).forEach((key) => {
          if (draftData[key] !== undefined) {
            if (key === "startDate" || key === "endDate") {
              if (draftData[key]) {
                form.setValue(
                  key as keyof FormValues,
                  new Date(draftData[key])
                );
              }
            } else {
              form.setValue(key as keyof FormValues, draftData[key]);
            }
          }
        });
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  }, [form]);

  // Calculate form progress
  useEffect(() => {
    const values = form.getValues();
    const requiredFields = [
      "title",
      "description",
      "startDate",
      "endDate",
      "location",
      "country",
      "organizer",
    ];
    const filledFields = requiredFields.filter((field) => {
      const value = values[field as keyof FormValues];
      return value && value !== "";
    });
    setFormProgress((filledFields.length / requiredFields.length) * 100);
  }, [form.watch()]);

  // Sync arrays with form
  useEffect(() => {
    form.setValue("technologies", technologies);
  }, [technologies, form]);

  useEffect(() => {
    form.setValue("speakers", speakers);
  }, [speakers, form]);

  useEffect(() => {
    form.setValue("benefits", benefits);
  }, [benefits, form]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setShowConfetti(true);

    try {
      if (values.endDate < values.startDate) {
        form.setError("endDate", {
          type: "manual",
          message: "End date cannot be before start date",
        });
        setIsSubmitting(false);
        setShowConfetti(false);
        return;
      }

      await createEvent({
        ...values,
        submitter: userId,
        path: "/events",
      });

      // Clear draft
      localStorage.removeItem("eventFormDraft");

      // Success animation
      setTimeout(() => {
        router.push("/events");
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error("Error submitting event:", error);
      setShowConfetti(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddItem = (
    input: string,
    setInput: (value: string) => void,
    items: string[],
    setItems: (items: string[]) => void,
    suggestions: string[]
  ) => {
    if (input.trim()) {
      const newItems = input
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
        .filter((item) => !items.includes(item));

      if (newItems.length > 0) {
        setItems([...items, ...newItems]);
        setInput("");
      }
    }
  };

  const handleRemoveItem = (
    itemToRemove: string,
    items: string[],
    setItems: (items: string[]) => void
  ) => {
    setItems(items.filter((item) => item !== itemToRemove));
  };

  const nextFormStep = () => {
    setFormStep((prev) => Math.min(prev + 1, 4));
  };

  const prevFormStep = () => {
    setFormStep((prev) => Math.max(prev - 1, 0));
  };

  const getStepIcon = (step: number) => {
    const icons = [
      <Sparkles key="0" className="h-5 w-5" />,
      <CalendarDays key="1" className="h-5 w-5" />,
      <Users key="2" className="h-5 w-5" />,
      <Rocket key="3" className="h-5 w-5" />,
      <Trophy key="4" className="h-5 w-5" />,
    ];
    return icons[step];
  };

  const getStepTitle = () => {
    const titles = [
      "✨ Event Basics",
      "📅 Date & Location",
      "👥 Audience & Details",
      "🚀 Advanced Features",
      "🏆 Final Review",
    ];
    return titles[formStep];
  };

  const getStepDescription = () => {
    const descriptions = [
      "Let's create something amazing together!",
      "When and where will the magic happen?",
      "Who's your target audience?",
      "Add some special features to make it shine!",
      "Almost there! Let's review everything.",
    ];
    return descriptions[formStep];
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500";
      case "intermediate":
        return "bg-yellow-500";
      case "advanced":
        return "bg-orange-500";
      case "expert":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      development: <Zap className="h-4 w-4" />,
      design: <Palette className="h-4 w-4" />,
      business: <Target className="h-4 w-4" />,
      marketing: <Heart className="h-4 w-4" />,
      data: <Star className="h-4 w-4" />,
      ai: <Magic className="h-4 w-4" />,
      mobile: <Rocket className="h-4 w-4" />,
      web: <Globe className="h-4 w-4" />,
      devops: <Crown className="h-4 w-4" />,
      security: <Diamond className="h-4 w-4" />,
    };
    return icons[category] || <Sparkles className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-amber-800 to-orange-800 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div
          className="absolute top-0 right-0 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute bottom-0 right-0 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl animate-float"
          style={{ animationDelay: "6s" }}
        ></div>
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div
          ref={confettiRef}
          className="fixed inset-0 pointer-events-none z-50"
        >
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-orange-500 via-yellow-500 to-red-500 animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-yellow-500 to-red-500 animate-rainbow mb-4">
              Create Epic Event
            </h1>
            <p className="text-xl text-white/80 mb-6">
              Let s build something extraordinary together! ✨
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-md mx-auto mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white/70">
                  Progress
                </span>
                <span className="text-sm text-white/70">
                  {Math.round(formProgress)}%
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
                <div
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500 ease-out animate-pulse-glow"
                  style={{ width: `${formProgress}%` }}
                />
              </div>
            </div>

            {/* Auto-save indicator */}
            <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  autoSave ? "bg-green-400 animate-pulse" : "bg-gray-400"
                )}
              />
              Auto-save {autoSave ? "enabled" : "disabled"}
            </div>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-center mb-8 overflow-x-auto pb-2">
            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
              {[0, 1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
                    step === formStep
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-neon animate-pulse-glow"
                      : step < formStep
                      ? "bg-green-500 text-white"
                      : "bg-white/20 text-white/60"
                  )}
                >
                  {step < formStep ? (
                    <Trophy className="h-5 w-5" />
                  ) : (
                    getStepIcon(step)
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Form */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-glass animate-bounce-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                {getStepIcon(formStep)}
                {getStepTitle()}
              </CardTitle>
              <CardDescription className="text-white/70 text-lg">
                {getStepDescription()}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {/* Step 0: Event Basics */}
                  {formStep === 0 && (
                    <div className="space-y-6 animate-slide-in-right">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-medium flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-yellow-400" />
                              Event Title *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter an amazing title that will grab attention..."
                                {...field}
                                className="h-14 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-orange-400 focus:ring-orange-400 backdrop-blur-sm text-lg"
                              />
                            </FormControl>
                            <FormDescription className="text-white/60">
                              Make it catchy and descriptive! This is the first
                              thing people will see.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="eventType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white font-medium flex items-center gap-2">
                                <Zap className="h-4 w-4 text-orange-400" />
                                Event Type *
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-14 bg-white/10 border-white/30 text-white focus:border-orange-400 focus:ring-orange-400 backdrop-blur-sm">
                                    <SelectValue placeholder="Choose your event type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-gray-900 border-gray-700">
                                  <SelectItem value="conference">
                                    🎤 Conference
                                  </SelectItem>
                                  <SelectItem value="webinar">
                                    💻 Webinar
                                  </SelectItem>
                                  <SelectItem value="hackathon">
                                    ⚡ Hackathon
                                  </SelectItem>
                                  <SelectItem value="meetup">
                                    👥 Meetup
                                  </SelectItem>
                                  <SelectItem value="workshop">
                                    🛠️ Workshop
                                  </SelectItem>
                                  <SelectItem value="other">
                                    📋 Other
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white font-medium flex items-center gap-2">
                                <Target className="h-4 w-4 text-green-400" />
                                Category *
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-14 bg-white/10 border-white/30 text-white focus:border-orange-400 focus:ring-orange-400 backdrop-blur-sm">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-gray-900 border-gray-700">
                                  <SelectItem value="development">
                                    ⚡ Development
                                  </SelectItem>
                                  <SelectItem value="design">
                                    🎨 Design
                                  </SelectItem>
                                  <SelectItem value="business">
                                    💼 Business
                                  </SelectItem>
                                  <SelectItem value="marketing">
                                    📈 Marketing
                                  </SelectItem>
                                  <SelectItem value="data">
                                    📊 Data Science
                                  </SelectItem>
                                  <SelectItem value="ai">🤖 AI & ML</SelectItem>
                                  <SelectItem value="mobile">
                                    📱 Mobile
                                  </SelectItem>
                                  <SelectItem value="web">🌐 Web</SelectItem>
                                  <SelectItem value="devops">
                                    ☁️ DevOps
                                  </SelectItem>
                                  <SelectItem value="security">
                                    🔒 Security
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-medium flex items-center gap-2">
                              <Wand2 className="h-4 w-4 text-orange-400" />
                              Description *
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about your amazing event! What will attendees learn? Who should join? What makes it special?"
                                className="min-h-[120px] bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-orange-400 focus:ring-orange-400 backdrop-blur-sm resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-white/60">
                              Paint a picture! Help people understand why they
                              should attend.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end pt-4">
                        <Button
                          type="button"
                          onClick={nextFormStep}
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 h-auto text-lg font-semibold shadow-neon transition-all duration-300 hover:scale-105"
                        >
                          Continue the Journey
                          <Rocket className="ml-2 h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 1: Date & Location */}
                  {formStep === 1 && (
                    <div className="space-y-6 animate-slide-in-right">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="text-white font-medium flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-orange-400" />
                                Start Date *
                              </FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      onMouseEnter={() =>
                                        setCalendarHover(true)
                                      }
                                      onMouseLeave={() =>
                                        setCalendarHover(false)
                                      }
                                      className={cn(
                                        "w-full h-14 pl-4 text-left font-normal bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300",
                                        !field.value && "text-white/50",
                                        calendarHover &&
                                          "scale-[1.02] shadow-lg border-orange-400"
                                      )}
                                    >
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-2">
                                          <div
                                            className={cn(
                                              "w-8 h-8 rounded-full flex items-center justify-center",
                                              "bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300",
                                              calendarHover &&
                                                "animate-calendar-bounce"
                                            )}
                                          >
                                            <CalendarIcon className="h-4 w-4 text-white" />
                                          </div>
                                          {field.value ? (
                                            <span className="font-medium">
                                              {format(
                                                field.value,
                                                "EEEE, MMMM d, yyyy"
                                              )}
                                            </span>
                                          ) : (
                                            <span>Pick your start date</span>
                                          )}
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                                      </div>
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0 bg-gray-900/95 backdrop-blur-md border-orange-500/30 shadow-2xl rounded-xl overflow-hidden"
                                  align="center"
                                >
                                  <div className="p-4 border-b border-orange-500/20 bg-gradient-to-r from-orange-500 to-red-500">
                                    <div className="flex items-center gap-2">
                                      <PartyPopper className="h-5 w-5 text-white animate-calendar-bounce" />
                                      <h3 className="text-white font-bold text-lg">
                                        When does your event start?
                                      </h3>
                                    </div>
                                    <p className="text-white/80 text-sm mt-1">
                                      Choose a date to kick off your amazing
                                      event!
                                    </p>
                                  </div>
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                    className="text-white bg-transparent p-3"
                                    classNames={{
                                      months:
                                        "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                      month: "space-y-4",
                                      caption:
                                        "flex justify-center pt-1 relative items-center text-orange-400 font-bold",
                                      caption_label: "text-lg font-bold",
                                      nav: "space-x-1 flex items-center",
                                      nav_button: cn(
                                        "h-8 w-8 bg-orange-500/20 hover:bg-orange-500/40 text-orange-400 hover:text-white rounded-full transition-all duration-300 hover:scale-110"
                                      ),
                                      nav_button_previous: "absolute left-1",
                                      nav_button_next: "absolute right-1",
                                      table: "w-full border-collapse space-y-1",
                                      head_row: "flex",
                                      head_cell:
                                        "text-orange-300 rounded-md w-9 font-bold text-sm",
                                      row: "flex w-full mt-2",
                                      cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-orange-500/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 rounded-lg",
                                      day: cn(
                                        "h-9 w-9 p-0 font-normal text-white hover:bg-orange-500/30 hover:text-white rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg"
                                      ),
                                      day_selected:
                                        "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:bg-gradient-to-r hover:from-orange-600 hover:to-red-600 focus:bg-gradient-to-r focus:from-orange-500 focus:to-red-500 shadow-lg scale-110 animate-date-glow",
                                      day_today:
                                        "bg-orange-500/20 text-orange-300 font-bold ring-2 ring-orange-400/50",
                                      day_outside: "text-gray-500 opacity-50",
                                      day_disabled: "text-gray-600 opacity-30",
                                      day_range_middle:
                                        "aria-selected:bg-orange-500/20 aria-selected:text-white",
                                      day_hidden: "invisible",
                                    }}
                                  />
                                  <div className="p-3 border-t border-orange-500/20 bg-gradient-to-r from-gray-900 to-gray-800">
                                    <div className="flex items-center justify-center gap-2 text-orange-300 text-sm">
                                      <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                                      <span>Select a date to continue</span>
                                      <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="text-white font-medium flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-red-400" />
                                End Date *
                              </FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      onMouseEnter={() =>
                                        setCalendarHover(true)
                                      }
                                      onMouseLeave={() =>
                                        setCalendarHover(false)
                                      }
                                      className={cn(
                                        "w-full h-14 pl-4 text-left font-normal bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300",
                                        !field.value && "text-white/50",
                                        calendarHover &&
                                          "scale-[1.02] shadow-lg border-red-400"
                                      )}
                                    >
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-2">
                                          <div
                                            className={cn(
                                              "w-8 h-8 rounded-full flex items-center justify-center",
                                              "bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-300",
                                              calendarHover &&
                                                "animate-calendar-bounce"
                                            )}
                                          >
                                            <CalendarIcon className="h-4 w-4 text-white" />
                                          </div>
                                          {field.value ? (
                                            <span className="font-medium">
                                              {format(
                                                field.value,
                                                "EEEE, MMMM d, yyyy"
                                              )}
                                            </span>
                                          ) : (
                                            <span>Pick your end date</span>
                                          )}
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                                      </div>
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0 bg-gray-900/95 backdrop-blur-md border-red-500/30 shadow-2xl rounded-xl overflow-hidden"
                                  align="center"
                                >
                                  <div className="p-4 border-b border-red-500/20 bg-gradient-to-r from-red-500 to-orange-500">
                                    <div className="flex items-center gap-2">
                                      <Trophy className="h-5 w-5 text-white animate-calendar-bounce" />
                                      <h3 className="text-white font-bold text-lg">
                                        When does your event end?
                                      </h3>
                                    </div>
                                    <p className="text-white/80 text-sm mt-1">
                                      Select when your awesome event concludes!
                                    </p>
                                  </div>
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date < new Date() ||
                                      (form.getValues("startDate") &&
                                        date < form.getValues("startDate"))
                                    }
                                    initialFocus
                                    className="text-white bg-transparent p-3"
                                    classNames={{
                                      months:
                                        "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                      month: "space-y-4",
                                      caption:
                                        "flex justify-center pt-1 relative items-center text-red-400 font-bold",
                                      caption_label: "text-lg font-bold",
                                      nav: "space-x-1 flex items-center",
                                      nav_button: cn(
                                        "h-8 w-8 bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-white rounded-full transition-all duration-300 hover:scale-110"
                                      ),
                                      nav_button_previous: "absolute left-1",
                                      nav_button_next: "absolute right-1",
                                      table: "w-full border-collapse space-y-1",
                                      head_row: "flex",
                                      head_cell:
                                        "text-red-300 rounded-md w-9 font-bold text-sm",
                                      row: "flex w-full mt-2",
                                      cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-red-500/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 rounded-lg",
                                      day: cn(
                                        "h-9 w-9 p-0 font-normal text-white hover:bg-red-500/30 hover:text-white rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg"
                                      ),
                                      day_selected:
                                        "bg-gradient-to-r from-red-500 to-orange-500 text-white hover:bg-gradient-to-r hover:from-red-600 hover:to-orange-600 focus:bg-gradient-to-r focus:from-red-500 focus:to-orange-500 shadow-lg scale-110 animate-date-glow",
                                      day_today:
                                        "bg-red-500/20 text-red-300 font-bold ring-2 ring-red-400/50",
                                      day_outside: "text-gray-500 opacity-50",
                                      day_disabled: "text-gray-600 opacity-30",
                                      day_range_middle:
                                        "aria-selected:bg-red-500/20 aria-selected:text-white",
                                      day_hidden: "invisible",
                                    }}
                                  />
                                  <div className="p-3 border-t border-red-500/20 bg-gradient-to-r from-gray-900 to-gray-800">
                                    <div className="flex items-center justify-center gap-2 text-red-300 text-sm">
                                      <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                                      <span>
                                        Select a date after your start date
                                      </span>
                                      <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Date Range Preview */}
                      {form.watch("startDate") && form.watch("endDate") && (
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 animate-calendar-slide">
                          <div className="flex items-center gap-2 text-white mb-2">
                            <CalendarDays className="h-5 w-5 text-orange-400" />
                            <h3 className="font-medium">Your Event Duration</h3>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-white/80">
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                              {format(form.watch("startDate"), "MMM d, yyyy")}
                            </Badge>
                            <span>to</span>
                            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                              {format(form.watch("endDate"), "MMM d, yyyy")}
                            </Badge>
                            <span className="ml-2">
                              (
                              {Math.ceil(
                                (form.watch("endDate").getTime() -
                                  form.watch("startDate").getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )}{" "}
                              days)
                            </span>
                          </div>
                        </div>
                      )}

                      <FormField
                        control={form.control}
                        name="isVirtual"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/30 p-6 bg-white/5 backdrop-blur-sm">
                            <div className="space-y-0.5">
                              <FormLabel className="text-white font-medium flex items-center gap-2">
                                <Globe className="h-5 w-5 text-orange-400" />
                                Virtual Event
                              </FormLabel>
                              <FormDescription className="text-white/60">
                                Is this event happening online?
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-orange-500 data-[state=checked]:to-red-500"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white font-medium flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-orange-400" />
                                {form.watch("isVirtual")
                                  ? "Platform/URL *"
                                  : "Location *"}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={
                                    form.watch("isVirtual")
                                      ? "Zoom, Google Meet, YouTube Live..."
                                      : "City, Venue, Address..."
                                  }
                                  {...field}
                                  className="h-14 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-orange-400 focus:ring-orange-400 backdrop-blur-sm"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white font-medium flex items-center gap-2">
                                <Globe className="h-4 w-4 text-orange-400" />
                                {form.watch("isVirtual")
                                  ? "Host Country *"
                                  : "Country *"}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Country"
                                  {...field}
                                  className="h-14 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-orange-400 focus:ring-orange-400 backdrop-blur-sm"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevFormStep}
                          className="border-white/30 text-white hover:bg-white/10 px-8 py-4 h-auto backdrop-blur-sm"
                        >
                          <span className="mr-2">←</span>
                          Back
                        </Button>
                        <Button
                          type="button"
                          onClick={nextFormStep}
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 h-auto font-semibold shadow-neon transition-all duration-300 hover:scale-105"
                        >
                          Keep Going
                          <Zap className="ml-2 h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Audience & Details */}
                  {formStep === 2 && (
                    <div className="space-y-6 animate-slide-in-right">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="organizer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white font-medium flex items-center gap-2">
                                <Crown className="h-4 w-4 text-yellow-400" />
                                Organizer *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your organization or name"
                                  {...field}
                                  className="h-14 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-orange-400 focus:ring-orange-400 backdrop-blur-sm"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="capacity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white font-medium flex items-center gap-2">
                                <Users className="h-4 w-4 text-orange-400" />
                                Expected Attendees
                              </FormLabel>
                              <FormControl>
                                <div className="space-y-3">
                                  <Slider
                                    value={[field.value]}
                                    onValueChange={(value) =>
                                      field.onChange(value[0])
                                    }
                                    max={10000}
                                    min={1}
                                    step={1}
                                    className="w-full"
                                  />
                                  <div className="text-center text-white font-bold text-lg">
                                    {field.value.toLocaleString()} people
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="difficulty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-medium flex items-center gap-2">
                              <Target className="h-4 w-4 text-red-400" />
                              Difficulty Level
                            </FormLabel>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {[
                                "beginner",
                                "intermediate",
                                "advanced",
                                "expert",
                              ].map((level) => (
                                <Button
                                  key={level}
                                  type="button"
                                  variant={
                                    field.value === level
                                      ? "default"
                                      : "outline"
                                  }
                                  onClick={() => field.onChange(level)}
                                  className={cn(
                                    "h-16 flex flex-col items-center justify-center gap-1 transition-all duration-300",
                                    field.value === level
                                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-neon"
                                      : "bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                                  )}
                                >
                                  <div
                                    className={cn(
                                      "w-3 h-3 rounded-full",
                                      getDifficultyColor(level)
                                    )}
                                  />
                                  <span className="capitalize text-sm font-medium">
                                    {level}
                                  </span>
                                </Button>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="isPaid"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/30 p-6 bg-white/5 backdrop-blur-sm">
                              <div className="space-y-0.5">
                                <FormLabel className="text-white font-medium flex items-center gap-2">
                                  <DollarSign className="h-5 w-5 text-green-400" />
                                  Paid Event
                                </FormLabel>
                                <FormDescription className="text-white/60">
                                  Will attendees need to pay?
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {form.watch("isPaid") && (
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white font-medium flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-green-400" />
                                  Price (USD)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                    className="h-14 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-orange-400 focus:ring-orange-400 backdrop-blur-sm"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>

                      <FormField
                        control={form.control}
                        name="technologies"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-medium flex items-center gap-2">
                              <Zap className="h-4 w-4 text-orange-400" />
                              Technologies & Topics
                            </FormLabel>
                            <div className="space-y-4">
                              <div className="flex gap-2">
                                <Input
                                  placeholder="React, Python, AI, Machine Learning..."
                                  value={techInput}
                                  onChange={(e) => setTechInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      handleAddItem(
                                        techInput,
                                        setTechInput,
                                        technologies,
                                        setTechnologies,
                                        techSuggestions
                                      );
                                    }
                                  }}
                                  className="h-14 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-orange-400 focus:ring-orange-400 backdrop-blur-sm"
                                />
                                <Button
                                  type="button"
                                  onClick={() =>
                                    handleAddItem(
                                      techInput,
                                      setTechInput,
                                      technologies,
                                      setTechnologies,
                                      techSuggestions
                                    )
                                  }
                                  disabled={!techInput.trim()}
                                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white h-14 px-6"
                                >
                                  <Plus className="h-5 w-5" />
                                </Button>
                              </div>

                              {/* Quick suggestions */}
                              <div className="flex flex-wrap gap-2">
                                {techSuggestions.slice(0, 8).map((tech) => (
                                  <Button
                                    key={tech}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      if (!technologies.includes(tech)) {
                                        setTechnologies([
                                          ...technologies,
                                          tech,
                                        ]);
                                      }
                                    }}
                                    className="bg-white/5 border-white/30 text-white/70 hover:bg-white/10 hover:text-white text-xs"
                                  >
                                    {tech}
                                  </Button>
                                ))}
                              </div>

                              {technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2 p-4 bg-white/5 rounded-lg border border-white/20 backdrop-blur-sm">
                                  {technologies.map((tech, index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 text-sm font-medium"
                                    >
                                      {tech}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRemoveItem(
                                            tech,
                                            technologies,
                                            setTechnologies
                                          )
                                        }
                                        className="ml-2 text-white/80 hover:text-white"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <FormDescription className="text-white/60">
                              Add relevant technologies, programming languages,
                              or topics
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevFormStep}
                          className="border-white/30 text-white hover:bg-white/10 px-8 py-4 h-auto backdrop-blur-sm"
                        >
                          <span className="mr-2">←</span>
                          Back
                        </Button>
                        <Button
                          type="button"
                          onClick={nextFormStep}
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 h-auto font-semibold shadow-neon transition-all duration-300 hover:scale-105"
                        >
                          Almost There
                          <Star className="ml-2 h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Advanced Features */}
                  {formStep === 3 && (
                    <div className="space-y-6 animate-slide-in-right">
                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-medium flex items-center gap-2">
                              <Globe className="h-4 w-4 text-orange-400" />
                              Website (Optional)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://your-awesome-event.com"
                                {...field}
                                className="h-14 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-orange-400 focus:ring-orange-400 backdrop-blur-sm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="speakers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white font-medium flex items-center gap-2">
                              <Mic className="h-4 w-4 text-orange-400" />
                              Speakers & Presenters
                            </FormLabel>
                            <div className="space-y-4">
                              <div className="flex gap-2">
                                <Input
                                  placeholder="John Doe - Senior Developer at Google"
                                  value={speakerInput}
                                  onChange={(e) =>
                                    setSpeakerInput(e.target.value)
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      handleAddItem(
                                        speakerInput,
                                        setSpeakerInput,
                                        speakers,
                                        setSpeakers,
                                        speakerSuggestions
                                      );
                                    }
                                  }}
                                  className="h-14 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-orange-400 focus:ring-orange-400 backdrop-blur-sm"
                                />
                                <Button
                                  type="button"
                                  onClick={() =>
                                    handleAddItem(
                                      speakerInput,
                                      setSpeakerInput,
                                      speakers,
                                      setSpeakers,
                                      speakerSuggestions
                                    )
                                  }
                                  disabled={!speakerInput.trim()}
                                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white h-14 px-6"
                                >
                                  <Plus className="h-5 w-5" />
                                </Button>
                              </div>

                              {speakers.length > 0 && (
                                <div className="space-y-2">
                                  {speakers.map((speaker, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/20 backdrop-blur-sm"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                          <Mic className="h-5 w-5 text-white" />
                                        </div>
                                        <span className="text-white">
                                          {speaker}
                                        </span>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleRemoveItem(
                                            speaker,
                                            speakers,
                                            setSpeakers
                                          )
                                        }
                                        className="text-white/60 hover:text-white hover:bg-white/10"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <FormDescription className="text-white/60">
                              Add speakers, presenters, or facilitators for your
                              event
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="benefits"
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        render={({ field: any }) => (
                          <FormItem>
                            <FormLabel className="text-white font-medium flex items-center gap-2">
                              <Gift className="h-4 w-4 text-green-400" />
                              What Will Attendees Get?
                            </FormLabel>
                            <div className="space-y-4">
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Certificate of completion, networking opportunities..."
                                  value={benefitInput}
                                  onChange={(e) =>
                                    setBenefitInput(e.target.value)
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      handleAddItem(
                                        benefitInput,
                                        setBenefitInput,
                                        benefits,
                                        setBenefits,
                                        benefitSuggestions
                                      );
                                    }
                                  }}
                                  className="h-14 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-orange-400 focus:ring-orange-400 backdrop-blur-sm"
                                />
                                <Button
                                  type="button"
                                  onClick={() =>
                                    handleAddItem(
                                      benefitInput,
                                      setBenefitInput,
                                      benefits,
                                      setBenefits,
                                      benefitSuggestions
                                    )
                                  }
                                  disabled={!benefitInput.trim()}
                                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white h-14 px-6"
                                >
                                  <Plus className="h-5 w-5" />
                                </Button>
                              </div>

                              {/* Quick suggestions */}
                              <div className="flex flex-wrap gap-2">
                                {benefitSuggestions
                                  .slice(0, 4)
                                  .map((benefit) => (
                                    <Button
                                      key={benefit}
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        if (!benefits.includes(benefit)) {
                                          setBenefits([...benefits, benefit]);
                                        }
                                      }}
                                      className="bg-white/5 border-white/30 text-white/70 hover:bg-white/10 hover:text-white text-xs"
                                    >
                                      {benefit}
                                    </Button>
                                  ))}
                              </div>

                              {benefits.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {benefits.map((benefit, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/20 backdrop-blur-sm"
                                    >
                                      <div className="flex items-center gap-3">
                                        <Gift className="h-4 w-4 text-green-400" />
                                        <span className="text-white text-sm">
                                          {benefit}
                                        </span>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleRemoveItem(
                                            benefit,
                                            benefits,
                                            setBenefits
                                          )
                                        }
                                        className="text-white/60 hover:text-white hover:bg-white/10"
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <FormDescription className="text-white/60">
                              What value will attendees get from your event?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="isRecorded"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/30 p-6 bg-white/5 backdrop-blur-sm">
                              <div className="space-y-0.5">
                                <FormLabel className="text-white font-medium flex items-center gap-2">
                                  <Video className="h-5 w-5 text-red-400" />
                                  Will be Recorded
                                </FormLabel>
                                <FormDescription className="text-white/60">
                                  Recording for later viewing
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-red-500 data-[state=checked]:to-orange-500"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="language"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white font-medium flex items-center gap-2">
                                <Globe className="h-4 w-4 text-orange-400" />
                                Language
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-14 bg-white/10 border-white/30 text-white focus:border-orange-400 focus:ring-orange-400 backdrop-blur-sm">
                                    <SelectValue placeholder="Select language" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-gray-900 border-gray-700">
                                  <SelectItem value="English">
                                    🇺🇸 English
                                  </SelectItem>
                                  <SelectItem value="Spanish">
                                    🇪🇸 Spanish
                                  </SelectItem>
                                  <SelectItem value="French">
                                    🇫🇷 French
                                  </SelectItem>
                                  <SelectItem value="German">
                                    🇩🇪 German
                                  </SelectItem>
                                  <SelectItem value="Chinese">
                                    🇨🇳 Chinese
                                  </SelectItem>
                                  <SelectItem value="Japanese">
                                    🇯🇵 Japanese
                                  </SelectItem>
                                  <SelectItem value="Portuguese">
                                    🇧🇷 Portuguese
                                  </SelectItem>
                                  <SelectItem value="Russian">
                                    🇷🇺 Russian
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevFormStep}
                          className="border-white/30 text-white hover:bg-white/10 px-8 py-4 h-auto backdrop-blur-sm"
                        >
                          <span className="mr-2">←</span>
                          Back
                        </Button>
                        <Button
                          type="button"
                          onClick={nextFormStep}
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 h-auto font-semibold shadow-neon transition-all duration-300 hover:scale-105"
                        >
                          Final Step
                          <Crown className="ml-2 h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Final Review */}
                  {formStep === 4 && (
                    <div className="space-y-6 animate-slide-in-right">
                      <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                          <Trophy className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          You re Almost Done! 🎉
                        </h3>
                        <p className="text-white/70">
                          Review your amazing event details below
                        </p>
                      </div>

                      {/* Event Preview Card */}
                      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                                {form.watch("eventType")}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="border-white/30 text-white"
                              >
                                {form.watch("category")}
                              </Badge>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">
                              {form.watch("title") || "Your Event Title"}
                            </h4>
                            <p className="text-white/70 text-sm mb-4">
                              {form.watch("description")?.substring(0, 150) ||
                                "Your event description"}
                              {form.watch("description")?.length > 150 && "..."}
                            </p>
                          </div>
                          <div className="text-right">
                            <div
                              className={cn(
                                "w-4 h-4 rounded-full mb-2",
                                getDifficultyColor(form.watch("difficulty"))
                              )}
                            />
                            <span className="text-white/60 text-xs capitalize">
                              {form.watch("difficulty")}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="text-center p-3 bg-white/5 rounded-lg">
                            <Calendar className="h-5 w-5 text-orange-400 mx-auto mb-1" />
                            <div className="text-white/60">Date</div>
                            <div className="text-white font-medium">
                              {form.watch("startDate")
                                ? format(form.watch("startDate"), "MMM d")
                                : "TBD"}
                            </div>
                          </div>
                          <div className="text-center p-3 bg-white/5 rounded-lg">
                            <MapPin className="h-5 w-5 text-orange-400 mx-auto mb-1" />
                            <div className="text-white/60">Location</div>
                            <div className="text-white font-medium">
                              {form.watch("isVirtual")
                                ? "Virtual"
                                : form.watch("country") || "TBD"}
                            </div>
                          </div>
                          <div className="text-center p-3 bg-white/5 rounded-lg">
                            <Users className="h-5 w-5 text-orange-400 mx-auto mb-1" />
                            <div className="text-white/60">Capacity</div>
                            <div className="text-white font-medium">
                              {form.watch("capacity")?.toLocaleString() ||
                                "100"}
                            </div>
                          </div>
                          <div className="text-center p-3 bg-white/5 rounded-lg">
                            <DollarSign className="h-5 w-5 text-orange-400 mx-auto mb-1" />
                            <div className="text-white/60">Price</div>
                            <div className="text-white font-medium">
                              {form.watch("isPaid")
                                ? `$${form.watch("price")}`
                                : "Free"}
                            </div>
                          </div>
                        </div>

                        {technologies.length > 0 && (
                          <div>
                            <div className="text-white/60 text-sm mb-2">
                              Technologies:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {technologies.slice(0, 6).map((tech, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="border-white/30 text-white/80 text-xs"
                                >
                                  {tech}
                                </Badge>
                              ))}
                              {technologies.length > 6 && (
                                <Badge
                                  variant="outline"
                                  className="border-white/30 text-white/80 text-xs"
                                >
                                  +{technologies.length - 6} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Auto-save toggle */}
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/20">
                        <div className="flex items-center gap-3">
                          <Coffee className="h-5 w-5 text-orange-400" />
                          <div>
                            <div className="text-white font-medium">
                              Auto-save Draft
                            </div>
                            <div className="text-white/60 text-sm">
                              Save your progress automatically
                            </div>
                          </div>
                        </div>
                        <Switch
                          checked={autoSave}
                          onCheckedChange={setAutoSave}
                          className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-orange-500 data-[state=checked]:to-yellow-500"
                        />
                      </div>

                      <div className="flex justify-between pt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevFormStep}
                          className="border-white/30 text-white hover:bg-white/10 px-8 py-4 h-auto backdrop-blur-sm"
                        >
                          <span className="mr-2">←</span>
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 hover:from-orange-600 hover:via-amber-600 hover:to-red-600 text-white px-12 py-4 h-auto text-lg font-bold shadow-neon transition-all duration-300 hover:scale-105 animate-pulse-glow"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                              Creating Magic...
                            </>
                          ) : (
                            <>
                              <Rocket className="mr-3 h-6 w-6" />
                              Launch Event!
                              <Sparkles className="ml-3 h-6 w-6" />
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Success Message */}
                      {isSubmitting && (
                        <div className="text-center animate-bounce-in">
                          <div className="text-white/80 text-lg mb-2">
                            🎉 Your event is being created! 🎉
                          </div>
                          <div className="text-white/60">
                            Get ready to make some amazing connections!
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Fun Footer */}
          <div className="text-center mt-8 text-white/60">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-red-400 animate-pulse" />
              <span>Made with love for the tech community</span>
              <Heart className="h-4 w-4 text-red-400 animate-pulse" />
            </div>
            <div className="text-sm">
              Need help? We re here to make your event amazing! ✨
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
