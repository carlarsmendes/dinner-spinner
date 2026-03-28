import { useEffect, useMemo, useRef, useState } from 'react'
import { GeneratedMealCard } from './components/GeneratedMealCard'
import { MealForm } from './components/MealForm'
import { MealList } from './components/MealList'
import { NavTabs } from './components/NavTabs'
import { ShareMenuCard } from './components/ShareMenuCard'
import { Toast } from './components/Toast'
import { EMPTY_MEAL_DRAFT, EMPTY_PLAN, WEEK_TEMPLATE } from './constants'
import { canGenerateFullWeek, generatePlan } from './lib/generator'
import { shareWeeklyMenu } from './lib/shareMenu'
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
  const [isSharing, setIsSharing] = useState(false)
  const shareCardRef = useRef<HTMLDivElement | null>(null)

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

  const shareMenuItems = useMemo(
    () =>
      WEEK_TEMPLATE.map((slot) => {
        const planItem = plan.items.find((item) => item.slotId === slot.slotId)
        const mealName = planItem?.mealId ? mealsById[planItem.mealId]?.name ?? null : null

        return {
          slotId: slot.slotId,
          slotLabel: slot.label,
          type: slot.type,
          mealName,
        }
      }),
    [mealsById, plan.items],
  )

  const hasFullWeek = canGenerateFullWeek(meals)
  const hasGeneratedMenu = plan.items.some((item) => item.mealId)

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

  const handleShareMenu = async () => {
    if (!shareCardRef.current || !hasGeneratedMenu) {
      return
    }

    setIsSharing(true)

    try {
      const result = await shareWeeklyMenu({
        cardNode: shareCardRef.current,
        items: shareMenuItems,
      })

      if (result.status === 'shared') {
        setToastMessage('Menu ready to share.')
      } else if (result.status === 'shared-text') {
        setToastMessage('Share sheet opened.')
      } else if (result.status === 'downloaded-and-copied') {
        setToastMessage('Image downloaded and menu text copied.')
      } else if (result.status === 'downloaded') {
        setToastMessage('Menu image downloaded.')
      } else if (result.status === 'copied') {
        setToastMessage('Menu text copied.')
      } else if (result.status === 'cancelled') {
        setToastMessage('')
      }
    } catch {
      setToastMessage('Could not share right now. Please try again.')
    } finally {
      setIsSharing(false)
    }
  }

  const helperMessage = hasFullWeek
    ? 'Your library has enough meals for a full spin.'
    : 'Add at least 3 mains, 1 soup, and 1 snack to unlock a full week.'

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero__content">
          <p className="hero__eyebrow">Weekly family ritual</p>
          <p className="hero__brand">Dinner Spinner</p>
          <h1>Make this week&apos;s menu feel easy.</h1>
          <p className="hero__copy">
            Save family favorites, spin a fresh mix, and keep the meals you already love with one tap.
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
                <h2>This week&apos;s menu</h2>
                <p className="section-copy">Spin a cheerful starting point, then keep the picks that already feel right.</p>
              </div>
              <div className="action-row">
                <button type="button" className="button" onClick={() => handleGenerate(true)}>
                  Spin the week
                </button>
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={handleShareMenu}
                  disabled={!hasGeneratedMenu || isSharing}
                >
                  {isSharing ? 'Preparing menu...' : 'Share menu'}
                </button>
              </div>
            </div>

            <label className="toggle-card">
              <div className="toggle-card__copy">
                <span className="toggle-card__emoji" aria-hidden="true">
                  🧒
                </span>
                <div>
                  <strong>Aim for at least 2 kid-friendly meals</strong>
                  <p>If there are not enough tagged meals yet, Dinner Spinner still makes the best possible mix.</p>
                </div>
              </div>
              <span className={kidFriendlyGoal ? 'toggle-switch is-on' : 'toggle-switch'}>
                <input
                  type="checkbox"
                  checked={kidFriendlyGoal}
                  onChange={(event) => setKidFriendlyGoal(event.target.checked)}
                />
                <span className="toggle-switch__track" aria-hidden="true">
                  <span className="toggle-switch__thumb" />
                </span>
              </span>
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
                Head to My Meals
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
                <h2>Your kitchen</h2>
                <p className="section-copy">A calm little home for the meals your family actually eats.</p>
              </div>
              <p className="count-badge">
                {meals.length} saved {meals.length === 1 ? 'meal' : 'meals'}
              </p>
            </div>
            <MealList meals={meals} onEdit={handleEditMeal} onDelete={handleDeleteMeal} />
          </section>
        </main>
      )}

      <div className="share-capture-shell" aria-hidden="true">
        <div ref={shareCardRef}>
          <ShareMenuCard items={shareMenuItems} />
        </div>
      </div>

      {toastMessage ? <Toast message={toastMessage} /> : null}
    </div>
  )
}

export default App
