import { useQuery } from "@tanstack/react-query";

export function usePerson(enabled = true) {
  return useQuery({
    queryKey: ["people"],
    queryFn: async () => {
      const response = await fetch("/api/person");
      if (!response.ok) {
        throw new Error("Erro ao carregar pessoas");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: enabled,
  });
}
