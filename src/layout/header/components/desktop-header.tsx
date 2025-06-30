"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { logoutAction } from "@/app/actions/auth";

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  User,
  LogOut,
  Moon,
  Sun
} from "lucide-react";

interface DesktopHeaderProps {
  user: {
    name: string;
    role: string;
  }
}

export default function DesktopHeader({ user }: DesktopHeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex items-center justify-between p-4 text-gray-500 w-full border-b shadow-xs">
      <div className="mx-auto flex items-center justify-between space-x-4 md:w-[95%] 2xl:w-[83%]">
        <Image
          className="object-fit-contain"
          src="/logo-menu.png"
          alt="Logo"
          width={30}
          height={30}
        />

        <nav>
          <ul className="flex space-x-12">
            <li>
              <a href="/dashboard" className="hover:text-gray-700 dark:text-gray-200 transition-colors">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/people" className="hover:text-gray-700 dark:text-gray-200 transition-colors">
                Pessoas
              </a>
            </li>
            <li>
              <a href="/users" className="hover:text-gray-700 dark:text-gray-200 transition-colors">
                Usuários
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-4 cursor-pointer px-4 border-l border-r hover:bg-muted transition-colors dark:text-gray-200">
                <Avatar>
                  <AvatarImage src="https://cdn-icons-png.flaticon.com/512/9131/9131478.png" />
                  <AvatarFallback>Adm</AvatarFallback>
                </Avatar>
                <div className="leading-[1px]">
                  <p className="text-sm">{user.name}</p>
                  <span className="text-xs">{user.role}</span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel className="flex items-center justify-between text-gray-500 dark:text-gray-200">
                Minha conta <User className="w-4 h-4 text-gray-500 dark:text-gray-200" />
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="text-gray-500 hover:text-gray-400 dark:text-gray-200 transition duration-500 cursor-pointer"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                 >
                  {theme === 'dark' ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-800" />}
                  Tema
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-gray-500 hover:text-gray-400 dark:text-gray-200 transition duration-500 cursor-pointer"
                  onClick={logoutAction}
                >
                  <LogOut className="text-red-500" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}