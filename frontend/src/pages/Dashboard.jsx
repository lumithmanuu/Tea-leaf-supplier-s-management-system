import { useMemo } from 'react'
import {
  formatCurrency,
  formatWeight,
  formatPercent,
  qualityLabel,
  getMonthKey,
  getMonthLabel,
} from '../utils/formatters'

export function Dashboard({
  dashboard,
  collections,
  grades,
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

  const recentCollections = useMemo(
    () =>
      [...collections]
        .sort((a, b) => b.collectionDate.localeCompare(a.collectionDate))
        .slice(0, 5),
    [collections],
  )

  const summaryCards = dashboard
    ? [
        {
          label: "Today's collection",
          value: formatWeight(dashboard.todayTotalLeafCollection),
          accent: '+ live',
        },
        {
          label: "Today's payment",
          value: formatCurrency(dashboard.todayTotalSupplierPayment),
          accent: 'factory payout',
        },
        {
          label: 'Month collection',
          value: formatWeight(dashboard.thisMonthTotalCollection),
          accent: 'running total',
        },
        {
          label: 'Avg quality score',
          value: formatPercent(dashboard.averageSupplierQualityScore),
          accent: qualityLabel(dashboard.averageSupplierQualityScore),
        },
      ]
    : []

  return (
    <div className="view-stack">
      <section className="hero-card">
        <div className="hero-copy">
          <span className="chip">Harvest season · May 2026</span>
          <h2>From garden to grade, every leaf accounted for.</h2>
          <p>
            Track multi-grade collections, calculate accurate payments, and surface your best
            suppliers at a glance.
          </p>
        </div>
        <div className="hero-illustration">
          <div className="leaf-shape" />
        </div>
      </section>

      <section className="metric-grid">
        {summaryCards.map((card) => (
          <article key={card.label} className="metric-card">
            <span className="metric-accent">{card.accent}</span>
            <strong>{card.value}</strong>
            <p>{card.label}</p>
          </article>
        ))}
      </section>

      <section className="analytics-grid">
        <article className="surface-card">
          <div className="card-head">
            <div>
              <h3>Monthly collection trend</h3>
              <p>Total kilograms received per month</p>
            </div>
            <span>Last 6 months</span>
          </div>
          <div className="mini-chart">
            {monthlySeries.length > 0 ? (
              monthlySeries.map((point) => (
                <div key={point.key} className="bar-column">
                  <div
                    className="bar-fill"
                    style={{
                      height: `${Math.max(
                        16,
                        (point.totalWeight /
                          Math.max(...monthlySeries.map((entry) => entry.totalWeight), 1)) *
                          180,
                      )}px`,
                    }}
                  />
                  <span>{point.label}</span>
                </div>
              ))
            ) : (
              <p className="empty-state">No collection history yet.</p>
            )}
          </div>
        </article>

        <article className="surface-card">
          <div className="card-head">
            <div>
              <h3>Grade-wise share</h3>
              <p>Distribution from recorded intake</p>
            </div>
          </div>
          <div className="progress-list">
            {gradeShare.map((entry) => (
              <div key={entry.gradeName} className="progress-row">
                <div className="progress-copy">
                  <strong>{entry.gradeName}</strong>
                  <span>{formatWeight(entry.totalWeight)}</span>
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

      <section className="content-grid">
        <article className="surface-card">
          <div className="card-head">
            <div>
              <h3>Recent collections</h3>
              <p>Latest entries from the floor</p>
            </div>
          </div>
          <div className="table-shell">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Supplier</th>
                  <th>Weight</th>
                  <th>Payment</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {recentCollections.map((collection) => (
                  <tr key={collection.collectionId}>
                    <td>{collection.collectionDate}</td>
                    <td>{collection.supplier?.name ?? collection.supplierId}</td>
                    <td>{formatWeight(collection.totalWeight)}</td>
                    <td>{formatCurrency(collection.totalAmount)}</td>
                    <td>
                      <span className="score-pill">
                        {Number(collection.qualityScore).toFixed(0)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="surface-card">
          <div className="card-head">
            <div>
              <h3>Top suppliers</h3>
              <p>By quality score</p>
            </div>
          </div>
          <div className="rank-list">
            {ranking.slice(0, 6).map((entry, index) => (
              <div key={entry.supplierId} className="rank-item">
                <span className="rank-badge">#{index + 1}</span>
                <div className="rank-copy">
                  <strong>{entry.supplierName}</strong>
                  <span>{qualityLabel(entry.averageQualityScore)}</span>
                </div>
                <strong>{Number(entry.averageQualityScore).toFixed(0)}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}
