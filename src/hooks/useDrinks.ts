import { useCallback, useEffect, useState } from "react";
import type { Drink } from "@/types/drink";

const STORAGE_KEY = "cherry-bar-drinks";

const seed: Drink[] = [
  {
    id: "seed-1",
    name: "Wiśniowy Old Fashioned",
    image: "",
    comment: "Klasyk dla Marka — bez cukru.",
    ingredients: "60 ml whisky\n2 wiśnie koktajlowe\n1 łyżeczka syropu wiśniowego\n2 dashe gorzkiej angostury\nSkórka pomarańczy",
    instructions: "1. W szklance umieść wiśnie i syrop, ugnieć muddlerem.\n2. Dodaj angosturę i whisky.\n3. Wrzuć dużą kostkę lodu i mieszaj 20 sekund.\n4. Udekoruj skórką pomarańczy.",
    createdAt: Date.now() - 100000,
  },
];

export function useDrinks() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setDrinks(JSON.parse(raw));
      } else {
        setDrinks(seed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      }
    } catch {
      setDrinks([]);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(drinks));
  }, [drinks, loaded]);

  const addDrink = useCallback((drink: Omit<Drink, "id" | "createdAt">) => {
    const newDrink: Drink = {
      ...drink,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setDrinks((d) => [newDrink, ...d]);
    return newDrink;
  }, []);

  const removeDrink = useCallback((id: string) => {
    setDrinks((d) => d.filter((x) => x.id !== id));
  }, []);

  const updateDrink = useCallback(
    (id: string, patch: Omit<Drink, "id" | "createdAt">) => {
      setDrinks((d) => d.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    },
    []
  );

  const getDrink = useCallback(
    (id: string) => drinks.find((d) => d.id === id),
    [drinks]
  );

  return { drinks, addDrink, removeDrink, updateDrink, getDrink, loaded };
}
