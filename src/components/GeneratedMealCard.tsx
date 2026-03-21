import { TAG_LABELS, TYPE_LABELS } from '../constants'
import type { Meal, WeekSlot } from '../types'

type GeneratedMealCardProps = {
  slot: WeekSlot
  meal?: Meal
  label: string
  onToggleLock: (slotId: string) => void
}

export const GeneratedMealCard = ({
  slot,
  meal,
  label,
  onToggleLock,
}: GeneratedMealCardProps) => (
  <article className={slot.locked ? 'week-card is-locked' : 'week-card'}>
    <div className="week-card__topline">
      <span className="pill pill--soft">{label}</span>
      <button
        type="button"
        className={slot.locked ? 'lock-button is-locked' : 'lock-button'}
        onClick={() => onToggleLock(slot.slotId)}
        aria-pressed={slot.locked}
      >
        {slot.locked ? 'Locked' : 'Lock'}
      </button>
    </div>

    {meal ? (
      <>
        <h3>{meal.name}</h3>
        <div className="tag-row">
          <span className="pill">{TYPE_LABELS[slot.type]}</span>
          {meal.tags.map((tag) => (
            <span key={tag} className="pill pill--accent">
              {TAG_LABELS[tag]}
            </span>
          ))}
        </div>
        {meal.ingredients ? <p>{meal.ingredients}</p> : <p>Simple, flexible, and ready for your week.</p>}
      </>
    ) : (
      <>
        <h3>Waiting for a match</h3>
        <p>Add another {TYPE_LABELS[slot.type].toLowerCase()} meal and spin again to fill this spot.</p>
      </>
    )}
  </article>
)
