"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"

import type React from "react"
import { useCallback, useState, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { ProfileSchema } from "@/lib/validation"
import { updateUser } from "@/lib/actions/user.action"
import { useToast } from "../ui/use-toast"
import { motion } from "framer-motion"
import { User, MapPin, Globe, FileText, Upload, X, Save, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface Props {
  clerkId: string
  user: string
}

const ProfileForm = ({ clerkId, user }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const profileInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const parseUser = JSON.parse(user)

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: parseUser?.name ?? "",
      username: parseUser?.username ?? "",
      portfolioWebsite: parseUser?.portfolioWebsite ?? "",
      location: parseUser?.location ?? "",
      bio: parseUser?.bio ?? "",
    },
  })

  const onSubmit = useCallback(
    async (values: z.infer<typeof ProfileSchema>) => {
      setIsSubmitting(true)
      try {
        // In a real app, you would handle image uploads here
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
        })

        toast({
          title: "Profile updated successfully",
          description: "Your profile information has been saved.",
          variant: "default",
        })

        router.back()
      } catch (error) {
        console.log(error)
        toast({
          title: "Failed to update profile",
          description: "There was an error updating your profile. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [clerkId, pathname, router, toast],
  )

  const handleCoverImageClick = () => {
    coverInputRef.current?.click()
  }

  const handleProfileImageClick = () => {
    profileInputRef.current?.click()
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCoverImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href={`/profile/${clerkId}`} className="mr-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Your Profile</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="basic" className="text-base">
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="appearance" className="text-base">
            Appearance
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TabsContent value="basic" className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <User size={16} />
                              Name <span className="text-primary-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your name"
                                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
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
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <User size={16} />
                              Username <span className="text-primary-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your username"
                                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
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
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <MapPin size={16} />
                              Location
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Where are you from?"
                                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
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
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                              <Globe size={16} />
                              Portfolio Website
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="url"
                                placeholder="Your portfolio URL"
                                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem className="mt-6">
                          <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <FileText size={16} />
                            Bio <span className="text-primary-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What's special about you?"
                              className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500 min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            Tell the community about yourself, your interests, and expertise.
                          </FormDescription>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {/* Cover Image Upload */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Cover Image</h3>
                        <div
                          className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary-500 transition-colors"
                          onClick={handleCoverImageClick}
                        >
                          {coverImage ? (
                            <>
                              <Image src={coverImage || "/placeholder.svg"} alt="Cover" fill className="object-cover" />
                              <button
                                type="button"
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setCoverImage(null)
                                }}
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                              <Upload className="text-gray-400 mb-2" size={24} />
                              <p className="text-gray-500 dark:text-gray-400 text-sm">Click to upload cover image</p>
                              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">(Coming soon)</p>
                            </div>
                          )}
                          <input
                            type="file"
                            ref={coverInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleCoverImageChange}
                          />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                          Recommended size: 1500 x 500 pixels
                        </p>
                      </div>

                      {/* Profile Image Upload */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Profile Picture</h3>
                        <div
                          className="relative w-32 h-32 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary-500 transition-colors"
                          onClick={handleProfileImageClick}
                        >
                          {profileImage ? (
                            <>
                              <Image
                                src={profileImage || "/placeholder.svg"}
                                alt="Profile"
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                className="absolute bottom-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setProfileImage(null)
                                }}
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                              <Upload className="text-gray-400 mb-1" size={20} />
                              <p className="text-gray-500 dark:text-gray-400 text-xs">Upload</p>
                              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">(Coming soon)</p>
                            </div>
                          )}
                          <input
                            type="file"
                            ref={profileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                          />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 text-center">
                          Recommended: Square image, at least 200 x 200 pixels
                        </p>
                      </div>

                      {/* Preferences */}
                      <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Preferences</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="email-notifications" className="text-gray-700 dark:text-gray-300">
                                Email Notifications
                              </Label>
                              <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Receive notifications about your activity
                              </p>
                            </div>
                            <Switch id="email-notifications" defaultChecked />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="public-profile" className="text-gray-700 dark:text-gray-300">
                                Public Profile
                              </Label>
                              <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Make your profile visible to everyone
                              </p>
                            </div>
                            <Switch id="public-profile" defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <div className="flex justify-end gap-3 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-white flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  )
}

export default ProfileForm

