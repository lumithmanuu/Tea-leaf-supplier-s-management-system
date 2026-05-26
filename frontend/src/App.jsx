import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE_URL = 'http://localhost:3000'

const views = [
  { id: 'dashboard', label: 'Dashboard', short: 'Overview' },
  { id: 'suppliers', label: 'Suppliers', short: 'People & estates' },
  { id: 'grades', label: 'Grades & Rates', short: 'Quality pricing' },
  { id: 'collections', label: 'Collections', short: 'Daily intake' },
  { id: 'reports', label: 'Reports', short: 'Insights' },
]

const emptySupplierForm = {
  name: '',
  phone: '',
  address: '',
  status: 'Active',
}

const emptyGradeForm = {
  gradeName: '',
  ratePerKg: '',
  description: '',
}

const emptyCollectionForm = {
  supplierId: '',
  collectionDate: '',
  items: [
    { gradeId: '', weightKg: '' },
    { gradeId: '', weightKg: '' },
  ],
}

const qualityPoints = {
  'A Grade': 100,
  'B Grade': 75,
  'C Grade': 50,
  Rejected: 0,
}

const monthFormatter = new Intl.DateTimeFormat('en', { month: 'short' })

const formatCurrency = (value) => `Rs. ${Number(value ?? 0).toLocaleString()}`
const formatWeight = (value) => `${Number(value ?? 0).toLocaleString()} kg`
const formatPercent = (value) => `${Number(value ?? 0).toFixed(1)}%`

const qualityLabel = (score) => {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Average'
  return 'Poor'
}

const initialsFromName = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

