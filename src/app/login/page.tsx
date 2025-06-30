import NoAuthGuard from "@/components/auth/no-auth-guard";
import ButtonThemeToggler from "@/components/theme/button";
import { LoginForm } from "./components/login-form";
import {
  Card,
  CardHeader,
  CardContent
} from "@/components/ui/card";

export default function Login() {
  return (
    <NoAuthGuard>
      <div className="flex flex-wrap h-screen w-full relative md:grid md:grid-cols-2">
        <div className="relative w-full h-3/5 md:h-full bg-gradient-to-tl from-blue-900 to-gray-900 p-12">
          <h1 className="text-white text-xl font-bold uppercase">
            GDU<span className="text-blue-400">.</span>
          </h1>
          <p className="text-white text-lg md:text-5xl font-thin tracking-widest px-12 w-full absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 [mask-image:linear-gradient(to_bottom,white_60%,transparent_100%)]">
            Bem vindo ao sistema de gerenciamento de usuários! Aqui você pode gerenciar suas contas, acessar recursos exclusivos e muito mais!
          </p>
        </div>
        <div className="flex items-center justify-center bg-muted w-full h-2/5 md:h-full md:p-0 transition-colors">
          <Card className="w-full h-full rounded-none md:rounded-lg md:h-auto md:max-w-md space-y-6 border-transparent bg-muted shadow-none md:border md:border-gray-200 dark:border-gray-700 transition-colors">
            <CardHeader className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Entrar na sua conta</h2>
              <ButtonThemeToggler />
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </NoAuthGuard>
  );
}