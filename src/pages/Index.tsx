import { useCallback, useEffect, useState } from "react";
import { BottomNav, type Tab } from "@/components/BottomNav";
import { MenuView } from "@/components/MenuView";
import { AddDrinkForm } from "@/components/AddDrinkForm";
import { DrinkDetail } from "@/components/DrinkDetail";
import { OrderBuilder, type OrderItem } from "@/components/OrderBuilder";
import { OrderReview } from "@/components/OrderReview";
import { useDrinks } from "@/hooks/useDrinks";
import type { Drink } from "@/types/drink";
import { toast } from "sonner";

type OrderStep = "build" | "review";

const Index = () => {
  const { drinks, addDrink, removeDrink, updateDrink } = useDrinks();
  const [tab, setTab] = useState<Tab>("menu");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewFromOrderId, setPreviewFromOrderId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderStep, setOrderStep] = useState<OrderStep>("build");

  const selected = selectedId ? drinks.find((d) => d.id === selectedId) ?? null : null;
  const previewFromOrder = previewFromOrderId
    ? drinks.find((d) => d.id === previewFromOrderId) ?? null
    : null;
  const editing = editingId ? drinks.find((d) => d.id === editingId) ?? null : null;

  // If selected/editing drink was deleted elsewhere, clear it
  useEffect(() => {
    if (selectedId && !drinks.find((d) => d.id === selectedId)) setSelectedId(null);
  }, [drinks, selectedId]);

  const handleDelete = () => {
    if (!selected) return;
    removeDrink(selected.id);
    toast.success("Drink usunięty");
    setSelectedId(null);
  };

  const changeQty = useCallback((drinkId: string, delta: number) => {
    setOrderItems((prev) => {
      const existing = prev.find((i) => i.drinkId === drinkId);
      if (!existing) {
        if (delta <= 0) return prev;
        return [...prev, { drinkId, quantity: delta, note: "" }];
      }
      const newQty = existing.quantity + delta;
      if (newQty <= 0) return prev.filter((i) => i.drinkId !== drinkId);
      return prev.map((i) => (i.drinkId === drinkId ? { ...i, quantity: newQty } : i));
    });
  }, []);

  const changeNote = useCallback((drinkId: string, note: string) => {
    setOrderItems((prev) =>
      prev.map((i) => (i.drinkId === drinkId ? { ...i, note } : i))
    );
  }, []);

  const clearOrder = () => {
    setOrderItems([]);
    setOrderStep("build");
    toast.success("Zamówienie wyczyszczone");
  };

  const confirmOrder = () => {
    toast.success("Zamówienie zatwierdzone 🍒");
    setOrderItems([]);
    setOrderStep("build");
    setTab("menu");
  };

  // Edit view
  if (editing) {
    return (
      <div className="mx-auto min-h-screen max-w-md">
        <AddDrinkForm
          initial={editing}
          onAdd={(patch) => updateDrink(editing.id, patch)}
          onAdded={() => {
            setSelectedId(editing.id);
            setEditingId(null);
          }}
          onCancel={() => {
            setSelectedId(editing.id);
            setEditingId(null);
          }}
        />
      </div>
    );
  }

  // Detail view (from menu)
  if (selected) {
    return (
      <div className="mx-auto min-h-screen max-w-md">
        <DrinkDetail
          drink={selected}
          onBack={() => setSelectedId(null)}
          onDelete={handleDelete}
          onEdit={() => setEditingId(selected.id)}
        />
      </div>
    );
  }

  // Preview from order — read-only, no delete
  if (previewFromOrder) {
    return (
      <div className="mx-auto min-h-screen max-w-md">
        <DrinkDetail
          drink={previewFromOrder}
          onBack={() => setPreviewFromOrderId(null)}
          onDelete={() => {
            toast.info("Usuwanie dostępne w zakładce Menu");
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-md">
      {tab === "menu" && (
        <MenuView
          drinks={drinks}
          onSelect={(d) => setSelectedId(d.id)}
          onGoAdd={() => setTab("add")}
        />
      )}
      {tab === "add" && (
        <AddDrinkForm onAdd={addDrink} onAdded={() => setTab("menu")} />
      )}
      {tab === "order" && orderStep === "build" && (
        <OrderBuilder
          drinks={drinks}
          items={orderItems}
          onChangeQty={changeQty}
          onNext={() => setOrderStep("review")}
          onGoAdd={() => setTab("add")}
        />
      )}
      {tab === "order" && orderStep === "review" && (
        <OrderReview
          items={orderItems}
          drinks={drinks}
          onBack={() => setOrderStep("build")}
          onChangeNote={changeNote}
          onPreview={(d) => setPreviewFromOrderId(d.id)}
          onClear={clearOrder}
          onConfirm={confirmOrder}
        />
      )}
      <BottomNav active={tab} onChange={(t) => setTab(t)} />
    </div>
  );
};

export default Index;
