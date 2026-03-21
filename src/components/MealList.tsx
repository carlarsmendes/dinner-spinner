import { TAG_LABELS, TYPE_LABELS } from '../constants'
import type { Meal } from '../types'

type MealListProps = {
  meals: Meal[]
  onEdit: (meal: Meal) => void
  onDelete: (mealId: string) => void
}

export const MealList = ({ meals, onEdit, onDelete }: MealListProps) => {
  if (meals.length === 0) {
    return (
      <section className="panel panel--empty">
        <p className="eyebrow">Meal library</p>
        <h2>Add your first family favorite</h2>
        <p>Once you save a few meals here, Dinner Spinner can start building your week in seconds.</p>
      </section>
    )
  }

  return (
    <section className="meal-grid">
      {meals.map((meal) => (
        <article key={meal.id} className="meal-card">
          <div className="meal-card__header">
            <div>
              <h3>{meal.name}</h3>
              <div className="tag-row">
                {meal.types.map((type) => (
                  <span key={type} className="pill">
                    {TYPE_LABELS[type]}
                  </span>
                ))}
                {meal.tags.map((tag) => (
                  <span key={tag} className="pill pill--accent">
                    {TAG_LABELS[tag]}
                  </span>
                ))}
              </div>
            </div>
            <div className="meal-card__actions">
              <button type="button" className="button button--ghost" onClick={() => onEdit(meal)}>
                Edit
              </button>
              <button type="button" className="button button--ghost-danger" onClick={() => onDelete(meal.id)}>
                Delete
              </button>
            </div>
          </div>
          <p>{meal.ingredients || 'No ingredient notes yet.'}</p>
        </article>
      ))}
    </section>
  )
}
