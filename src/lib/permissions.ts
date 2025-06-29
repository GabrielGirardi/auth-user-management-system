type Role = "ADMIN" | "VIEWER";
type Action = "view" | "edit" | "delete" | "create";

const permissionsMap: Record<Role, Action[]> = {
  ADMIN: ["view", "edit", "delete", "create"],
  VIEWER: ["view"],
};

export function canAccess(role: Role, action: Action): boolean {
  return permissionsMap[role]?.includes(action) ?? false;
}