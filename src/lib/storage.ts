import { EMPTY_PLAN, STARTER_MEALS, STARTER_MEALS_VERSION } from '../constants'
import type { GeneratedPlan, Meal } from '../types'

const MEALS_KEY = 'dinner-spinner-meals'
const PLAN_KEY = 'dinner-spinner-plan'
const KID_FRIENDLY_KEY = 'dinner-spinner-kid-friendly'
const MEALS_VERSION_KEY = 'dinner-spinner-meals-version'

const canUseStorage = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined'

const writeStarterMeals = () => {
  localStorage.setItem(MEALS_KEY, JSON.stringify(STARTER_MEALS))
  localStorage.setItem(MEALS_VERSION_KEY, STARTER_MEALS_VERSION)

  return STARTER_MEALS
}

const shouldReplaceWithLatestStarterMeals = (meals: Meal[], savedVersion: string | null) => {
  if (savedVersion === STARTER_MEALS_VERSION) {
    return false
  }

  // Only replace when storage still contains starter-only data.
  return meals.length > 0 && meals.every((meal) => meal.id.startsWith('seed-'))
}

export const loadMeals = (): Meal[] => {
  if (!canUseStorage()) {
    return STARTER_MEALS
  }

  const raw = localStorage.getItem(MEALS_KEY)
  const savedVersion = localStorage.getItem(MEALS_VERSION_KEY)

  if (!raw) {
    return writeStarterMeals()
  }

  try {
    const meals = JSON.parse(raw) as Meal[]

    if (shouldReplaceWithLatestStarterMeals(meals, savedVersion)) {
      return writeStarterMeals()
    }

    if (!savedVersion) {
      localStorage.setItem(MEALS_VERSION_KEY, STARTER_MEALS_VERSION)
    }

    return meals
  } catch {
    return STARTER_MEALS
  }
}

export const saveMeals = (meals: Meal[]) => {
  if (!canUseStorage()) {
    return
  }

  localStorage.setItem(MEALS_KEY, JSON.stringify(meals))
}

export const loadPlan = (): GeneratedPlan => {
  if (!canUseStorage()) {
    return EMPTY_PLAN
  }

  const raw = localStorage.getItem(PLAN_KEY)

  if (!raw) {
    return EMPTY_PLAN
  }

  try {
    return JSON.parse(raw) as GeneratedPlan
  } catch {
    return EMPTY_PLAN
  }
}

export const savePlan = (plan: GeneratedPlan) => {
  if (!canUseStorage()) {
    return
  }

  localStorage.setItem(PLAN_KEY, JSON.stringify(plan))
}

export const loadKidFriendlyPreference = (): boolean => {
  if (!canUseStorage()) {
    return false
  }

  return localStorage.getItem(KID_FRIENDLY_KEY) === 'true'
}

export const saveKidFriendlyPreference = (value: boolean) => {
  if (!canUseStorage()) {
    return
  }

  localStorage.setItem(KID_FRIENDLY_KEY, String(value))
}
