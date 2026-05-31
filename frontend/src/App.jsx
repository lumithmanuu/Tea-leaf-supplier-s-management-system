import { useEffect, useState } from 'react'
import './App.css'
import './auth.css'
import { Sidebar } from './components/Sidebar'
import { Topbar } from './components/Topbar'
import { Dashboard } from './pages/Dashboard'
import { Suppliers } from './pages/Suppliers'
import { Grades } from './pages/Grades'
import { Collections } from './pages/Collections'
import { Reports } from './pages/Reports'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { request, loadAllData } from './utils/api'
import { authUtils } from './utils/auth'
import {
  VIEWS,
  EMPTY_SUPPLIER_FORM,
  EMPTY_GRADE_FORM,
  EMPTY_COLLECTION_FORM,
} from './utils/constants'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authView, setAuthView] = useState('login') // 'login' or 'signup'
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
  const [supplierForm, setSupplierForm] = useState(EMPTY_SUPPLIER_FORM)
  const [gradeForm, setGradeForm] = useState(EMPTY_GRADE_FORM)
  const [collectionForm, setCollectionForm] = useState(EMPTY_COLLECTION_FORM)

  // Check authentication status on mount
  useEffect(() => {
    if (authUtils.isAuthenticated()) {
      setIsAuthenticated(true)
      loadData()
    } else {
      setLoading(false)
    }

    // Handle hash-based routing for auth pages
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash === 'signup') {
        setAuthView('signup')
      } else {
        setAuthView('login')
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

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
      ] = await loadAllData()

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
      setSupplierForm(EMPTY_SUPPLIER_FORM)
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
      setGradeForm(EMPTY_GRADE_FORM)
      setMessage('Grade created successfully.')
      setActiveView('grades')
      await loadData()
    } catch (submitError) {
      setError('Failed to create grade.')
      console.error(submitError)
    }
  }

  async function handleGradeUpdate(gradeId, updates) {
    try {
      await request(`/grades/${gradeId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...updates,
          ratePerKg: Number(updates.ratePerKg),
        }),
      })
      setMessage('Grade rate updated successfully.')
      setError('')
      await loadData()
    } catch (submitError) {
      setError('Failed to update grade rate.')
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

      setCollectionForm(EMPTY_COLLECTION_FORM)
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

  function addCollectionItem() {
    setCollectionForm((current) => ({
      ...current,
      items: [...current.items, { gradeId: '', weightKg: '' }],
    }))
  }

  function handleLoginSuccess() {
    setIsAuthenticated(true)
    setActiveView('dashboard')
    loadData()
  }

  function handleLogout() {
    authUtils.logout()
    setIsAuthenticated(false)
    setActiveView('dashboard')
    setSearchTerm('')
    setDashboard(null)
    setSuppliers([])
    setGrades([])
    setCollections([])
    setRanking([])
    setGradeWise([])
    window.location.hash = '#login'
  }

  return (
    <>
      {!isAuthenticated ? (
        // Authentication Pages
        <>
          {authView === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}
          {authView === 'signup' && <Signup onSignupSuccess={handleLoginSuccess} />}
        </>
      ) : (
        // Main App
        <div className="workspace-shell">
          <Sidebar
            activeView={activeView}
            onViewChange={setActiveView}
            onLogout={handleLogout}
          />

          <main className="main-panel">
            <Topbar
              activeView={activeView}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onRefresh={loadData}
            />

            {loading ? <div className="feedback-card">Loading live data...</div> : null}
            {error ? <div className="feedback-card error">{error}</div> : null}
            {message ? <div className="feedback-card success">{message}</div> : null}

            {activeView === 'dashboard' && (
              <Dashboard
                dashboard={dashboard}
                collections={collections}
                grades={grades}
                gradeWise={gradeWise}
                ranking={ranking}
              />
            )}

            {activeView === 'suppliers' && (
              <Suppliers
                suppliers={suppliers}
                collections={collections}
                searchTerm={searchTerm}
                supplierForm={supplierForm}
                onFormChange={setSupplierForm}
                onSubmit={handleSupplierSubmit}
              />
            )}

            {activeView === 'grades' && (
              <Grades
                grades={grades}
                searchTerm={searchTerm}
                gradeForm={gradeForm}
                onFormChange={setGradeForm}
                onSubmit={handleGradeSubmit}
                onUpdateGrade={handleGradeUpdate}
              />
            )}

            {activeView === 'collections' && (
              <Collections
                suppliers={suppliers}
                grades={grades}
                collections={collections}
                searchTerm={searchTerm}
                collectionForm={collectionForm}
                onFormChange={setCollectionForm}
                onItemChange={updateCollectionItem}
                onRemoveItem={removeCollectionItem}
                onAddItem={addCollectionItem}
                onSubmit={handleCollectionSubmit}
              />
            )}

            {activeView === 'reports' && (
              <Reports
                collections={collections}
                gradeWise={gradeWise}
                ranking={ranking}
              />
            )}
          </main>
        </div>
      )}
    </>
  )
}

export default App
