import { useMemo } from 'react'
import { formatCurrency } from '../utils/formatters'
import { QUALITY_POINTS } from '../utils/constants'

export function Grades({
  grades,
  searchTerm,
  gradeForm,
  onFormChange,
  onSubmit,
}) {
  const filteredGrades = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return grades

    return grades.filter((grade) =>
      [grade.gradeName, grade.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term)),
    )
  }, [grades, searchTerm])

  return (
    <div className="view-stack">
      <section className="split-layout">
        <div className="card-grid grade-grid">
          {filteredGrades.map((grade) => (
            <article key={grade.gradeId} className="grade-rate-card">
              <span
                className={`grade-strip ${grade.gradeName
                  .toLowerCase()
                  .replace(/\s+/g, '-')}`}
              />
              <div className="grade-icon">◔</div>
              <h3>{grade.gradeName}</h3>
              <p>{grade.description || 'No description available.'}</p>
              <strong>{formatCurrency(grade.ratePerKg)} / kg</strong>
              <span>Quality pts: {QUALITY_POINTS[grade.gradeName] ?? 0}</span>
            </article>
          ))}
        </div>

        <form className="surface-card form-card" onSubmit={onSubmit}>
          <div className="card-head">
            <div>
              <h3>Add grade</h3>
              <p>Define a new quality grade and payment rate</p>
            </div>
          </div>
          <label>
            Grade name
            <input
              value={gradeForm.gradeName}
              onChange={(event) =>
                onFormChange({ ...gradeForm, gradeName: event.target.value })
              }
              required
            />
          </label>
          <label>
            Rate per kg
            <input
              type="number"
              step="0.01"
              min="0"
              value={gradeForm.ratePerKg}
              onChange={(event) =>
                onFormChange({ ...gradeForm, ratePerKg: event.target.value })
              }
              required
            />
          </label>
          <label>
            Description
            <input
              value={gradeForm.description}
              onChange={(event) =>
                onFormChange({ ...gradeForm, description: event.target.value })
              }
            />
          </label>
          <button type="submit" className="primary-button">
            Save grade
          </button>
        </form>
      </section>
    </div>
  )
}
