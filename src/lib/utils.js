// Simple class name merger (replaces cn from shadcn/ui)
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
