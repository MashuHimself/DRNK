export interface Drink {
  id: string;
  name: string;
  image: string; // base64 data URL
  comment: string;
  ingredients: string;
  instructions: string;
  createdAt: number;
}
