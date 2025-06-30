"use client"

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function ButtonThemeToggler() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      className="rounded-full bg-muted border transition-colors cursor-pointer w-10 h-10"
      variant="ghost"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-800" />}
    </Button>
  )
}