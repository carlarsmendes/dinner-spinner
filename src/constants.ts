import type { GeneratedPlan, Meal, MealType, Tag } from './types'

export const MEAL_TYPES: MealType[] = ['main', 'soup', 'snack']
export const TAGS: Tag[] = ['kid-friendly', 'quick', 'healthy', 'comfort-food']

export const TYPE_LABELS: Record<MealType, string> = {
  main: 'Main',
  soup: 'Soup',
  snack: 'Snack',
}

export const TAG_LABELS: Record<Tag, string> = {
  'kid-friendly': 'Kid-friendly',
  quick: 'Quick',
  healthy: 'Healthy',
  'comfort-food': 'Comfort food',
}

export const WEEK_TEMPLATE: Array<{ slotId: string; type: MealType; label: string }> = [
  { slotId: 'main-1', type: 'main', label: 'Main dish 1' },
  { slotId: 'main-2', type: 'main', label: 'Main dish 2' },
  { slotId: 'main-3', type: 'main', label: 'Main dish 3' },
  { slotId: 'soup-1', type: 'soup', label: 'Soup' },
  { slotId: 'snack-1', type: 'snack', label: 'Snack' },
]

export const EMPTY_PLAN: GeneratedPlan = {
  items: WEEK_TEMPLATE.map((slot) => ({
    slotId: slot.slotId,
    type: slot.type,
    mealId: null,
    locked: false,
  })),
  lastUpdated: Date.now(),
}

export const EMPTY_MEAL_DRAFT = {
  name: '',
  types: [],
  tags: [],
  ingredients: '',
}

export const STARTER_MEALS_VERSION = 'family-starter-v1'

export const STARTER_MEALS: Meal[] = [
  {
    id: 'seed-1',
    name: 'Chicken legs with mushrooms',
    types: ['main'],
    tags: ['comfort-food'],
    ingredients: 'Chicken legs, mushrooms',
  },
  {
    id: 'seed-2',
    name: 'Rolo de Carne a la Mendes Rocha',
    types: ['main'],
    tags: ['comfort-food', 'kid-friendly'],
    ingredients: 'Meat roll, tomatoes, onion',
  },
  {
    id: 'seed-3',
    name: 'Oven salmon with teriyaki',
    types: ['main'],
    tags: ['healthy'],
    ingredients: 'Salmon, teriyaki sauce',
  },
  {
    id: 'seed-4',
    name: 'Bacalhau com natas e espinafres',
    types: ['main'],
    tags: ['comfort-food'],
    ingredients: 'Codfish, cream, spinach',
  },
  {
    id: 'seed-5',
    name: 'Chicken stroganoff with mushrooms',
    types: ['main'],
    tags: ['kid-friendly', 'comfort-food'],
    ingredients: 'Chicken, mushrooms, cream-based sauce',
  },
  {
    id: 'seed-6',
    name: 'Lemon chicken (oven)',
    types: ['main'],
    tags: ['healthy'],
    ingredients: 'Chicken, lemon',
  },
  {
    id: 'seed-7',
    name: 'Peito de Frango Pizzaiola',
    types: ['main'],
    tags: ['kid-friendly'],
    ingredients: 'Chicken breast, tomato, cheese',
  },
  {
    id: 'seed-8',
    name: 'Lasanha with hidden vegetables',
    types: ['main'],
    tags: ['kid-friendly', 'comfort-food'],
    ingredients: 'Lasagna, mixed hidden vegetables',
  },
  {
    id: 'seed-9',
    name: 'Beans and rice',
    types: ['main'],
    tags: ['quick', 'comfort-food'],
    ingredients: 'Beans, rice',
  },
  {
    id: 'seed-10',
    name: 'Lasanha de Frango e Tomate Seco',
    types: ['main'],
    tags: ['comfort-food'],
    ingredients: 'Chicken, sun-dried tomato, lasagna',
  },
  {
    id: 'seed-11',
    name: 'Hambúrgueres de Picanha',
    types: ['main'],
    tags: ['kid-friendly', 'comfort-food'],
    ingredients: 'Picanha burgers',
  },
  {
    id: 'seed-12',
    name: 'Lentilhas com porco, bacon e chouriço',
    types: ['main'],
    tags: ['comfort-food'],
    ingredients: 'Lentils, pork, bacon, chouriço',
  },
  {
    id: 'seed-13',
    name: 'Coxas de frango no forno com legumes',
    types: ['main'],
    tags: ['healthy'],
    ingredients: 'Chicken thighs, roasted vegetables',
  },
  {
    id: 'seed-14',
    name: 'Arroz de peixe',
    types: ['main'],
    tags: ['comfort-food'],
    ingredients: 'Fish, rice',
  },
  {
    id: 'seed-15',
    name: 'Salmão com purê de batata e couves de Bruxelas',
    types: ['main'],
    tags: ['healthy'],
    ingredients: 'Salmon, mashed potato, Brussels sprouts',
  },
  {
    id: 'seed-16',
    name: 'Sopa de legumes com couve',
    types: ['soup'],
    tags: ['healthy', 'kid-friendly'],
    ingredients: 'Vegetables, cabbage',
  },
  {
    id: 'seed-17',
    name: 'Banana bread (wholewheat)',
    types: ['snack'],
    tags: ['kid-friendly'],
    ingredients: 'Banana bread',
  },
  {
    id: 'seed-18',
    name: 'Yogurt and fruit',
    types: ['snack'],
    tags: ['healthy', 'quick', 'kid-friendly'],
    ingredients: 'Yogurt, fruit',
  },
  {
    id: 'seed-19',
    name: 'Oat and apple cookies',
    types: ['snack'],
    tags: ['kid-friendly'],
    ingredients: 'Oats, apple',
  },
  {
    id: 'seed-20',
    name: 'Fruit and nuts',
    types: ['snack'],
    tags: ['healthy', 'quick'],
    ingredients: 'Fruit, nuts',
  },
  {
    id: 'seed-21',
    name: 'Oat cookies',
    types: ['snack'],
    tags: ['kid-friendly'],
    ingredients: 'Oats',
  },
  {
    id: 'seed-22',
    name: 'Yogurt bowls',
    types: ['snack'],
    tags: ['healthy', 'quick', 'kid-friendly'],
    ingredients: 'Yogurt, toppings',
  },
]
