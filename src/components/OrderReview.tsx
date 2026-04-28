import { ArrowLeft, Eye, Wine, Trash2, Check } from "lucide-react";
import type { Drink } from "@/types/drink";
import type { OrderItem } from "./OrderBuilder";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface OrderReviewProps {
  items: OrderItem[];
  drinks: Drink[];
  onBack: () => void;
  onChangeNote: (drinkId: string, note: string) => void;
  onPreview: (drink: Drink) => void;
  onClear: () => void;
  onConfirm: () => void;
}

export const OrderReview = ({
  items,
  drinks,
  onBack,
  onChangeNote,
  onPreview,
  onClear,
  onConfirm,
}: OrderReviewProps) => {
  const enriched = items
    .map((i) => ({ item: i, drink: drinks.find((d) => d.id === i.drinkId) }))
    .filter((x) => x.drink) as { item: OrderItem; drink: Drink }[];

  const total = enriched.reduce((s, e) => s + e.item.quantity, 0);

  return (
    <div className="animate-in fade-in duration-300 px-5 pt-6 pb-32">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-soft transition-transform active:scale-95"
          aria-label="Wróć"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-cherry-glow">
            Podsumowanie
          </p>
          <h1 className="font-serif text-2xl font-bold">
            Zamówienie ({total})
          </h1>
        </div>
        <button
          onClick={onClear}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-card text-destructive shadow-soft transition-transform active:scale-95"
          aria-label="Wyczyść"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {enriched.map(({ item, drink }) => (
          <div key={drink.id} className="rounded-3xl bg-gradient-card p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-secondary">
                {drink.image ? (
                  <img src={drink.image} alt={drink.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-cherry">
                    <Wine className="h-7 w-7 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-serif text-lg font-semibold">{drink.name}</h3>
                <p className="text-sm text-cherry-glow">×{item.quantity}</p>
              </div>
              <button
                onClick={() => onPreview(drink)}
                className="flex h-10 items-center gap-1.5 rounded-full bg-secondary px-3 text-sm font-medium text-foreground transition-transform active:scale-95"
              >
                <Eye className="h-4 w-4" /> Przepis
              </button>
            </div>
            <div className="mt-3">
              <Textarea
                value={item.note}
                onChange={(e) => onChangeNote(drink.id, e.target.value)}
                placeholder="Opis zamówienia (np. bez alkoholu, dla Ani...)"
                className="min-h-[64px] rounded-2xl border-border bg-background/60 text-sm"
                maxLength={300}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-20 left-0 right-0 z-40 px-5 pb-2">
        <div className="mx-auto max-w-md">
          <Button
            onClick={onConfirm}
            className="h-14 w-full rounded-2xl bg-gradient-cherry text-base font-semibold text-primary-foreground shadow-cherry hover:opacity-95"
          >
            <Check className="mr-1 h-5 w-5" /> Zatwierdź zamówienie
          </Button>
        </div>
      </div>
    </div>
  );
};
