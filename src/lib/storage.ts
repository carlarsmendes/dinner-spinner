import { EMPTY_PLAN, STARTER_MEALS } from '../constants'
import type { GeneratedPlan, Meal } from '../types'

const MEALS_KEY = 'dinner-spinner-meals'
const PLAN_KEY = 'dinner-spinner-plan'
const KID_FRIENDLY_KEY = 'dinner-spinner-kid-friendly'

const canUseStorage = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined'

export const loadMeals = (): Meal[] => {
  if (!canUseStorage()) {
    return STARTER_MEALS
  }

  const raw = localStorage.getItem(MEALS_KEY)

  if (!raw) {
    localStorage.setItem(MEALS_KEY, JSON.stringify(STARTER_MEALS))
    return STARTER_MEALS
  }

  try {
    return JSON.parse(raw) as Meal[]
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
