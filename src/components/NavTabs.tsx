type NavTabsProps = {
  active: 'week' | 'meals'
  onChange: (value: 'week' | 'meals') => void
}

export const NavTabs = ({ active, onChange }: NavTabsProps) => (
  <nav className="nav-tabs" aria-label="Main navigation">
    <button
      type="button"
      className={active === 'week' ? 'nav-tabs__button is-active' : 'nav-tabs__button'}
      onClick={() => onChange('week')}
    >
      This Week
    </button>
    <button
      type="button"
      className={active === 'meals' ? 'nav-tabs__button is-active' : 'nav-tabs__button'}
      onClick={() => onChange('meals')}
    >
      My Meals
    </button>
  </nav>
)
