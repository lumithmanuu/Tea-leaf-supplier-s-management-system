import { useMemo } from 'react'
import { formatCurrency, formatWeight, qualityLabel } from '../utils/formatters'
import { QUALITY_POINTS } from '../utils/constants'

export function Collections({
  suppliers,
  grades,
  collections,
  searchTerm,
  collectionForm,
  onFormChange,
  onItemChange,
  onRemoveItem,
  onAddItem,
  onSubmit,
}) {
  const collectionPreview = useMemo(() => {
    const gradesById = new Map(grades.map((grade) => [String(grade.gradeId), grade]))
    let totalWeight = 0
    let totalAmount = 0
    let weightedQuality = 0

    for (const item of collectionForm.items) {
      const grade = gradesById.get(item.gradeId)
      const weight = Number(item.weightKg || 0)
      if (!grade || !weight) continue

      const amount = weight * Number(grade.ratePerKg)
      const points = QUALITY_POINTS[grade.gradeName] ?? 0

      totalWeight += weight
      totalAmount += amount
      weightedQuality += weight * points
    }

    const qualityScore = totalWeight > 0 ? weightedQuality / totalWeight : 0

    return {
      totalWeight,
      totalAmount,
      qualityScore,
      qualityGrade: qualityLabel(qualityScore),
    }
  }, [collectionForm.items, grades])

  const filteredCollections = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return collections

    return collections.filter((collection) =>
      [
        collection.collectionDate,
        collection.supplier?.name,
        String(collection.totalAmount),
        String(collection.totalWeight),
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term)),
    )
  }, [collections, searchTerm])

  return (
    <div className="view-stack">
      <section className="surface-card">
        <div className="card-head">
          <div>
            <h3>New collection</h3>
            <p>Add grade-wise weights for one supplier</p>
          </div>
        </div>

        <form className="collection-form" onSubmit={onSubmit}>
          <div className="collection-top">
            <label>
              Supplier
              <select
                value={collectionForm.supplierId}
                onChange={(event) =>
                  onFormChange({
                    ...collectionForm,
                    supplierId: event.target.value,
                  })
                }
                required
              >
                <option value="">Select supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.supplierId} value={supplier.supplierId}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Collection date
              <input
                type="date"
                value={collectionForm.collectionDate}
                onChange={(event) =>
                  onFormChange({
                    ...collectionForm,
                    collectionDate: event.target.value,
                  })
                }
                required
              />
            </label>
          </div>

          <div className="items-block">
            <div className="items-head">
              <strong>Grade items</strong>
              <button type="button" className="text-button" onClick={onAddItem}>
                + Add row
              </button>
            </div>

            {collectionForm.items.map((item, index) => {
              const grade = grades.find(
                (entry) => String(entry.gradeId) === String(item.gradeId),
              )
              const amount =
                grade && item.weightKg ? Number(grade.ratePerKg) * Number(item.weightKg) : 0

              return (
                <div key={index} className="item-line">
                  <select
                    value={item.gradeId}
                    onChange={(event) =>
                      onItemChange(index, 'gradeId', event.target.value)
                    }
                  >
                    <option value="">Select grade</option>
                    {grades.map((gradeOption) => (
                      <option key={gradeOption.gradeId} value={gradeOption.gradeId}>
                        {gradeOption.gradeName} - {formatCurrency(gradeOption.ratePerKg)}/kg
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Weight in kg"
                    value={item.weightKg}
                    onChange={(event) =>
                      onItemChange(index, 'weightKg', event.target.value)
                    }
                  />

                  <div className="line-amount">{formatCurrency(amount)}</div>

                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => onRemoveItem(index)}
                  >
                    x
                  </button>
                </div>
              )
            })}
          </div>

          <button type="submit" className="primary-button wide">
            Save collection
          </button>
        </form>
      </section>

      <section className="payment-banner">
        <div>
          <span>Calculated payment</span>
          <strong>{formatCurrency(collectionPreview.totalAmount)}</strong>
          <p>for {formatWeight(collectionPreview.totalWeight)} of green leaf</p>
        </div>
        <div className="quality-box">
          <span>Quality score</span>
          <strong>{Number(collectionPreview.qualityScore).toFixed(0)}</strong>
          <p>{collectionPreview.qualityGrade}</p>
        </div>
      </section>

      <section className="surface-card">
        <div className="card-head">
          <div>
            <h3>Recent entries</h3>
            <p>Latest recorded leaf collections</p>
          </div>
        </div>
        <div className="entry-list">
          {filteredCollections.slice(0, 6).map((collection) => (
            <div key={collection.collectionId} className="entry-row">
              <div>
                <strong>
                  {collection.supplier?.name ?? `Supplier ${collection.supplierId}`}
                </strong>
                <span>
                  {collection.collectionDate} · {formatWeight(collection.totalWeight)}
                </span>
              </div>
              <strong>{formatCurrency(collection.totalAmount)}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
