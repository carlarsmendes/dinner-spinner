export type MealType = 'main' | 'soup' | 'snack'

export type Tag = 'kid-friendly' | 'quick' | 'healthy' | 'comfort-food'

export type Meal = {
  id: string
  name: string
  types: MealType[]
  tags: Tag[]
  ingredients: string
}

export type WeekSlot = {
  slotId: string
  type: MealType
  mealId: string | null
  locked: boolean
}

export type GeneratedPlan = {
  items: WeekSlot[]
  lastUpdated: number
}

export type PlanNotice = {
  kind: 'error' | 'info'
  message: string
}

export type GenerationResult = {
  plan: GeneratedPlan
  notices: PlanNotice[]
}

export type MealDraft = {
  name: string
  types: MealType[]
  tags: Tag[]
  ingredients: string
}
