import { Wine } from "lucide-react";
import type { Drink } from "@/types/drink";

interface DrinkCardProps {
  drink: Drink;
  onClick: () => void;
}

export const DrinkCard = ({ drink, onClick }: DrinkCardProps) => {
  return (
    <button
      onClick={onClick}
      className="group relative flex w-full items-center gap-4 overflow-hidden rounded-3xl bg-gradient-card p-3 text-left shadow-soft transition-all duration-300 hover:scale-[1.02] hover:shadow-cherry active:scale-[0.99]"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-secondary">
        {drink.image ? (
          <img
            src={drink.image}
            alt={drink.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-cherry">
            <Wine className="h-8 w-8 text-primary-foreground" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="truncate font-serif text-lg font-semibold text-foreground">
          {drink.name}
        </h3>
        {drink.comment && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {drink.comment}
          </p>
        )}
      </div>
      <div className="h-2 w-2 shrink-0 rounded-full bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
};
