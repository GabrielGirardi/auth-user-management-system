import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { savePerson } from "@/lib/api/person";

import { toast } from "sonner";
import { formatCPF } from "@/helper/formatter";
import { validateAge } from "@/helper/validation";

import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
  CreditCard,
  Settings,
  Calendar as CalendarIcon,
  X,
  Save
}  from "lucide-react";

type PersonFormProps = {
  initialData?: {
    id: string;
    name: string;
    cpf: string;
    birthDate: string;
    isActive: boolean;
  }
}

type PersonFormState = {
  type: 'edit' | 'create';
  onRefresh: () => void;
}

export default function PersonForm({
  initialData,
  type,
  onRefresh
}: PersonFormProps & PersonFormState) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState(initialData?.name || '');
  const [cpf, setCpf] = React.useState(initialData?.cpf || '');
  const [birthDate, setBirthDate] = React.useState(
    initialData?.birthDate ? initialData.birthDate.split('T')[0] : ''
  );
  const [isActive, setIsActive] = React.useState<boolean>(initialData?.isActive || true);

  const isEditing = !!initialData;
  const mutation = useMutation({
    mutationFn: () =>
      savePerson({
        name,
        cpf,
        birthDate: new Date(birthDate).toISOString(),
        isActive
      }, initialData?.id),
    onSuccess: () => {
      toast.success(isEditing ? 'Pessoa atualizada com sucesso!' : 'Pessoa criada com sucesso!');
      onRefresh?.();
      setOpen(false);
      setName("");
      setCpf("");
      setBirthDate("");
      setIsActive(true);
    },
    onError: () => {
      toast.error('Erro ao salvar a pessoa');
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      return toast.error('O nome é obrigatório');
    }

    if (!cpf.trim()) {
      return toast.error('O CPF é obrigatório');
    }

    if (!birthDate) {
      return toast.error('A data de nascimento é obrigatória');
    }

    const isValidDate = !isNaN(new Date(birthDate).getTime());
    if (!isValidDate) {
      return toast.error('Data de nascimento inválida');
    }

    const validAge = validateAge(birthDate);
    if (!validAge) {
      return toast.error('Para realizar o cadastro, a pessoa deve ter no mínimo 18 anos.');
    }

    if (mutation.isPending) {
      return;
    }

    mutation.mutate();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === 'create' ? (
          <Button variant="outline" size="sm">
            <Plus />
            <span className="hidden lg:inline">
              Adicionar
            </span>
          </Button>
        ) : (
          <span className="focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 hover:bg-gray-100 cursor-pointer dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">Editar</span>
        )}
      </DialogTrigger>
      <DialogContent className="!max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-200">
            {isEditing ? "Editar Pessoa" : "Adicionar Pessoa"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {isEditing ? "Atualize os detalhes do cadastro abaixo." : "Preencha os detalhes para criar um novo cadastro."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500 dark:text-gray-200" />
                Nome Completo
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o nome completo"
                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-500 dark:text-gray-200" />
                CPF
              </Label>
              <Input
                id="cpf"
                value={formatCPF(cpf)}
                onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
                placeholder="000.000.000-00"
                maxLength={14}
                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gray-500 dark:text-gray-200" />
                Data de Nascimento
              </Label>
              <Input
                type="date"
                value={birthDate}
                onChange={(e) => {setBirthDate(e.target.value)}}
                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-500 dark:text-gray-200" />
                Status do Cadastro
              </Label>
              <div className="flex items-center space-x-3 h-11 px-3 border border-gray-300 rounded-md bg-muted">
                <Switch
                  id="status"
                  checked={isActive}
                  onCheckedChange={(checked) => setIsActive(!!checked)}
                  className="data-[state=checked]:bg-green-600"
                />
                <Label htmlFor="status" className="text-sm text-gray-700 dark:text-gray-200 cursor-pointer">
                  {isActive ? "Cadastro ativo" : "Cadastro inativo"}
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
              variant="outline"
              className="w-full sm:w-auto h-11 border-gray-300 cursor-pointer hover:bg-gray-50 text-gray-700 dark:text-gray-200 bg-transparent"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="w-full sm:w-auto h-11 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? "Atualizar" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
