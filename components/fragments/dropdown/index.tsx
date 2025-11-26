import { dessertIngredientCategories } from "@/lib/data";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown, X } from "lucide-react";

type DropdownComponentProps = {
  selectedIngredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
};
export function DropdownComponent({
  selectedIngredients,
  onIngredientsChange,
}: DropdownComponentProps) {
  const [open, setOpen] = useState(false);
  const toggleIngredient = (ingredient: string) => {
    if (selectedIngredients.includes(ingredient)) {
      onIngredientsChange(selectedIngredients.filter((i) => i !== ingredient));
    } else {
      onIngredientsChange([...selectedIngredients, ingredient]);
    }
  };

  useEffect(() => {
    const storedIngredients = localStorage.getItem("selectedIngredients");
    if (storedIngredients) {
      onIngredientsChange(JSON.parse(storedIngredients));
    }
  }, [onIngredientsChange]);

  function removeIngredient(ingredient: any) {
    onIngredientsChange(selectedIngredients.filter((i) => i !== ingredient));
  }
  return (
    <div className="space-y-5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="w-full">
          <button className="bg-gray-300 py-2 px-5 rounded-lg ">
            {selectedIngredients
              ? `${selectedIngredients.length} Bahan Dipilih`
              : "Pilih Bahan"}
            <ChevronDown className="inline-block ml-2" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <Command>
            <CommandInput placeholder="Search ingredients..." />
            <CommandList>
              <CommandEmpty>
                Bahan baku yang dicari tidak ditemukan
              </CommandEmpty>
              {Object.entries(dessertIngredientCategories).map(
                ([category, items]) => (
                  <CommandGroup key={category} heading={category}>
                    {items.map((ingredients) => (
                      <CommandItem
                        key={ingredients}
                        onSelect={() => toggleIngredient(ingredients)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <div
                            className={`w-5  h-5 border-2 rounded flex items-center justify-center ${
                              selectedIngredients.includes(ingredients)
                                ? "bg-orange-400"
                                : "border-border"
                            }`}
                          >
                            {selectedIngredients.includes(ingredients) && (
                              <Check className="w-3 h-3 text-primary-foreground" />
                            )}
                          </div>
                          <span className="capitalize">{ingredients}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {(selectedIngredients.length > 0 || selectedIngredients) && (
        <div className="flex flex-wrap gap-3">
          {selectedIngredients.map((ingredient) => (
            <Badge variant="secondary" key={ingredient} className="gap-2 p-2">
              <span className="capitalize text-lg">{ingredient}</span>
              <span>
                <X
                  onClick={() => removeIngredient(ingredient)}
                  className="h-5 w-5 cursor-pointer"
                />
              </span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
