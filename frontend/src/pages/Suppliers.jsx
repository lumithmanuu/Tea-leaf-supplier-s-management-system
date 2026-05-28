import { useMemo } from 'react'
import { formatCurrency, initialsFromName } from '../utils/formatters'

export function Suppliers({
  suppliers,
  collections,
  searchTerm,
  supplierForm,
  onFormChange,
  onSubmit,
}) {
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

  return (
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

        <form className="surface-card form-card" onSubmit={onSubmit}>
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
                onFormChange({ ...supplierForm, name: event.target.value })
              }
              required
            />
          </label>
          <label>
            Phone
            <input
              value={supplierForm.phone}
              onChange={(event) =>
                onFormChange({ ...supplierForm, phone: event.target.value })
              }
            />
          </label>
          <label>
            Address
            <input
              value={supplierForm.address}
              onChange={(event) =>
                onFormChange({ ...supplierForm, address: event.target.value })
              }
            />
          </label>
          <label>
            Status
            <select
              value={supplierForm.status}
              onChange={(event) =>
                onFormChange({ ...supplierForm, status: event.target.value })
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
  )
}
