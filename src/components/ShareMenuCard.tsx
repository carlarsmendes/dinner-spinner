import { TYPE_LABELS } from '../constants'
import type { ShareMenuItem } from '../types'

type ShareMenuCardProps = {
  items: ShareMenuItem[]
}

const groupTitle = (type: ShareMenuItem['type']) => {
  if (type === 'main') {
    return 'Main dishes'
  }

  return TYPE_LABELS[type]
}

export const ShareMenuCard = ({ items }: ShareMenuCardProps) => {
  const mains = items.filter((item) => item.type === 'main')
  const others = items.filter((item) => item.type !== 'main')

  return (
    <article className="share-menu-card">
      <div className="share-menu-card__header">
        <p className="share-menu-card__eyebrow">Dinner Spinner 🍽️</p>
        <h2>This week&apos;s menu</h2>
        <p>Family favorites, all set for the week ahead.</p>
      </div>

      <section className="share-menu-card__section">
        <p className="share-menu-card__label">{groupTitle('main')}</p>
        <ul className="share-menu-card__list">
          {mains.map((item) => (
            <li key={item.slotId}>
              <span>{item.mealName ?? 'Open spot'}</span>
            </li>
          ))}
        </ul>
      </section>

      {others.map((item) => (
        <section key={item.slotId} className="share-menu-card__section">
          <p className="share-menu-card__label">{groupTitle(item.type)}</p>
          <div className="share-menu-card__single">{item.mealName ?? 'Open spot'}</div>
        </section>
      ))}

      <footer className="share-menu-card__footer">Spun with Dinner Spinner</footer>
    </article>
  )
}
