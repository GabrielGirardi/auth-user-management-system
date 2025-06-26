"use client"

import { useState } from "react";
import { loginAction } from "@/app/actions/auth"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardContent
} from "@/components/ui/card";
import { toast } from "sonner";

import { Eye, EyeClosed } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleTogglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError("");

    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error)

      const title = error === "Invalid credentials" ? "Credenciais inválidas" : "Erro ao fazer login"
      const description = error === "Invalid credentials" ? "Verifique suas credenciais e tente novamente." : `Ocorreu um erro ao tentar fazer login. (${error})`

      toast.error(title, {
        description: description,
        richColors: true,
        position: window.innerWidth < 768
          ? "top-center"
          : "bottom-right"
      });
    }

    setIsLoading(false)
  }

  return (
    <div className="flex flex-wrap h-screen w-full md:grid md:grid-cols-2">
      <div className="relative w-full h-3/5 md:h-full bg-gradient-to-tl from-blue-900 to-gray-900 p-12">
        <h1 className="text-white text-xl font-bold uppercase">
          GDU<span className="text-blue-400">.</span>
        </h1>
        <p className="text-white text-lg md:text-5xl font-thin tracking-widest px-12 w-full absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 [mask-image:linear-gradient(to_bottom,white_60%,transparent_100%)]">
          Bem vindo ao sistema de gerenciamento de usuários! Aqui você pode gerenciar suas contas, acessar recursos exclusivos e muito mais!
        </p>
      </div>
      <div className="flex items-center justify-center w-full h-2/5 md:h-full md:p-0">
        <Card className="w-full md:max-w-md space-y-6 border-transparent shadow-none md:border md:border-gray-100">
          <CardHeader>
            <h2 className="text-2xl font-bold">Entrar na sua conta</h2>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" action={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="Insira seu E-mail" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Sua senha" required />
                  <div className="flex justify-center items-center absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer bg-gray-100 border h-full w-[40px] rounded-r-md" onClick={handleTogglePasswordVisibility}>
                    {showPassword ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeClosed className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full cursor-pointer bg-blue-900 hover:bg-blue-800" disabled={isLoading}>Entrar</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}