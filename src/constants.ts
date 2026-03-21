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

export const STARTER_MEALS: Meal[] = [
  {
    id: 'seed-1',
    name: 'Spinach and ricotta pasta bake',
    types: ['main'],
    tags: ['kid-friendly', 'comfort-food'],
    ingredients: 'Pasta, ricotta, spinach, tomato sauce, mozzarella',
  },
  {
    id: 'seed-2',
    name: 'Lemon chicken rice bowls',
    types: ['main'],
    tags: ['quick', 'healthy'],
    ingredients: 'Chicken, rice, cucumbers, yogurt sauce, lemon',
  },
  {
    id: 'seed-3',
    name: 'Veggie quesadillas',
    types: ['main', 'snack'],
    tags: ['kid-friendly', 'quick'],
    ingredients: 'Tortillas, cheese, peppers, corn, black beans',
  },
  {
    id: 'seed-4',
    name: 'Tomato lentil soup',
    types: ['soup'],
    tags: ['healthy', 'comfort-food'],
    ingredients: 'Lentils, tomatoes, onion, garlic, olive oil',
  },
  {
    id: 'seed-5',
    name: 'Banana oat muffins',
    types: ['snack'],
    tags: ['kid-friendly', 'healthy'],
    ingredients: 'Bananas, oats, eggs, cinnamon, maple syrup',
  },
  {
    id: 'seed-6',
    name: 'Turkey meatballs with couscous',
    types: ['main'],
    tags: ['kid-friendly', 'healthy'],
    ingredients: 'Turkey mince, couscous, carrots, parsley, passata',
  },
]
