/* "use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { ProjectInterface } from "@/lib/actions/project.action"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code2, Star, GitFork, Clock } from "lucide-react"
import ProjectListItem from "./ProjectListItem"
import ProjectCard from "./ProjectCard"

// Update the interface to use ProjectInterface instead of Project
interface ProjectsListProps {
  projects: ProjectInterface[]
  view: string
}

const ProjectsList = ({ projects, view }: ProjectsListProps) => {
  const [activeTab, setActiveTab] = useState("all")

  // Filter projects based on active tab
  const filteredProjects = projects.filter((project) => {
    if (activeTab === "all") return true
    if (activeTab === "starred" && project.isStarred) return true
    if (activeTab === "recent" && new Date(project.updatedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000)
      return true
    if (activeTab === "forked" && project.isForked) return true
    return false
  })

  return (
    <Tabs defaultValue="all" className="mt-6" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="all" className="flex items-center gap-2">
          <Code2 className="h-4 w-4" />
          <span>All Projects</span>
        </TabsTrigger>
        <TabsTrigger value="starred" className="flex items-center gap-2">
          <Star className="h-4 w-4" />
          <span>Starred</span>
        </TabsTrigger>
        <TabsTrigger value="recent" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Recent</span>
        </TabsTrigger>
        <TabsTrigger value="forked" className="flex items-center gap-2">
          <GitFork className="h-4 w-4" />
          <span>Forked</span>
        </TabsTrigger>
      </TabsList>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <TabsContent value={activeTab} className="mt-5">
            {filteredProjects.length > 0 ? (
              view === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredProjects.map((project) => (
                    <ProjectListItem key={project.id} project={project} />
                  ))}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-light-800/20 dark:bg-dark-400/20 rounded-lg">
                <Code2 className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-center">No projects found in this category</p>
              </div>
            )}
          </TabsContent>
        </motion.div>
      </AnimatePresence>
    </Tabs>
  )
}

export default ProjectsList

 */