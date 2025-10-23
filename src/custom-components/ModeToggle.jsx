// src/custom-components/ModeToggle.jsx

import { Moon, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const handleToggle = (isChecked) => {
    setTheme(isChecked ? 'dark' : 'light')
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-5 w-5" />
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={handleToggle}
      />
      <Moon className="h-5 w-5" />
    </div>
  )
}