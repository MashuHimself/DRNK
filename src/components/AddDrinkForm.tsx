import { useRef, useState } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Drink } from "@/types/drink";

const drinkSchema = z.object({
  name: z.string().trim().min(1, "Podaj nazwę drinka").max(80, "Maks. 80 znaków"),
  comment: z.string().max(300, "Maks. 300 znaków"),
  ingredients: z.string().trim().min(1, "Podaj składniki").max(2000),
  instructions: z.string().trim().min(1, "Podaj instrukcję").max(2000),
});

interface AddDrinkFormProps {
  onAdd: (drink: Omit<Drink, "id" | "createdAt">) => void;
  onAdded: () => void;
  initial?: Drink | null;
  onCancel?: () => void;
}

const resizeImage = (file: File, maxDim = 1200): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Brak canvas"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => reject(new Error("Nieprawidłowe zdjęcie"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Błąd odczytu"));
    reader.readAsDataURL(file);
  });

export const AddDrinkForm = ({ onAdd, onAdded, initial, onCancel }: AddDrinkFormProps) => {
  const isEdit = !!initial;
  const [name, setName] = useState(initial?.name ?? "");
  const [comment, setComment] = useState(initial?.comment ?? "");
  const [ingredients, setIngredients] = useState(initial?.ingredients ?? "");
  const [instructions, setInstructions] = useState(initial?.instructions ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Wybierz plik graficzny");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Maks. 10 MB");
      return;
    }
    setUploading(true);
    try {
      const data = await resizeImage(file);
      setImage(data);
    } catch {
      toast.error("Nie udało się wczytać zdjęcia");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = drinkSchema.safeParse({ name, comment, ingredients, instructions });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    onAdd({ ...(result.data as Omit<Drink, "id" | "createdAt" | "image">), image });
    toast.success(isEdit ? `"${result.data.name}" zaktualizowany` : `"${result.data.name}" dodany do menu!`);
    if (!isEdit) {
      setName("");
      setComment("");
      setIngredients("");
      setInstructions("");
      setImage("");
    }
    onAdded();
  };

  return (
    <div className="animate-in fade-in duration-300 px-5 pt-12 pb-32">
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cherry-glow">
          {isEdit ? "Edycja" : "Nowy przepis"}
        </p>
        <h1 className="mt-1 font-serif text-4xl font-bold">
          {isEdit ? "Edytuj" : "Dodaj"} <span className="italic text-primary">drinka</span>
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label className="mb-2 block text-sm font-medium">Zdjęcie</Label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          {image ? (
            <div className="relative overflow-hidden rounded-3xl shadow-soft">
              <img src={image} alt="Podgląd" className="aspect-[4/3] w-full object-cover" />
              <button
                type="button"
                onClick={() => setImage("")}
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-card/90 backdrop-blur-md text-destructive shadow-soft active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-border bg-gradient-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {uploading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-cherry shadow-cherry">
                    <Camera className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium">Wgraj zdjęcie drinka</span>
                </>
              )}
            </button>
          )}
        </div>

        <div>
          <Label htmlFor="name" className="mb-2 block text-sm font-medium">Nazwa drinka *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="np. Wiśniowy Mojito"
            maxLength={80}
            className="h-12 rounded-2xl bg-input border-border"
          />
        </div>

        <div>
          <Label htmlFor="comment" className="mb-2 block text-sm font-medium">Komentarz</Label>
          <Input
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="np. Anka, bez lodu"
            maxLength={300}
            className="h-12 rounded-2xl bg-input border-border"
          />
        </div>

        <div>
          <Label htmlFor="ingredients" className="mb-2 block text-sm font-medium">Składniki *</Label>
          <Textarea
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="50 ml białego rumu&#10;30 ml soku z limonki&#10;listki mięty..."
            rows={5}
            maxLength={2000}
            className="rounded-2xl bg-input border-border resize-none"
          />
        </div>

        <div>
          <Label htmlFor="instructions" className="mb-2 block text-sm font-medium">Instrukcja przygotowania *</Label>
          <Textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="1. Ugnieć miętę z limonką...&#10;2. Dodaj rum i lód..."
            rows={6}
            maxLength={2000}
            className="rounded-2xl bg-input border-border resize-none"
          />
        </div>

        <Button
          type="submit"
          className="h-14 w-full rounded-2xl bg-gradient-cherry text-base font-semibold shadow-cherry hover:opacity-90"
        >
          {isEdit ? "Zapisz zmiany" : "Dodaj do menu"}
        </Button>
        {isEdit && onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-12 w-full rounded-2xl"
          >
            Anuluj
          </Button>
        )}
      </form>
    </div>
  );
};
