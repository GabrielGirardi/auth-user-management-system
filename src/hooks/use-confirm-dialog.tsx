"use client"

import { useState, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type Options = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

let openDialog: (options: Options) => Promise<boolean>;

export function ConfirmDialogProvider() {
  const [isOpen, setIsOpen] = useState(false);
  const [resolver, setResolver] = useState<(value: boolean) => void>(() => {});
  const [options, setOptions] = useState<Options>({});

  const confirm = useCallback(
    (opts: Options) =>
      new Promise<boolean>((resolve) => {
        setOptions(opts);
        setIsOpen(true);
        setResolver(() => resolve);
      }),
    []
  );

  openDialog = confirm;

  const handleCancel = () => {
    resolver(false);
    setIsOpen(false);
  }

  const handleConfirm = () => {
    resolver(true);
    setIsOpen(false);
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{options.title || "Tem certeza?"}</AlertDialogTitle>
          <AlertDialogDescription>
            {options.description || "Essa ação não poderá ser desfeita."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {options.cancelText || "Cancelar"}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {options.confirmText || "Confirmar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function useConfirmDialog() {
  return useCallback(
    (options: Options) => {
      if (!openDialog) {
        throw new Error("ConfirmDialogProvider não foi montado");
      }
      return openDialog(options);
    },
    []
  )
}