import { ArrowLeft, Pencil, Trash2, Wine } from "lucide-react";
import type { Drink } from "@/types/drink";
import { Button } from "@/components/ui/button";

interface DrinkDetailProps {
  drink: Drink;
  onBack: () => void;
  onDelete: () => void;
  onEdit?: () => void;
}

export const DrinkDetail = ({ drink, onBack, onDelete, onEdit }: DrinkDetailProps) => {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="relative h-[55vh] min-h-[320px] w-full overflow-hidden">
        {drink.image ? (
          <img src={drink.image} alt={drink.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-cherry">
            <Wine className="h-32 w-32 text-primary-foreground/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-overlay" />

        <button
          onClick={onBack}
          className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-card/80 backdrop-blur-md text-foreground shadow-soft transition-transform active:scale-95"
          aria-label="Wróć"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="absolute right-4 top-4 flex gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-card/80 backdrop-blur-md text-foreground shadow-soft transition-transform active:scale-95"
              aria-label="Edytuj"
            >
              <Pencil className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={onDelete}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-card/80 backdrop-blur-md text-destructive shadow-soft transition-transform active:scale-95"
            aria-label="Usuń"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="font-serif text-4xl font-bold leading-tight text-foreground">
            {drink.name}
          </h1>
          {drink.comment && (
            <p className="mt-2 text-base text-cherry-glow italic">
              "{drink.comment}"
            </p>
          )}
        </div>
      </div>

      <div className="space-y-6 px-5 py-6 pb-32">
        <section className="rounded-3xl bg-gradient-card p-5 shadow-soft">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-1 w-8 rounded-full bg-gradient-cherry" />
            <h2 className="font-serif text-xl font-semibold">Składniki</h2>
          </div>
          <p className="whitespace-pre-line text-foreground/90 leading-relaxed">
            {drink.ingredients || "Brak składników"}
          </p>
        </section>

        <section className="rounded-3xl bg-gradient-card p-5 shadow-soft">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-1 w-8 rounded-full bg-gradient-cherry" />
            <h2 className="font-serif text-xl font-semibold">Przygotowanie</h2>
          </div>
          <p className="whitespace-pre-line text-foreground/90 leading-relaxed">
            {drink.instructions || "Brak instrukcji"}
          </p>
        </section>

        <Button onClick={onBack} variant="outline" className="w-full rounded-2xl h-12">
          Wróć do menu
        </Button>
      </div>
    </div>
  );
};
