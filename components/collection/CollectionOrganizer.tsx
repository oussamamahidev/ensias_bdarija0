"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Folder, FolderPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "../ui/use-toast"

interface FolderType {
  id: string
  name: string
  count: number
}

interface CollectionOrganizerProps {
  folders: FolderType[]
  currentFolder: string
}

const CollectionOrganizer = ({ folders, currentFolder }: CollectionOrganizerProps) => {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [localFolders, setLocalFolders] = useState<FolderType[]>(folders)

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Folder name required",
        description: "Please enter a name for your folder",
        variant: "destructive",
      })
      return
    }

    // Create a new folder (in a real app, this would be a server action)
    const newFolder = {
      id: newFolderName.toLowerCase().replace(/\s+/g, "-"),
      name: newFolderName,
      count: 0,
    }

    setLocalFolders([...localFolders, newFolder])
    setNewFolderName("")
    setIsOpen(false)

    toast({
      title: "Folder created!",
      description: `"${newFolderName}" folder has been created`,
      variant: "default",
    })
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-dark100_light900 flex items-center gap-2">
          <Folder className="h-5 w-5 text-primary" />
          <span>Organize Your Collection</span>
        </h2>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <FolderPlus className="h-4 w-4" />
              <span>New Folder</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>Organize your saved questions into folders for easier access.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Enter folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleCreateFolder}>
                Create Folder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto">
        {localFolders.map((folder) => (
          <motion.div key={folder.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <a href={`/collection?folder=${folder.id}`}>
              <Badge
                variant={currentFolder === folder.id ? "default" : "outline"}
                className="px-3 py-2 cursor-pointer flex items-center gap-2"
              >
                <Folder className="h-3.5 w-3.5" />
                <span>{folder.name}</span>
                <span className="ml-1 rounded-full bg-background px-2 py-0.5 text-xs">{folder.count}</span>
              </Badge>
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default CollectionOrganizer

