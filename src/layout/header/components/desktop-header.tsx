import Image from "next/image";
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
  Bell,
  User,
  CircleUserRound,
  LockKeyhole,
  LogOut
} from "lucide-react";

interface DesktopHeaderProps {
  user: {
    name: string;
    role: string;
  };
}

export default function DesktopHeader({ user }: DesktopHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 bg-white text-gray-500 w-full border-b shadow-xs">
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
              <a href="/dashboard" className="hover:text-gray-700 transition-colors">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/people" className="hover:text-gray-700 transition-colors">
                Pessoas
              </a>
            </li>
            <li>
              <a href="/users" className="hover:text-gray-700 transition-colors">
                Usuários
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center space-x-4">
          <Bell className="w-5 h-5 cursor-pointer hover:text-gray-700 transition-colors" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-4 cursor-pointer px-4 border-l border-r hover:bg-gray-50 transition-colors">
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
              <DropdownMenuLabel className="flex items-center justify-between text-gray-500">
                Minha conta <User className="w-4 h-4 text-gray-500" />
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="text-gray-500 hover:text-gray-400 transition duration-500 cursor-pointer">
                  <CircleUserRound />
                  Meus Dados
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-500 hover:text-gray-400 transition duration-500 cursor-pointer">
                  <LockKeyhole />
                  Alterar Senha
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-gray-500 hover:text-gray-400 transition duration-500 cursor-pointer"
                  onClick={logoutAction}
                >
                  <LogOut />
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