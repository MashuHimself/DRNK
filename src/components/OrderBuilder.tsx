import { Minus, Plus, Wine, ArrowRight } from "lucide-react";
import type { Drink } from "@/types/drink";
import { Button } from "@/components/ui/button";

export type OrderItem = { drinkId: string; quantity: number; note: string };

interface OrderBuilderProps {
  drinks: Drink[];
  items: OrderItem[];
  onChangeQty: (drinkId: string, delta: number) => void;
  onNext: () => void;
  onGoAdd: () => void;
}

export const OrderBuilder = ({ drinks, items, onChangeQty, onNext, onGoAdd }: OrderBuilderProps) => {
  const totalCount = items.reduce((s, i) => s + i.quantity, 0);
  const qtyOf = (id: string) => items.find((i) => i.drinkId === id)?.quantity ?? 0;

  return (
    <div className="animate-in fade-in duration-300 px-5 pt-12 pb-32">
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-cherry-glow">
          DRNK<span className="text-primary">.app</span>
        </p>
        <h1 className="mt-1 font-serif text-4xl font-bold">
          Nowe <span className="italic text-primary">zamówienie</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          {totalCount === 0
            ? "Wybierz drinki dotykając +"
            : `${totalCount} ${totalCount === 1 ? "drink" : "drinków"} w zamówieniu`}
        </p>
      </header>

      {drinks.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-card shadow-soft">
            <Wine className="h-10 w-10 text-primary" />
          </div>
          <h2 className="font-serif text-2xl font-semibold">Brak drinków</h2>
          <p className="mt-2 max-w-xs text-muted-foreground">
            Dodaj najpierw drinki do menu, aby utworzyć zamówienie.
          </p>
          <button
            onClick={onGoAdd}
            className="mt-6 rounded-full bg-gradient-cherry px-6 py-3 font-medium text-primary-foreground shadow-cherry transition-transform active:scale-95"
          >
            Dodaj drinka
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {drinks.map((d) => {
            const qty = qtyOf(d.id);
            return (
              <div
                key={d.id}
                className="flex items-center gap-3 rounded-3xl bg-gradient-card p-3 shadow-soft"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-secondary">
                  {d.image ? (
                    <img src={d.image} alt={d.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-cherry">
                      <Wine className="h-7 w-7 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-serif text-base font-semibold">{d.name}</h3>
                  {d.comment && (
                    <p className="line-clamp-1 text-xs text-muted-foreground">{d.comment}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onChangeQty(d.id, -1)}
                    disabled={qty === 0}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground transition-transform active:scale-90 disabled:opacity-40"
                    aria-label="Mniej"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-6 text-center font-semibold tabular-nums">{qty}</span>
                  <button
                    onClick={() => onChangeQty(d.id, 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-cherry text-primary-foreground shadow-cherry transition-transform active:scale-90"
                    aria-label="Więcej"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalCount > 0 && (
        <div className="fixed bottom-20 left-0 right-0 z-40 px-5 pb-2">
          <div className="mx-auto max-w-md">
            <Button
              onClick={onNext}
              className="h-14 w-full rounded-2xl bg-gradient-cherry text-base font-semibold text-primary-foreground shadow-cherry hover:opacity-95"
            >
              Dalej ({totalCount}) <ArrowRight className="ml-1 h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
