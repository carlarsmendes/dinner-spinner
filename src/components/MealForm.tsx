import { EMPTY_MEAL_DRAFT, MEAL_TYPES, TAG_LABELS, TAGS, TYPE_LABELS } from '../constants'
import type { MealDraft, MealType, Tag } from '../types'

type MealFormProps = {
  draft: MealDraft
  mode: 'create' | 'edit'
  onChange: (next: MealDraft) => void
  onCancelEdit: () => void
  onSubmit: () => void
  validationMessage: string
}

const toggleFromList = <T,>(items: T[], value: T) =>
  items.includes(value) ? items.filter((item) => item !== value) : [...items, value]

export const MealForm = ({
  draft,
  mode,
  onChange,
  onCancelEdit,
  onSubmit,
  validationMessage,
}: MealFormProps) => {
  const updateField = <K extends keyof MealDraft>(field: K, value: MealDraft[K]) => {
    onChange({
      ...draft,
      [field]: value,
    })
  }

  return (
    <section className="panel">
      <div className="panel__heading">
        <div>
          <p className="eyebrow">{mode === 'create' ? 'Add a meal' : 'Edit meal'}</p>
          <h2>{mode === 'create' ? 'Build your family meal board' : 'Update this meal'}</h2>
          <p className="section-copy">
            Quick details now make spinning the week much easier later.
          </p>
        </div>
        {mode === 'edit' ? (
          <button type="button" className="button button--ghost" onClick={onCancelEdit}>
            Cancel
          </button>
        ) : null}
      </div>

      <div className="form-grid">
        <label className="field">
          <span>Meal name</span>
          <input
            value={draft.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Ex. chicken stroganoff"
          />
        </label>

        <fieldset className="field">
          <legend>Meal type</legend>
          <p className="field-hint">Choose one or more so Dinner Spinner knows where this meal fits.</p>
          <div className="choice-row">
            {MEAL_TYPES.map((type) => (
              <label key={type} className={draft.types.includes(type) ? 'choice is-selected' : 'choice'}>
                <input
                  type="checkbox"
                  checked={draft.types.includes(type)}
                  onChange={() => updateField('types', toggleFromList(draft.types, type as MealType))}
                />
                <span>{TYPE_LABELS[type]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="field">
          <legend>Tags</legend>
          <p className="field-hint">Optional, but helpful for quick spins and family-friendly picks.</p>
          <div className="choice-row">
            {TAGS.map((tag) => (
              <label key={tag} className={draft.tags.includes(tag) ? 'choice is-selected' : 'choice'}>
                <input
                  type="checkbox"
                  checked={draft.tags.includes(tag)}
                  onChange={() => updateField('tags', toggleFromList(draft.tags, tag as Tag))}
                />
                <span>{TAG_LABELS[tag]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="field">
          <span>Ingredients</span>
          <textarea
            rows={4}
            value={draft.ingredients}
            onChange={(event) => updateField('ingredients', event.target.value)}
            placeholder="Optional. Add a few notes or a simple ingredient list."
          />
        </label>
      </div>

      {validationMessage ? <p className="form-message">{validationMessage}</p> : null}

      <div className="form-actions">
        <button type="button" className="button" onClick={onSubmit}>
          {mode === 'create' ? 'Save to my meals' : 'Save changes'}
        </button>
        {mode === 'create' ? (
          <button type="button" className="button button--ghost" onClick={() => onChange(EMPTY_MEAL_DRAFT)}>
            Clear
          </button>
        ) : null}
      </div>
    </section>
  )
}
