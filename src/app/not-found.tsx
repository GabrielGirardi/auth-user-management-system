import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="relative">
          <div className="text-9xl font-bold text-slate-200 select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center space-x-4 text-slate-400">
              <Users className="w-10 h-10 animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 text-amber-600">
            <AlertTriangle className="w-6 h-6" />
            <h1 className="text-2xl font-semibold">Página não encontrada!</h1>
          </div>

          <p className="text-slate-600 text-lg max-w-md mx-auto">
            Parece que esta página não foi encontrada. Que tal retornar ao painel principal?
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retornar
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}