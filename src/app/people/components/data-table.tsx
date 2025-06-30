"use client"

import * as React from "react";
import { z } from "zod";
import { CSS } from "@dnd-kit/utilities";

import { formatCPF } from "@/helper/formatter";
import { deletePerson, changePersonStatus } from "@/lib/api/person";
import { useMutation } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { toast } from "sonner";

import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"

import PersonForm from "./form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent
} from "@/components/ui/tabs";

import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns
} from "@tabler/icons-react";

export const schema = z.object({
  id: z.string(),
  name: z.string(),
  cpf: z.string(),
  birthDate: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }).optional(),
});

function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Arraste para ordenar</span>
    </Button>
  )
}

type PersonActionsProps = {
  row: Row<z.infer<typeof schema>>;
  onRefresh: () => void;
}

type StatusPayload = {
  id: string;
  status: boolean;
}

function PersonActions({ row, onRefresh }: PersonActionsProps) {
  const confirmDialog = useConfirmDialog();
  const { mutate: mutateDelete } = useMutation({
    mutationFn: deletePerson,
    onSuccess: () => {
      toast.success("Pessoas removida com sucesso!");
      onRefresh?.();
    },
    onError: () => {
      toast.error("Erro ao remover a pessoa!");
    },
  });

  const handleDelete = async () => {
    const confirmed = await confirmDialog({
      title: "Confirmar exclusão?",
      description: "Esta ação excluirá a pessoa permanentemente.",
      confirmText: "Excluir",
      cancelText: "Cancelar",
    });

    if (confirmed) {
      mutateDelete(row.original.id);
    }
  }

  const { mutate: mutateStatus } = useMutation({
    mutationFn: ({ id, status }: StatusPayload) => changePersonStatus(id, status),
    onSuccess: (data, variables) => {
      toast.success(`Pessoa ${variables.status ? 'ativada' : 'desativada'} com sucesso!`)
      onRefresh?.()
    },
    onError: () => {
      toast.error("Erro ao atualizar o status da pessoas!")
    },
  })

  const handleStatusToggle = () => {
    const newStatus = !row.original.isActive
    mutateStatus({ id: row.original.id, status: newStatus })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
          size="icon"
        >
          <IconDotsVertical/>
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem onClick={(e) => e.stopPropagation()} asChild>
          <PersonForm
            type="edit"
            initialData={row.original}
            onRefresh={onRefresh}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleStatusToggle}>
          {row.original.isActive ? 'Desativar' : 'Ativar'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
          Deletar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    accessorKey: "name",
    header: "Nome",
    enableColumnFilter: true,
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    },
    enableHiding: false,
  },
  {
    accessorKey: "cpf",
    header: "CPF",
    enableColumnFilter: true,
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {formatCPF(row.original.cpf)}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "birthDate",
    header: "Data de Nascimento",
    enableColumnFilter: true,
    cell: ({ row }) => {
      const date = new Date(row.original.birthDate);
      const formatted = new Intl.DateTimeFormat("pt-BR", {
        timeZone: "UTC",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);

      return (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {formatted}
        </Badge>
      </div>
    )},
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    enableColumnFilter: true,
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {new Date(row.original.createdAt).toLocaleDateString("pt-BR")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    enableColumnFilter: true,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true
      return String(row.getValue(columnId)) === filterValue
    },
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.isActive ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
        ) : (
          <IconCircleXFilled className="fill-red-500 dark:fill-red-400" />
        )}
        {row.original.isActive
          ? 'Ativo'
          : 'Inativo'
        }
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row, table }) => (
      <PersonActions
        row={row}
        // @ts-expect-error | use columnDef to get name
        onRefresh={table.options.meta?.onRefresh || []}
      />
    )
  },
];

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          { flexRender(cell.column.columnDef.cell, cell.getContext()) }
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable({
  data: initialData,
  onRefresh
}: {
  data: z.infer<typeof schema>[]
  onRefresh: () => void
}) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [], [data]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    meta: {
      onRefresh,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6 mb-24"
    >
      <div className="flex items-center">
        <div className="flex flex-wrap gap-2 items-center justify-between w-full">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Buscar por nome..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table.getColumn("name")?.setFilterValue(e.target.value)
              }
              className="w-full md:w-64"
            />
            <Select
              value={(table.getColumn("isActive")?.getFilterValue() as string) ?? "all"}
              onValueChange={(value) =>
                table.getColumn("isActive")?.setFilterValue(
                  value === "all" ? undefined : value
                )
              }
            >
              <SelectTrigger className="h-8 w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos (Status)</SelectItem>
                <SelectItem value="true">Ativo</SelectItem>
                <SelectItem value="false">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconLayoutColumns />
                  <span className="hidden lg:inline">Exibir</span>
                  <span className="lg:hidden">Columns</span>
                  <IconChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide()
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {/* @ts-expect-error | use columnDef to get name */}
                        {column.columnDef.header || column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <PersonForm type="create" onRefresh={onRefresh} />
          </div>
        </div>
      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Nenhum dado encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Linhas por página
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ir para o início</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Voltar a página anterior</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ir para a próxima página</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ir para o final</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  )
}

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left cursor-pointer">
          {item.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Visualização da pessoa</DrawerTitle>
          <DrawerDescription>
            Visualizando dados de {item.name}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Nome</Label>
              <Input id="name" disabled defaultValue={item.name} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" disabled defaultValue={formatCPF(item.cpf)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="birthDate">Data de nascimento</Label>
                <Input id="birthDate" type="date" disabled defaultValue={item.birthDate.split('T')[0]} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="location">Criado em</Label>
                <Input id="location" type="date" disabled defaultValue={item.createdAt.split('T')[0]} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Input id="status" disabled defaultValue={item.isActive ? 'Ativo' : 'Inativo'} />
              </div>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Fechar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
