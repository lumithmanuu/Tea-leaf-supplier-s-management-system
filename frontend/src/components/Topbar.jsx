import { VIEWS } from '../utils/constants'

export function Topbar({ activeView, searchTerm, onSearchChange, onRefresh }) {
  const activeMeta = VIEWS.find((view) => view.id === activeView)
  const showSearch = activeView === 'suppliers'

  return (
    <header className="topbar">
      <div>
        <h1>{activeMeta?.label ?? 'Dashboard'}</h1>
        <p>{activeMeta?.short ?? 'Overview'}</p>
      </div>

      <div className="topbar-actions">
        {showSearch && (
          <label className="searchbar">
            <span>Search</span>
            <input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search suppliers, records..."
            />
          </label>
        )}
      </div>
    </header>
  )
}
