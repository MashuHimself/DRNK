import { Wine } from "lucide-react";
import type { Drink } from "@/types/drink";
import { DrinkCard } from "./DrinkCard";

interface MenuViewProps {
  drinks: Drink[];
  onSelect: (drink: Drink) => void;
  onGoAdd: () => void;
}

export const MenuView = ({ drinks, onSelect, onGoAdd }: MenuViewProps) => {
  return (
    <div className="animate-in fade-in duration-300 px-5 pt-12 pb-32">
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-cherry-glow">
          DRNK<span className="text-primary">.app</span>
        </p>
        <h1 className="mt-1 font-serif text-4xl font-bold">
          Twoje <span className="italic text-primary">menu</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          {drinks.length} {drinks.length === 1 ? "drink" : "drinków"} w karcie
        </p>
      </header>

      {drinks.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-card shadow-soft">
            <Wine className="h-10 w-10 text-primary" />
          </div>
          <h2 className="font-serif text-2xl font-semibold">Pusta karta</h2>
          <p className="mt-2 max-w-xs text-muted-foreground">
            Dodaj swojego pierwszego drinka, aby zacząć budować menu.
          </p>
          <button
            onClick={onGoAdd}
            className="mt-6 rounded-full bg-gradient-cherry px-6 py-3 font-medium text-primary-foreground shadow-cherry transition-transform active:scale-95"
          >
            Dodaj pierwszego drinka
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {drinks.map((d) => (
            <DrinkCard key={d.id} drink={d} onClick={() => onSelect(d)} />
          ))}
        </div>
      )}
    </div>
  );
};
