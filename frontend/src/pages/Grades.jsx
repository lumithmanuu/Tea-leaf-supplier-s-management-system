import { useMemo, useState } from 'react'
import { formatCurrency } from '../utils/formatters'
import { QUALITY_POINTS } from '../utils/constants'

export function Grades({
  grades,
  searchTerm,
  gradeForm,
  onFormChange,
  onSubmit,
  onUpdateGrade,
}) {
  const [editingGradeId, setEditingGradeId] = useState(null)
  const [editingRate, setEditingRate] = useState('')

  const filteredGrades = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return grades

    return grades.filter((grade) =>
      [grade.gradeName, grade.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term)),
    )
  }, [grades, searchTerm])

  function startEditing(grade) {
    setEditingGradeId(grade.gradeId)
    setEditingRate(String(grade.ratePerKg))
  }

  function cancelEditing() {
    setEditingGradeId(null)
    setEditingRate('')
  }

  async function saveRate(event, grade) {
    event.preventDefault()
    await onUpdateGrade(grade.gradeId, {
      gradeName: grade.gradeName,
      description: grade.description,
      ratePerKg: editingRate,
    })
    cancelEditing()
  }

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
              {editingGradeId === grade.gradeId ? (
                <form className="grade-rate-editor" onSubmit={(event) => saveRate(event, grade)}>
                  <label>
                    Rate per kg
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editingRate}
                      onChange={(event) => setEditingRate(event.target.value)}
                      required
                    />
                  </label>
                  <div className="grade-card-actions">
                    <button type="submit" className="primary-button compact-button">
                      Save
                    </button>
                    <button
                      type="button"
                      className="ghost-button compact-button muted-button"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <strong>{formatCurrency(grade.ratePerKg)} / kg</strong>
                  <button
                    type="button"
                    className="ghost-button grade-edit-button"
                    onClick={() => startEditing(grade)}
                  >
                    Edit rate
                  </button>
                </>
              )}
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
