"use client"

import { useState } from "react";
import { loginAction } from "@/app/actions/auth";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Eye, EyeClosed } from "lucide-react";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePasswordVisibility = () => setShowPassword(prev => !prev);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);

    const result = await loginAction(formData);

    if (result?.error) {
      const isInvalid = result.error === "Invalid credentials";
      toast.error(
        isInvalid ? "Credenciais inválidas" : "Erro ao fazer login",
        {
          description: isInvalid
            ? "Verifique suas credenciais e tente novamente."
            : `Ocorreu um erro ao tentar fazer login. (${result.error})`,
          position: window.innerWidth < 768 ? "top-center" : "bottom-right",
          richColors: true,
        }
      );
    }

    setIsLoading(false);
  }

  return (
    <form className="relative space-y-4" action={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="Insira seu E-mail" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="Sua senha"
          />
          <div
            onClick={handleTogglePasswordVisibility}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-muted border h-full w-[40px] flex items-center justify-center rounded-r-md cursor-pointer"
          >
            {showPassword ? <Eye className="w-4 h-4" /> : <EyeClosed className="w-4 h-4" />}
          </div>
        </div>
      </div>
      <Button type="submit" className="w-full dark:text-gray-200 bg-blue-900 hover:bg-blue-800 cursor-pointer" disabled={isLoading}>
        Entrar
      </Button>
    </form>
  );
}