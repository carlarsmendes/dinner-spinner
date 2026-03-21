import { EMPTY_PLAN, WEEK_TEMPLATE } from '../constants'
import type { GenerationResult, GeneratedPlan, Meal, MealType, PlanNotice, WeekSlot } from '../types'

type GeneratorOptions = {
  meals: Meal[]
  currentPlan?: GeneratedPlan | null
  keepLocked?: boolean
  requireKidFriendly?: boolean
}

const shuffle = <T,>(items: T[]) => {
  const copy = [...items]

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]]
  }

  return copy
}

const uniqueMealsForType = (meals: Meal[], type: MealType, blockedIds: Set<string>) =>
  meals.filter((meal) => meal.types.includes(type) && !blockedIds.has(meal.id))

const countMissingByType = (plan: GeneratedPlan) => {
  const counts: Record<MealType, number> = { main: 0, soup: 0, snack: 0 }

  plan.items.forEach((item) => {
    if (!item.mealId) {
      counts[item.type] += 1
    }
  })

  return counts
}

const formatMissingMessage = (counts: Record<MealType, number>) => {
  const parts = Object.entries(counts)
    .filter(([, value]) => value > 0)
    .map(([type, value]) => `${value} more ${type}${value > 1 ? 's' : ''}`)

  if (parts.length === 0) {
    return null
  }

  return `Add ${parts.join(' and ')} to fill the whole week.`
}

const assignMealsForSlots = (
  slots: WeekSlot[],
  meals: Meal[],
  blockedIds: Set<string>,
  notices: PlanNotice[],
  requireKidFriendly: boolean,
) => {
  const unlockedSlots = slots.filter((slot) => !slot.locked)
  const candidatePool = meals.filter((meal) => !blockedIds.has(meal.id))
  const kidFriendlyPool = candidatePool.filter((meal) => meal.tags.includes('kid-friendly'))

  let selectedKidFriendly = 0

  if (requireKidFriendly) {
    const kidTargets = [...unlockedSlots]
      .map((slot) => ({
        slot,
        matches: kidFriendlyPool.filter((meal) => meal.types.includes(slot.type)).length,
      }))
      .filter((entry) => entry.matches > 0)
      .sort((left, right) => left.matches - right.matches)
      .slice(0, 2)
      .map((entry) => entry.slot)

    kidTargets.forEach((slot) => {
      const match = shuffle(
        kidFriendlyPool.filter(
          (meal) => meal.types.includes(slot.type) && !blockedIds.has(meal.id),
        ),
      )[0]

      if (match) {
        slot.mealId = match.id
        blockedIds.add(match.id)
        selectedKidFriendly += 1
      }
    })
  }

  unlockedSlots.forEach((slot) => {
    if (slot.mealId) {
      return
    }

    const candidates = shuffle(uniqueMealsForType(meals, slot.type, blockedIds))
    const match = candidates[0]

    if (match) {
      slot.mealId = match.id
      blockedIds.add(match.id)
    }
  })

  if (requireKidFriendly) {
    const totalKidFriendly = slots
      .map((slot) => meals.find((meal) => meal.id === slot.mealId))
      .filter((meal): meal is Meal => Boolean(meal))
      .filter((meal) => meal.tags.includes('kid-friendly')).length

    if (totalKidFriendly < 2) {
      notices.push({
        kind: 'info',
        message:
          'We could not reach 2 kid-friendly picks this time, so Dinner Spinner filled the rest with the best matches available.',
      })
    } else if (selectedKidFriendly > 0) {
      notices.push({
        kind: 'info',
        message: 'Kid-friendly mode is on, so we boosted meals that are easier to serve for little ones.',
      })
    }
  }
}

export const canGenerateFullWeek = (meals: Meal[]) => {
  const counts = {
    main: new Set(meals.filter((meal) => meal.types.includes('main')).map((meal) => meal.id)).size,
    soup: new Set(meals.filter((meal) => meal.types.includes('soup')).map((meal) => meal.id)).size,
    snack: new Set(meals.filter((meal) => meal.types.includes('snack')).map((meal) => meal.id)).size,
  }

  return counts.main >= 3 && counts.soup >= 1 && counts.snack >= 1
}

export const generatePlan = ({
  meals,
  currentPlan = EMPTY_PLAN,
  keepLocked = false,
  requireKidFriendly = false,
}: GeneratorOptions): GenerationResult => {
  const notices: PlanNotice[] = []
  const basePlan = currentPlan ?? EMPTY_PLAN
  const plan: GeneratedPlan = {
    items: WEEK_TEMPLATE.map((slot) => {
      const previous = basePlan.items.find((item) => item.slotId === slot.slotId)

      return {
        slotId: slot.slotId,
        type: slot.type,
        locked: keepLocked ? previous?.locked ?? false : false,
        mealId: keepLocked && previous?.locked ? previous.mealId : null,
      }
    }),
    lastUpdated: Date.now(),
  }

  const blockedIds = new Set(
    plan.items.filter((slot) => slot.locked && slot.mealId).map((slot) => slot.mealId as string),
  )

  assignMealsForSlots(plan.items, meals, blockedIds, notices, requireKidFriendly)

  const missingCounts = countMissingByType(plan)
  const missingMessage = formatMissingMessage(missingCounts)

  if (missingMessage) {
    notices.unshift({
      kind: 'error',
      message: `${missingMessage} You can still use the meals already shown.`,
    })
  }

  return { plan, notices }
}
