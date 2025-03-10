"use client"

import { THEME_STORAGE_KEY } from "@/constants"
import { useTheme } from "@/context/ThemeProvider"
import type { ThemeName } from "@/types"
import { type MouseEvent, useCallback, useState } from "react"
import { Sun, Moon, Monitor } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const Theme = () => {
  const { mode, setMode } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const updateMode = useCallback(
    (value: ThemeName) => (event: MouseEvent) => {
      event.preventDefault()
      setMode(value)
      setIsOpen(false)

      if (value !== "system") {
        localStorage.setItem(THEME_STORAGE_KEY, value)
      } else {
        localStorage.removeItem(THEME_STORAGE_KEY)
      }
    },
    [setMode],
  )

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-9 h-9 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {mode === "light" ? <Sun className="h-5 w-5 text-orange-500" /> : <Moon className="h-5 w-5 text-blue-400" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 rounded-xl overflow-hidden p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <DropdownMenuItem
          onClick={updateMode("light")}
          className={`flex items-center gap-2 px-3 py-2.5 cursor-pointer rounded-lg ${
            mode === "light" ? "bg-gray-100 dark:bg-gray-700" : "hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <Sun className="h-4 w-4 text-orange-500" />
          <span
            className={`text-sm ${mode === "light" ? "font-medium text-primary-500" : "text-gray-700 dark:text-gray-200"}`}
          >
            Light
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={updateMode("dark")}
          className={`flex items-center gap-2 px-3 py-2.5 cursor-pointer rounded-lg ${
            mode === "dark" ? "bg-gray-100 dark:bg-gray-700" : "hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <Moon className="h-4 w-4 text-blue-400" />
          <span
            className={`text-sm ${mode === "dark" ? "font-medium text-primary-500" : "text-gray-700 dark:text-gray-200"}`}
          >
            Dark
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={updateMode("system")}
          className={`flex items-center gap-2 px-3 py-2.5 cursor-pointer rounded-lg ${
            mode === "system" ? "bg-gray-100 dark:bg-gray-700" : "hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <Monitor className="h-4 w-4 text-gray-500" />
          <span
            className={`text-sm ${mode === "system" ? "font-medium text-primary-500" : "text-gray-700 dark:text-gray-200"}`}
          >
            System
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Theme

