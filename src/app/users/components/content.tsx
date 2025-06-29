"use client"

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/api/user";

import { DataTable } from "./data-table";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersContent() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: getUsers,
  })

  return (
    <div>
      {isLoading ? (
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-4">
            <Skeleton className="h-8 w-32 mb-4 border rounded-md" />
            <Skeleton className="h-8 w-32 mb-4 border rounded-md" />
          </div>
          <div className="space-y-4 w-full border rounded-md p-4 h-96">
            <Skeleton className="h-1/6 w-full" />
            <Skeleton className="h-1/6 w-full" />
            <Skeleton className="h-1/6 w-full" />
            <Skeleton className="h-1/6 w-full" />
            <Skeleton className="h-1/6 w-full" />
            <Skeleton className="h-1/6 w-full" />
          </div>
        </div>
      ) : error ? (
        <div className="text-red-500">Erro ao carregar os usuários</div>
      ) : (
        <DataTable data={data} onRefresh={refetch} />
      )}
    </div>
  );
}