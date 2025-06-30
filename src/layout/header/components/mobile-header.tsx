"use client"

import Image from "next/image";
import { useState } from "react";
import { logoutAction } from "@/app/actions/auth";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

import {
  Menu,
  Home,
  UserPlus,
  Users,
  LogOut
} from "lucide-react";

interface MobileHeaderProps {
  user: {
    name: string;
    role: string;
  }
}

export default function MobileHeader({ user }: MobileHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  }

  return (
    <header className="flex items-center justify-between p-4 text-gray-500 w-full border-b shadow-xs">
      <div className="flex items-center space-x-3">
        <Image className="object-fit-contain" src="/logo-menu.png" alt="Logo" width={24} height={24} />
      </div>

      <div className="flex items-center space-x-3">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-80 p-0">
            <SheetHeader className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-left">Menu</SheetTitle>
              </div>
            </SheetHeader>

            <div className="px-6 pb-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://cdn-icons-png.flaticon.com/512/9131/9131478.png" />
                  <AvatarFallback>Adm</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <span className="text-xs text-gray-500">{user.role}</span>
                </div>
              </div>
            </div>

            <Separator />

            <nav className="flex-1 px-6 py-4">
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Navegação</h3>

                <a
                  href="/dashboard"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </a>

                <a
                  href="/people"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Users className="w-4 h-4" />
                  Pessoas
                </a>

                <a
                  href="/users"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Usuários
                </a>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Conta</h3>
                <button
                  onClick={() => {
                    handleLinkClick()
                    logoutAction()
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}