/* "use client"

import { motion } from "framer-motion"
import { Code2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProjectsEmptyStateProps {
  onCreateClick: () => void
}

const ProjectsEmptyState = ({ onCreateClick }: ProjectsEmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-10 flex flex-col items-center justify-center p-10 bg-light-800/20 dark:bg-dark-400/20 rounded-xl text-center"
    >
      <div className="bg-primary/10 p-4 rounded-full mb-4">
        <Code2 className="h-10 w-10 text-primary" />
      </div>

      <h3 className="text-xl font-bold text-dark100_light900 mb-2">No repositories found</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        You don't have any repositories yet. Create your first repository to showcase your work, track progress, and
        collaborate with others.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={onCreateClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Repository
        </Button>

        <Button variant="outline" onClick={onCreateClick}>
          Import Repository
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        {[
          { title: "Track Progress", description: "Monitor project completion and milestones" },
          { title: "Collaborate", description: "Work with team members on shared projects" },
          { title: "Showcase Work", description: "Display your portfolio to the community" },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.1 * index },
            }}
            className="bg-background p-4 rounded-lg border border-light-300 dark:border-dark-300"
          >
            <h4 className="font-semibold text-dark100_light900 mb-1">{feature.title}</h4>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default ProjectsEmptyState

 */