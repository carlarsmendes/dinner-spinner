import { useEffect, useMemo, useState } from 'react'
import { GeneratedMealCard } from './components/GeneratedMealCard'
import { MealForm } from './components/MealForm'
import { MealList } from './components/MealList'
import { NavTabs } from './components/NavTabs'
import { Toast } from './components/Toast'
import { EMPTY_MEAL_DRAFT, EMPTY_PLAN, WEEK_TEMPLATE } from './constants'
import { canGenerateFullWeek, generatePlan } from './lib/generator'
import {
  loadKidFriendlyPreference,
  loadMeals,
  loadPlan,
  saveKidFriendlyPreference,
  saveMeals,
  savePlan,
} from './lib/storage'
import type { Meal, MealDraft, PlanNotice } from './types'

const buildMealDraft = (meal: Meal): MealDraft => ({
  name: meal.name,
  types: meal.types,
  tags: meal.tags,
  ingredients: meal.ingredients,
})

const createMealId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `meal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

function App() {
  const [screen, setScreen] = useState<'week' | 'meals'>('week')
  const [meals, setMeals] = useState<Meal[]>(() => loadMeals())
  const [plan, setPlan] = useState(() => loadPlan())
  const [kidFriendlyGoal, setKidFriendlyGoal] = useState(() => loadKidFriendlyPreference())
  const [draft, setDraft] = useState<MealDraft>(EMPTY_MEAL_DRAFT)
  const [editingMealId, setEditingMealId] = useState<string | null>(null)
  const [validationMessage, setValidationMessage] = useState('')
  const [notices, setNotices] = useState<PlanNotice[]>([])
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    saveMeals(meals)
  }, [meals])

  useEffect(() => {
    setPlan((currentPlan) => {
      const nextItems = currentPlan.items.map((item) => {
        if (!item.mealId) {
          return item
        }

        const meal = meals.find((entry) => entry.id === item.mealId)

        if (!meal || !meal.types.includes(item.type)) {
          return {
            ...item,
            mealId: null,
            locked: false,
          }
        }

        return item
      })

      const changed = nextItems.some((item, index) => {
        const previous = currentPlan.items[index]
        return item.mealId !== previous.mealId || item.locked !== previous.locked
      })

      return changed ? { ...currentPlan, items: nextItems } : currentPlan
    })
  }, [meals])

  useEffect(() => {
    savePlan(plan)
  }, [plan])

  useEffect(() => {
    saveKidFriendlyPreference(kidFriendlyGoal)
  }, [kidFriendlyGoal])

  useEffect(() => {
    if (!toastMessage) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setToastMessage('')
    }, 2200)

    return () => window.clearTimeout(timeoutId)
  }, [toastMessage])

  const mealsById = useMemo(
    () =>
      meals.reduce<Record<string, Meal>>((accumulator, meal) => {
        accumulator[meal.id] = meal
        return accumulator
      }, {}),
    [meals],
  )

  const hasFullWeek = canGenerateFullWeek(meals)

  const handleGenerate = (keepLocked: boolean) => {
    const result = generatePlan({
      meals,
      currentPlan: keepLocked ? plan : EMPTY_PLAN,
      keepLocked,
      requireKidFriendly: kidFriendlyGoal,
    })

    setPlan(result.plan)
    setNotices(result.notices)
  }

  const resetForm = () => {
    setDraft(EMPTY_MEAL_DRAFT)
    setEditingMealId(null)
    setValidationMessage('')
  }

  const handleSaveMeal = () => {
    if (!draft.name.trim()) {
      setValidationMessage('Add a meal name so you can spot it quickly later.')
      return
    }

    if (draft.types.length === 0) {
      setValidationMessage('Choose at least one meal type to help Dinner Spinner place it in the week.')
      return
    }

    setValidationMessage('')

    const nextMeal: Meal = {
      id: editingMealId ?? createMealId(),
      name: draft.name.trim(),
      types: draft.types,
      tags: draft.tags,
      ingredients: draft.ingredients.trim(),
    }

    setMeals((currentMeals) => {
      if (editingMealId) {
        return currentMeals.map((meal) => (meal.id === editingMealId ? nextMeal : meal))
      }

      return [nextMeal, ...currentMeals]
    })

    resetForm()
    setScreen('meals')
    setToastMessage(editingMealId ? 'Meal updated.' : 'Meal added to your spinner.')
  }

  const handleEditMeal = (meal: Meal) => {
    setEditingMealId(meal.id)
    setDraft(buildMealDraft(meal))
    setScreen('meals')
    setValidationMessage('')
  }

  const handleDeleteMeal = (mealId: string) => {
    setMeals((currentMeals) => currentMeals.filter((meal) => meal.id !== mealId))
    setPlan((currentPlan) => ({
      ...currentPlan,
      items: currentPlan.items.map((item) =>
        item.mealId === mealId ? { ...item, mealId: null, locked: false } : item,
      ),
    }))
    setNotices([
      {
        kind: 'info',
        message: 'That meal was removed from your library and any open spot in the week is ready for a new match.',
      },
    ])
    setToastMessage('Meal removed.')

    if (editingMealId === mealId) {
      resetForm()
    }
  }

  const toggleLock = (slotId: string) => {
    setPlan((currentPlan) => ({
      ...currentPlan,
      items: currentPlan.items.map((item) =>
        item.slotId === slotId && item.mealId ? { ...item, locked: !item.locked } : item,
      ),
    }))
  }

  const helperMessage = hasFullWeek
    ? 'Your library has enough meals for a full spin.'
    : 'Add at least 3 mains, 1 soup, and 1 snack to unlock a full week.'

  return (
    <div className="app-shell">
      <div className="app-shell__glow app-shell__glow--left" />
      <div className="app-shell__glow app-shell__glow--right" />

      <header className="hero">
        <div>
          <p className="eyebrow">Dinner Spinner</p>
          <h1>Meal planning that feels lighter than “what should we cook?”</h1>
          <p className="hero__copy">
            Save your family favorites, spin a cheerful weekly plan, and lock the meals you want to
            keep.
          </p>
        </div>
        <NavTabs active={screen} onChange={setScreen} />
      </header>

      {screen === 'week' ? (
        <main className="screen-layout">
          <section className="panel panel--hero">
            <div className="panel__heading">
              <div>
                <p className="eyebrow">This Week</p>
                <h2>Pick a plan in a few taps</h2>
              </div>
              <div className="action-row">
                <button type="button" className="button" onClick={() => handleGenerate(false)}>
                  Generate week
                </button>
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={() => handleGenerate(true)}
                  disabled={plan.items.every((item) => !item.mealId)}
                >
                  Regenerate
                </button>
              </div>
            </div>

            <label className="toggle-card">
              <div>
                <strong>Make sure at least 2 meals are kid-friendly</strong>
                <p>If there are not enough tagged meals yet, we will still build the best week possible.</p>
              </div>
              <input
                type="checkbox"
                checked={kidFriendlyGoal}
                onChange={(event) => setKidFriendlyGoal(event.target.checked)}
              />
            </label>

            <p className="helper-copy">{helperMessage}</p>
          </section>

          {plan.items.every((item) => !item.mealId) ? (
            <section className="panel panel--empty">
              <p className="eyebrow">Ready when you are</p>
              <h2>Add a few meals to get your week started</h2>
              <p>
                Once your library has a few mains, a soup, and a snack, Dinner Spinner can build a
                week in seconds.
              </p>
              <button type="button" className="button" onClick={() => setScreen('meals')}>
                Go to My Meals
              </button>
            </section>
          ) : (
            <section className="week-grid">
              {WEEK_TEMPLATE.map((slotTemplate) => {
                const slot = plan.items.find((item) => item.slotId === slotTemplate.slotId)

                if (!slot) {
                  return null
                }

                return (
                  <GeneratedMealCard
                    key={slot.slotId}
                    slot={slot}
                    meal={slot.mealId ? mealsById[slot.mealId] : undefined}
                    label={slotTemplate.label}
                    onToggleLock={toggleLock}
                  />
                )
              })}
            </section>
          )}

          {notices.length > 0 ? (
            <section className="notice-stack">
              {notices.map((notice, index) => (
                <article
                  key={`${notice.kind}-${index}`}
                  className={notice.kind === 'error' ? 'notice notice--error' : 'notice'}
                >
                  {notice.message}
                </article>
              ))}
            </section>
          ) : null}
        </main>
      ) : (
        <main className="screen-layout screen-layout--meals">
          <MealForm
            draft={draft}
            mode={editingMealId ? 'edit' : 'create'}
            onChange={setDraft}
            onCancelEdit={resetForm}
            onSubmit={handleSaveMeal}
            validationMessage={validationMessage}
          />
          <section className="panel">
            <div className="panel__heading">
              <div>
                <p className="eyebrow">My Meals</p>
                <h2>Your library</h2>
              </div>
              <p className="helper-copy">
                {meals.length} saved {meals.length === 1 ? 'meal' : 'meals'} ready to spin.
              </p>
            </div>
            <MealList meals={meals} onEdit={handleEditMeal} onDelete={handleDeleteMeal} />
          </section>
        </main>
      )}

      {toastMessage ? <Toast message={toastMessage} /> : null}
    </div>
  )
}

export default App
