export const API_BASE_URL = 'http://localhost:3000'

export const VIEWS = [
  { id: 'dashboard', label: 'Dashboard', short: 'Overview' },
  { id: 'suppliers', label: 'Suppliers', short: 'People & estates' },
  { id: 'grades', label: 'Grades & Rates', short: 'Quality pricing' },
  { id: 'collections', label: 'Collections', short: 'Daily intake' },
  { id: 'reports', label: 'Reports', short: 'Insights' },
]

export const EMPTY_SUPPLIER_FORM = {
  name: '',
  phone: '',
  address: '',
  status: 'Active',
}

export const EMPTY_GRADE_FORM = {
  gradeName: '',
  ratePerKg: '',
  description: '',
}

export const EMPTY_COLLECTION_FORM = {
  supplierId: '',
  collectionDate: '',
  items: [
    { gradeId: '', weightKg: '' },
    { gradeId: '', weightKg: '' },
  ],
}

export const QUALITY_POINTS = {
  'A Grade': 100,
  'B Grade': 75,
  'C Grade': 50,
  Rejected: 0,
}
