"use client"

import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { saveUser } from "@/lib/api/user";

import { toast } from "sonner";
import { usePerson } from "@/hooks/use-person";

import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Plus,
  User,
  Mail,
  Lock,
  Shield,
  CalendarIcon,
  Settings,
  X,
  Save,
  Users, Eye, EyeClosed
} from "lucide-react";
import {useState} from "react";

type UserFormProps = {
  initialData?: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "VIEWER";
    isActive: boolean;
    validUntil: string;
    personId: string;
  }
}

type personData = {
  id: string;
  name: string;
}

type UserFormState = {
  type: "edit" | "create";
  onRefresh: () => void;
}

export default function UserForm({ initialData, type, onRefresh }: UserFormProps & UserFormState) {
  const [open, setOpen] = React.useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = React.useState(initialData?.name || "");
  const [email, setEmail] = React.useState(initialData?.email || "");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState<"ADMIN" | "VIEWER">(initialData?.role || "VIEWER");
  const [person, setPerson] = React.useState(initialData?.personId || "");
  const [validUntil, setValidUntil] = React.useState(
    initialData?.validUntil ? initialData.validUntil.split("T")[0] : "",
  );
  const [isActive, setIsActive] = React.useState<boolean>(initialData?.isActive || true);

  const { data, isLoading } = usePerson(open);
  const isEditing = !!initialData;

  const mutation = useMutation({
    mutationFn: () =>
      saveUser(
        {
          name,
          email,
          password: password,
          role,
          personId: person,
          validUntil: validUntil ? new Date(validUntil).toISOString() : "",
          isActive,
        },
        initialData?.id,
      ),
    onSuccess: () => {
      toast.success(isEditing ? "Usuário atualizado com sucesso!" : "Usuário criado com sucesso!");
      onRefresh?.();
      setOpen(false);
      setName("");
      setEmail("");
      setPassword("");
      setRole("VIEWER");
      setPerson("");
      setValidUntil("");
      setIsActive(true);
    },
    onError: () => {
      toast.error("Erro ao salvar o usuário");
    },
  })

  const handleTogglePasswordVisibility = () => setShowPassword(prev => !prev);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      return toast.error("O nome é obrigatório");
    }

    if (!email.trim()) {
      return toast.error("O email é obrigatório");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.error("Email inválido");
    }

    if (!isEditing && !password.trim()) {
      return toast.error("A senha é obrigatória");
    }

    if (password && password.length < 6) {
      return toast.error("A senha deve ter pelo menos 6 caracteres");
    }

    if (!person.trim()) {
      return toast.error("Selecione uma pessoa para vincular ao usuário");
    }

    if (validUntil) {
      const validDate = new Date(validUntil);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (validDate < today) {
        return toast.error("A data de validade deve ser futura");
      }
    }

    if (mutation.isPending) {
      return;
    }

    mutation.mutate();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === "create" ? (
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4" />
            <span className="hidden lg:inline">Adicionar</span>
          </Button>
        ) : (
          <span className="focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 hover:bg-gray-100 cursor-pointer dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
            Editar
          </span>
        )}
      </DialogTrigger>

      <DialogContent className="!max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            {isEditing ? "Editar Usuário" : "Adicionar Usuário"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {isEditing ? "Atualize os detalhes do usuário abaixo." : "Preencha os detalhes para criar um novo usuário."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  Nome de Usuário
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite o nome do usuário"
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@exemplo.com"
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  {isEditing ? "Nova Senha (opcional)" : "Senha"}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isEditing ? "Deixe em branco para manter a atual" : "Digite a senha"}
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required={!isEditing}
                  />
                  <div
                    onClick={handleTogglePasswordVisibility}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-100 border h-full w-[40px] flex items-center justify-center rounded-r-md cursor-pointer"
                  >
                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeClosed className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-500" />
                  Perfil de Acesso
                </Label>
                <Select value={role} onValueChange={(value: "ADMIN" | "VIEWER") => setRole(value)}>
                  <SelectTrigger
                    className="!h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full"
                    disabled={isLoading}
                  >
                    <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione uma pessoa"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIEWER">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Visualizador</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ADMIN">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span>Administrador</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="person" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  Pessoa Vinculada
                </Label>
                <Select value={person} onValueChange={setPerson}>
                  <SelectTrigger className="!h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full">
                    <SelectValue placeholder="Selecione uma pessoa" />
                  </SelectTrigger>
                  <SelectContent>
                    {data?.map((person: personData) => (
                      <SelectItem key={person.id} value={person.id}>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{person.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="validUntil" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-gray-500" />
                  Válido Até (opcional)
                </Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gray-500" />
                  Status do Usuário
                </Label>
                <div className="flex items-center space-x-3 h-11 px-3 border border-gray-300 rounded-md bg-gray-50">
                  <Switch
                    id="status"
                    checked={isActive}
                    onCheckedChange={(checked) => setIsActive(!!checked)}
                    className="data-[state=checked]:bg-green-600"
                  />
                  <Label htmlFor="status" className="text-sm text-gray-700 cursor-pointer">
                    {isActive ? "Usuário ativo" : "Usuário inativo"}
                  </Label>
                  <div
                    className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                      isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isActive ? "Ativo" : "Inativo"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto h-11 border-gray-300 hover:bg-gray-50 text-gray-700 bg-transparent"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full sm:w-auto h-11 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {mutation.isPending ? "Salvando..." : isEditing ? "Atualizar" : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}