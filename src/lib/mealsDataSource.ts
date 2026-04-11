import { STARTER_MEALS } from '../constants'
import type { Meal, MealType, Tag } from '../types'
import { loadMeals, saveMeals } from './storage'
import { SUPABASE_HOUSEHOLD_ID, isSupabaseConfigured, supabase } from './supabaseClient'

type SupabaseMealRow = {
  id: string
  household_id: string
  name: string
  types: MealType[]
  tags: Tag[]
  ingredients: string
}

type MealsLoadResult = {
  meals: Meal[]
  source: 'local' | 'supabase'
}

const TABLE_NAME = 'meals'

const toMeal = (row: SupabaseMealRow): Meal => ({
  id: row.id,
  name: row.name,
  types: row.types,
  tags: row.tags,
  ingredients: row.ingredients,
})

const toRow = (meal: Meal): SupabaseMealRow => ({
  id: meal.id,
  household_id: SUPABASE_HOUSEHOLD_ID,
  name: meal.name,
  types: meal.types,
  tags: meal.tags,
  ingredients: meal.ingredients,
})

const isStarterOnly = (meals: Meal[]) => meals.length > 0 && meals.every((meal) => meal.id.startsWith('seed-'))

const shouldSeedSupabaseFromLocal = (localMeals: Meal[]) =>
  localMeals.length > 0 && !isStarterOnly(localMeals) && localMeals.length !== STARTER_MEALS.length

export const loadMealsFromDataSource = async (): Promise<MealsLoadResult> => {
  const localMeals = loadMeals()

  if (!isSupabaseConfigured || !supabase) {
    return { meals: localMeals, source: 'local' }
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('id, household_id, name, types, tags, ingredients')
    .eq('household_id', SUPABASE_HOUSEHOLD_ID)

  if (error) {
    return { meals: localMeals, source: 'local' }
  }

  const supabaseMeals = ((data ?? []) as SupabaseMealRow[]).map(toMeal)

  if (supabaseMeals.length > 0) {
    saveMeals(supabaseMeals)
    return { meals: supabaseMeals, source: 'supabase' }
  }

  if (shouldSeedSupabaseFromLocal(localMeals)) {
    const { error: insertError } = await supabase
      .from(TABLE_NAME)
      .upsert(localMeals.map(toRow), { onConflict: 'id' })

    if (!insertError) {
      return { meals: localMeals, source: 'supabase' }
    }
  }

  return { meals: localMeals, source: 'local' }
}

export const upsertMealInDataSource = async (meal: Meal) => {
  if (!isSupabaseConfigured || !supabase) {
    return
  }

  await supabase.from(TABLE_NAME).upsert([toRow(meal)], { onConflict: 'id' })
}

export const deleteMealInDataSource = async (mealId: string) => {
  if (!isSupabaseConfigured || !supabase) {
    return
  }

  await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', mealId)
    .eq('household_id', SUPABASE_HOUSEHOLD_ID)
}
