export type Ingredients = Array<{
  item: string;
  quantity: string;
  unit?: string;
  notes?: string;
}>;

export type DessertStep = Array<{
  steps: string;
}>;

export interface DessertData {
  name: string;
  cookingTime: string;
  description: string;
  ingredients: Ingredients;
  steps: string[];
}
