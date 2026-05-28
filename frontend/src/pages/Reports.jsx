import { useMemo } from 'react'
import {
  formatCurrency,
  formatWeight,
  qualityLabel,
  getMonthKey,
  getMonthLabel,
} from '../utils/formatters'

export function Reports({
  collections,
  gradeWise,
  ranking,
}) {
  const monthlySeries = useMemo(() => {
    const grouped = new Map()

    for (const collection of collections) {
      const key = getMonthKey(collection.collectionDate)
      if (!key) continue

      const current = grouped.get(key) ?? {
        key,
        label: getMonthLabel(collection.collectionDate),
        totalWeight: 0,
        totalAmount: 0,
      }

      current.totalWeight += Number(collection.totalWeight)
      current.totalAmount += Number(collection.totalAmount)
      grouped.set(key, current)
    }

    return [...grouped.values()].sort((a, b) => a.key.localeCompare(b.key)).slice(-6)
  }, [collections])

  const gradeShare = useMemo(() => {
    const totalWeight = gradeWise.reduce(
      (sum, entry) => sum + Number(entry.totalWeight ?? 0),
      0,
    )

    return gradeWise.map((entry) => ({
      ...entry,
      share:
        totalWeight > 0
          ? (Number(entry.totalWeight ?? 0) / totalWeight) * 100
          : 0,
    }))
  }, [gradeWise])

  return (
    <div className="view-stack">
      <section className="analytics-grid">
        <article className="surface-card">
          <div className="card-head">
            <div>
              <h3>Monthly payments</h3>
              <p>Total supplier payments by month</p>
            </div>
          </div>
          <div className="mini-chart payments">
            {monthlySeries.length > 0 ? (
              monthlySeries.map((point) => (
                <div key={point.key} className="bar-column">
                  <div
                    className="bar-fill"
                    style={{
                      height: `${Math.max(
                        16,
                        (point.totalAmount /
                          Math.max(...monthlySeries.map((entry) => entry.totalAmount), 1)) *
                          180,
                      )}px`,
                    }}
                  />
                  <span>{point.label}</span>
                </div>
              ))
            ) : (
              <p className="empty-state">No payment history yet.</p>
            )}
          </div>
        </article>

        <article className="surface-card">
          <div className="card-head">
            <div>
              <h3>Grade-wise share</h3>
              <p>Percentage breakdown</p>
            </div>
          </div>
          <div className="progress-list">
            {gradeShare.map((entry) => (
              <div key={entry.gradeName} className="progress-row">
                <div className="progress-copy">
                  <strong>{entry.gradeName}</strong>
                </div>
                <div className="progress-track">
                  <span
                    className="progress-fill"
                    style={{ width: `${Math.max(entry.share, 6)}%` }}
                  />
                </div>
                <strong>{entry.share.toFixed(0)}%</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="surface-card">
        <div className="card-head">
          <div>
            <h3>Supplier quality ranking</h3>
            <p>All suppliers ordered by quality score</p>
          </div>
        </div>
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Supplier</th>
                <th>Score</th>
                <th>Collections</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((entry, index) => (
                <tr key={entry.supplierId}>
                  <td>#{index + 1}</td>
                  <td>{entry.supplierName}</td>
                  <td>{Number(entry.averageQualityScore).toFixed(0)}</td>
                  <td>{entry.collections}</td>
                  <td>
                    <span className="score-pill muted">
                      {qualityLabel(entry.averageQualityScore)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
