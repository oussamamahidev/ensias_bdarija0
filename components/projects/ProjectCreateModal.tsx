/* "use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { X, Plus, Info, AlertCircle, Check } from "lucide-react"

import confetti from "canvas-confetti"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { createProject } from "@/lib/actions/project.action"
import { useToast } from "../ui/use-toast"

interface ProjectCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (newProject: any) => void
  userId: string
}

const ProjectCreateModal = ({ isOpen, onClose, onSuccess, userId }: ProjectCreateModalProps) => {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [tech, setTech] = useState("")
  const [technologies, setTechnologies] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [nameError, setNameError] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const nameInputRef = useRef<HTMLInputElement>(null)

  // Reset form when modal opens
  const resetForm = () => {
    setStep(1)
    setProjectName("")
    setDescription("")
    setIsPrivate(false)
    setTech("")
    setTechnologies([])
    setNameError("")
    setShowSuccess(false)
  }

  const handleAddTech = () => {
    if (tech.trim() && !technologies.includes(tech.trim())) {
      setTechnologies([...technologies, tech.trim()])
      setTech("")
    }
  }

  const handleRemoveTech = (techToRemove: string) => {
    setTechnologies(technologies.filter((t) => t !== techToRemove))
  }

  const validateName = () => {
    if (!projectName.trim()) {
      setNameError("Project name is required")
      nameInputRef.current?.focus()
      return false
    }

    if (projectName.includes(" ")) {
      setNameError("Project name cannot contain spaces")
      return false
    }

    setNameError("")
    return true
  }

  const handleNextStep = () => {
    if (validateName()) {
      setStep(2)
    }
  }

  const handlePrevStep = () => {
    setStep(1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateName()) return

    setIsSubmitting(true)

    try {
      // Create project in database
      const projectData = {
        name: projectName,
        description: description || `A ${projectName} project`,
        isPrivate,
        technologies: technologies.length > 0 ? technologies : ["Next.js", "React", "TypeScript"],
        completionPercentage: 0,
      }

      const newProject = await createProject(projectData, userId)

      // Show success animation
      setShowSuccess(true)

      // Trigger confetti
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }, 500)

      // Wait for animation to complete
      setTimeout(() => {
        // Pass the new project to parent component
        onSuccess(newProject)

        // Reset form
        resetForm()
      }, 2000)
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          if (!isSubmitting) {
            onClose()
            setTimeout(resetForm, 300) // Reset after close animation
          }
        }
      }}
    >
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Repository</DialogTitle>
          <DialogDescription>
            A repository contains all project files, including the revision history.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="project-name" className="required">
                      Repository Name
                    </Label>
                    {nameError && (
                      <span className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {nameError}
                      </span>
                    )}
                  </div>
                  <Input
                    id="project-name"
                    ref={nameInputRef}
                    placeholder="my-awesome-project"
                    value={projectName}
                    onChange={(e) => {
                      setProjectName(e.target.value)
                      if (e.target.value.trim()) setNameError("")
                    }}
                    className={nameError ? "border-destructive" : ""}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Great repository names are short and memorable. Need inspiration? How about{" "}
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => setProjectName("awesome-project")}
                    >
                      awesome-project
                    </button>
                    ?
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-xs text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="A brief description of your project"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="visibility">Repository Visibility</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Public repositories are visible to anyone. Private repositories are only visible to you and
                            people you explicitly share with.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between p-3 rounded-md border">
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 flex items-center justify-center">
                          {!isPrivate && <Check className="h-4 w-4 text-primary" />}
                        </div>
                        <div>
                          <p className="font-medium">Public</p>
                          <p className="text-xs text-muted-foreground">
                            Anyone on the internet can see this repository
                          </p>
                        </div>
                      </div>
                      <Switch checked={!isPrivate} onCheckedChange={(checked) => setIsPrivate(!checked)} />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-md border">
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 flex items-center justify-center">
                          {isPrivate && <Check className="h-4 w-4 text-primary" />}
                        </div>
                        <div>
                          <p className="font-medium">Private</p>
                          <p className="text-xs text-muted-foreground">
                            You choose who can see and commit to this repository
                          </p>
                        </div>
                      </div>
                      <Switch checked={isPrivate} onCheckedChange={(checked) => setIsPrivate(checked)} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label>
                    Technologies <span className="text-xs text-muted-foreground">(optional)</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add technology (e.g. React, Node.js)"
                      value={tech}
                      onChange={(e) => setTech(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddTech()
                        }
                      }}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={handleAddTech}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <AnimatePresence>
                    {technologies.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap gap-2 mt-3"
                      >
                        {technologies.map((t) => (
                          <Badge key={t} variant="secondary" className="flex items-center gap-1 px-3 py-1.5">
                            {t}
                            <button
                              type="button"
                              onClick={() => handleRemoveTech(t)}
                              className="ml-1 rounded-full hover:bg-muted p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md">
                  <h4 className="font-medium flex items-center gap-2 text-amber-800 dark:text-amber-300">
                    <Info className="h-4 w-4" />
                    <span>You're almost done!</span>
                  </h4>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                    After creating your repository, you can add files, set up CI/CD, and invite collaborators.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">Repository Summary</h4>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Name:</span> {projectName}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Visibility:</span> {isPrivate ? "Private" : "Public"}
                    </p>
                    {description && (
                      <p>
                        <span className="text-muted-foreground">Description:</span> {description}
                      </p>
                    )}
                    {technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-muted-foreground">Technologies:</span>
                        {technologies.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <DialogFooter className="flex items-center justify-between sm:justify-between">
            {step === 1 ? (
              <>
                <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleNextStep} disabled={!projectName.trim() || isSubmitting}>
                  Next
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={handlePrevStep} disabled={isSubmitting}>
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  {isSubmitting ? (
                    showSuccess ? (
                      <>
                        <Check className="h-4 w-4" />
                        Created!
                      </>
                    ) : (
                      "Creating..."
                    )
                  ) : (
                    "Create Repository"
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ProjectCreateModal

 */