const getMonthKey = (dateValue) => {
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getFullYear()}-${date.getMonth()}`
}

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [dashboard, setDashboard] = useState(null)
  const [suppliers, setSuppliers] = useState([])
  const [grades, setGrades] = useState([])
  const [collections, setCollections] = useState([])
  const [ranking, setRanking] = useState([])
  const [gradeWise, setGradeWise] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [supplierForm, setSupplierForm] = useState(emptySupplierForm)
  const [gradeForm, setGradeForm] = useState(emptyGradeForm)
  const [collectionForm, setCollectionForm] = useState(emptyCollectionForm)

  useEffect(() => {
    loadData()
  }, [])

  async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
      ...options,
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(text || `Request failed: ${response.status}`)
    }

    if (response.status === 204) {
      return null
    }

    return response.json()
  }

  async function loadData() {
    try {
      setLoading(true)
      setError('')

      const [
        dashboardData,
        suppliersData,
        gradesData,
        collectionsData,
        rankingData,
        gradeWiseData,
      ] = await Promise.all([
        request('/reports/dashboard'),
        request('/suppliers'),
        request('/grades'),
        request('/collections'),
        request('/reports/supplier-ranking'),
        request('/reports/grade-wise'),
      ])

      setDashboard(dashboardData)
      setSuppliers(suppliersData)
      setGrades(gradesData)
      setCollections(collectionsData)
      setRanking(rankingData)
      setGradeWise(gradeWiseData)
    } catch (loadError) {
      setError(
        'Could not load live API data. Make sure the backend is still running on http://localhost:3000.',
      )
      console.error(loadError)
    } finally {
      setLoading(false)
    }
  }

  async function handleSupplierSubmit(event) {
    event.preventDefault()

    try {
      await request('/suppliers', {
        method: 'POST',
        body: JSON.stringify(supplierForm),
      })
      setSupplierForm(emptySupplierForm)
      setMessage('Supplier created successfully.')
      setActiveView('suppliers')
      await loadData()
    } catch (submitError) {
      setError('Failed to create supplier.')
      console.error(submitError)
    }
  }

  async function handleGradeSubmit(event) {
    event.preventDefault()

    try {
      await request('/grades', {
        method: 'POST',
        body: JSON.stringify({
          ...gradeForm,
          ratePerKg: Number(gradeForm.ratePerKg),
        }),
      })
      setGradeForm(emptyGradeForm)
      setMessage('Grade created successfully.')
      setActiveView('grades')
      await loadData()
    } catch (submitError) {
      setError('Failed to create grade.')
      console.error(submitError)
    }
  }

  async function handleCollectionSubmit(event) {
    event.preventDefault()

    try {
      const validItems = collectionForm.items
        .filter((item) => item.gradeId && item.weightKg)
        .map((item) => ({
          gradeId: Number(item.gradeId),
          weightKg: Number(item.weightKg),
        }))

      await request('/collections', {
        method: 'POST',
        body: JSON.stringify({
          supplierId: Number(collectionForm.supplierId),
          collectionDate: collectionForm.collectionDate,
          items: validItems,
        }),
      })

      setCollectionForm(emptyCollectionForm)
      setMessage('Collection recorded successfully.')
      setActiveView('collections')
      await loadData()
    } catch (submitError) {
      setError('Failed to create collection.')
      console.error(submitError)
    }
  }

  function updateCollectionItem(index, field, value) {
    setCollectionForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }))
  }

  function removeCollectionItem(index) {
    setCollectionForm((current) => ({
      ...current,
      items:
        current.items.length === 1
          ? current.items
          : current.items.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const collectionsBySupplier = useMemo(() => {
    const map = new Map()
    for (const collection of collections) {
      const list = map.get(collection.supplierId) ?? []
      list.push(collection)
      map.set(collection.supplierId, list)
    }
    return map
  }, [collections])

  const supplierCards = useMemo(() => {
    return suppliers.map((supplier) => {
      const supplierCollections = collectionsBySupplier.get(supplier.supplierId) ?? []
      const averageQuality =
        supplierCollections.length > 0
          ? supplierCollections.reduce(
              (sum, collection) => sum + Number(collection.qualityScore),
              0,
            ) / supplierCollections.length
          : 0

      return {
        ...supplier,
        averageQuality,
        collectionCount: supplierCollections.length,
      }
    })
  }, [suppliers, collectionsBySupplier])

  const filteredSuppliers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return supplierCards

    return supplierCards.filter((supplier) =>
      [supplier.name, supplier.phone, supplier.address, supplier.status]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term)),
    )
  }, [supplierCards, searchTerm])

  const filteredGrades = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return grades

    return grades.filter((grade) =>
      [grade.gradeName, grade.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term)),
    )
  }, [grades, searchTerm])

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

  const monthlySeries = useMemo(() => {
    const grouped = new Map()

    for (const collection of collections) {
      const key = getMonthKey(collection.collectionDate)
      if (!key) continue

      const current = grouped.get(key) ?? {
        key,
        label: monthFormatter.format(new Date(collection.collectionDate)),
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
    () => [...collections].sort((a, b) => b.collectionDate.localeCompare(a.collectionDate)).slice(0, 5),
    [collections],
  )

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
      const points = qualityPoints[grade.gradeName] ?? 0

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

  const activeMeta = views.find((view) => view.id === activeView)

  return (
    <div className="workspace-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">◌</div>
          <div>
            <strong>Ceylon Leaf</strong>
            <span>Supplier MGMT</span>
          </div>
        </div>

        <div className="nav-group">
          <p className="nav-label">Navigation</p>
          <nav className="nav-list" aria-label="Primary navigation">
            {views.map((view) => (
              <button
                key={view.id}
                type="button"
                className={view.id === activeView ? 'nav-item active' : 'nav-item'}
                onClick={() => setActiveView(view.id)}
              >
                <span className="nav-icon">{view.label[0]}</span>
                {view.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="user-chip">
            <span className="avatar">AK</span>
            <div>
              <strong>Admin Kavindu</strong>
              <span>Factory Officer</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <h1>{activeMeta?.label ?? 'Dashboard'}</h1>
            <p>{activeMeta?.short ?? 'Overview'}</p>
          </div>

          <div className="topbar-actions">
            <label className="searchbar">
              <span>Search</span>
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search suppliers, records..."
              />
            </label>
            <button type="button" className="ghost-button" onClick={loadData}>
              Refresh
            </button>
          </div>
        </header>

        {loading ? <div className="feedback-card">Loading live data...</div> : null}
        {error ? <div className="feedback-card error">{error}</div> : null}
        {message ? <div className="feedback-card success">{message}</div> : null}

        {activeView === 'dashboard' ? (
          <div className="view-stack">
            <section className="hero-card">
              <div className="hero-copy">
                <span className="chip">Harvest season · May 2026</span>
                <h2>From garden to grade, every leaf accounted for.</h2>
                <p>
                  Track multi-grade collections, calculate accurate payments, and surface your
                  best suppliers at a glance.
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
        ) : null}

        {activeView === 'suppliers' ? (
          <div className="view-stack">
            <section className="split-layout">
              <div className="card-grid suppliers-grid">
                {filteredSuppliers.map((supplier) => (
                  <article key={supplier.supplierId} className="supplier-card">
                    <div className="supplier-head">
                      <span className="supplier-avatar">{initialsFromName(supplier.name)}</span>
                      <div>
                        <h3>{supplier.name}</h3>
                        <p>S-{String(supplier.supplierId).padStart(3, '0')}</p>
                      </div>
                    </div>
                    <div className="supplier-meta">
                      <span>{supplier.phone || 'No phone number'}</span>
                      <span>{supplier.address || 'No address yet'}</span>
                    </div>
                    <div className="supplier-quality">
                      <div>
                        <p>Quality score</p>
                        <strong>{Number(supplier.averageQuality).toFixed(0)}</strong>
                      </div>
                      <span className={`status-pill ${supplier.status.toLowerCase()}`}>
                        {supplier.status}
                      </span>
                    </div>
                    <div className="mini-progress">
                      <span style={{ width: `${Math.max(supplier.averageQuality, 8)}%` }} />
                    </div>
                  </article>
                ))}
              </div>

              <form className="surface-card form-card" onSubmit={handleSupplierSubmit}>
                <div className="card-head">
                  <div>
                    <h3>Add supplier</h3>
                    <p>Create a new grower or estate record</p>
                  </div>
                </div>
                <label>
                  Name
                  <input
                    value={supplierForm.name}
                    onChange={(event) =>
                      setSupplierForm((current) => ({ ...current, name: event.target.value }))
                    }
                    required
                  />
                </label>
                <label>
                  Phone
                  <input
                    value={supplierForm.phone}
                    onChange={(event) =>
                      setSupplierForm((current) => ({ ...current, phone: event.target.value }))
                    }
                  />
                </label>
                <label>
                  Address
                  <input
                    value={supplierForm.address}
                    onChange={(event) =>
                      setSupplierForm((current) => ({ ...current, address: event.target.value }))
                    }
                  />
                </label>
                <label>
                  Status
                  <select
                    value={supplierForm.status}
                    onChange={(event) =>
                      setSupplierForm((current) => ({ ...current, status: event.target.value }))
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </label>
                <button type="submit" className="primary-button">
                  Save supplier
                </button>
              </form>
            </section>
          </div>
        ) : null}

        {activeView === 'grades' ? (
          <div className="view-stack">
            <section className="split-layout">
              <div className="card-grid grade-grid">
                {filteredGrades.map((grade) => (
                  <article key={grade.gradeId} className="grade-rate-card">
                    <span className={`grade-strip ${grade.gradeName.toLowerCase().replace(/\s+/g, '-')}`} />
                    <div className="grade-icon">◔</div>
                    <h3>{grade.gradeName}</h3>
                    <p>{grade.description || 'No description available.'}</p>
                    <strong>{formatCurrency(grade.ratePerKg)} / kg</strong>
                    <span>Quality pts: {qualityPoints[grade.gradeName] ?? 0}</span>
                  </article>
                ))}
              </div>

              <form className="surface-card form-card" onSubmit={handleGradeSubmit}>
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
                      setGradeForm((current) => ({ ...current, gradeName: event.target.value }))
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
                      setGradeForm((current) => ({ ...current, ratePerKg: event.target.value }))
                    }
                    required
                  />
                </label>
                <label>
                  Description
                  <input
                    value={gradeForm.description}
                    onChange={(event) =>
                      setGradeForm((current) => ({ ...current, description: event.target.value }))
                    }
                  />
                </label>
                <button type="submit" className="primary-button">
                  Save grade
                </button>
              </form>
            </section>
          </div>
        ) : null}

        {activeView === 'collections' ? (
          <div className="view-stack">
            <section className="surface-card">
              <div className="card-head">
                <div>
                  <h3>New collection</h3>
                  <p>Add grade-wise weights for one supplier</p>
                </div>
              </div>

              <form className="collection-form" onSubmit={handleCollectionSubmit}>
                <div className="collection-top">
                  <label>
                    Supplier
                    <select
                      value={collectionForm.supplierId}
                      onChange={(event) =>
                        setCollectionForm((current) => ({
                          ...current,
                          supplierId: event.target.value,
                        }))
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
                        setCollectionForm((current) => ({
                          ...current,
                          collectionDate: event.target.value,
                        }))
                      }
                      required
                    />
                  </label>
                </div>

                <div className="items-block">
                  <div className="items-head">
                    <strong>Grade items</strong>
                    <button
                      type="button"
                      className="text-button"
                      onClick={() =>
                        setCollectionForm((current) => ({
                          ...current,
                          items: [...current.items, { gradeId: '', weightKg: '' }],
                        }))
                      }
                    >
                      + Add row
                    </button>
                  </div>

                  {collectionForm.items.map((item, index) => {
                    const grade = grades.find(
                      (entry) => String(entry.gradeId) === String(item.gradeId),
                    )
                    const amount =
                      grade && item.weightKg
                        ? Number(grade.ratePerKg) * Number(item.weightKg)
                        : 0

                    return (
                      <div key={index} className="item-line">
                        <select
                          value={item.gradeId}
                          onChange={(event) =>
                            updateCollectionItem(index, 'gradeId', event.target.value)
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
                            updateCollectionItem(index, 'weightKg', event.target.value)
                          }
                        />

                        <div className="line-amount">{formatCurrency(amount)}</div>

                        <button
                          type="button"
                          className="icon-button"
                          onClick={() => removeCollectionItem(index)}
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
                      <strong>{collection.supplier?.name ?? `Supplier ${collection.supplierId}`}</strong>
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
        ) : null}

        {activeView === 'reports' ? (
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
        ) : null}
      </main>
    </div>
  )
}

export default App
