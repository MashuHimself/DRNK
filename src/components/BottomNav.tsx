import { BookOpen, Plus, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

export type Tab = "menu" | "add" | "order";

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export const BottomNav = ({ active, onChange }: BottomNavProps) => {
  const items: { id: Tab; label: string; icon: typeof BookOpen }[] = [
    { id: "menu", label: "Menu", icon: BookOpen },
    { id: "add", label: "Dodaj drinka", icon: Plus },
    { id: "order", label: "Zamówienie", icon: ClipboardList },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/70 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {items.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2.5 transition-all duration-300",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300",
                  isActive && "bg-gradient-cherry shadow-cherry scale-110"
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <span className={cn("text-[11px] font-medium text-center", isActive && "text-foreground")}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
