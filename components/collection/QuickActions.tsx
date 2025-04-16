"use client"

import { useState } from "react"
import { MoreHorizontal, Trash2, Share2, Download, FolderPlus, CheckSquare } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useToast } from "../ui/use-toast"
const QuickActions = () => {
  const { toast } = useToast()
  const [isSelectionMode, setIsSelectionMode] = useState(false)

  const handleAction = (action: string) => {
    // These would be implemented with server actions in a real app
    switch (action) {
      case "select":
        setIsSelectionMode(!isSelectionMode)
        toast({
          title: isSelectionMode ? "Selection mode disabled" : "Selection mode enabled",
          description: isSelectionMode
            ? "You can now interact with questions normally"
            : "Click on questions to select them for batch actions",
          variant: "default",
        })
        break
      case "delete":
        toast({
          title: "Delete selected",
          description: "Selected questions would be deleted",
          variant: "destructive",
        })
        break
      case "share":
        toast({
          title: "Share collection",
          description: "Your collection link has been copied to clipboard",
          variant: "default",
        })
        break
      case "export":
        toast({
          title: "Export collection",
          description: "Your collection is being exported as JSON",
          variant: "default",
        })
        break
      case "move":
        toast({
          title: "Move to folder",
          description: "Select a folder to move questions to",
          variant: "default",
        })
        break
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleAction("select")} className="cursor-pointer">
          <CheckSquare className="mr-2 h-4 w-4" />
          <span>{isSelectionMode ? "Exit Selection Mode" : "Select Multiple"}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction("move")} className="cursor-pointer">
          <FolderPlus className="mr-2 h-4 w-4" />
          <span>Move to Folder</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction("share")} className="cursor-pointer">
          <Share2 className="mr-2 h-4 w-4" />
          <span>Share Collection</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction("export")} className="cursor-pointer">
          <Download className="mr-2 h-4 w-4" />
          <span>Export Collection</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleAction("delete")} className="cursor-pointer text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete Selected</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default QuickActions

