import { useEffect, useMemo, useState } from 'react'
import './App.css'

interface Budget {
  id?: number
  salary: number
  savings: number
  offering: number
  utilities: number
  relationship: number
  relationshipSavings: number
}

declare global {
  interface Window {
    api: {
      getBudget: () => Promise<Budget>
      updateBudget: (data: Budget) => Promise<Budget>
    }
  }
}

interface BudgetForm {
  salary: string
  savings: string
  offering: string
  utilities: string
  relationship: string
  relationshipSavings: string
}

const categories = [
  { key: 'savings', label: 'Savings' },
  { key: 'offering', label: 'Offering' },
  { key: 'utilities', label: 'Utilities' },
  { key: 'relationship', label: 'Relationship' },
  { key: 'relationshipSavings', label: 'Relationship savings' },
]

function App() {
  const [budget, setBudget] = useState<Budget | null>(null)
  const [form, setForm] = useState<BudgetForm>({
    salary: '',
    savings: '',
    offering: '',
    utilities: '',
    relationship: '',
    relationshipSavings: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadBudget()
  }, [])

  async function loadBudget() {
    try {
      const data = await window.api.getBudget()
      setBudget(data)
      setForm({
        salary: String(data.salary),
        savings: String(data.savings),
        offering: String(data.offering),
        utilities: String(data.utilities),
        relationship: String(data.relationship),
        relationshipSavings: String(data.relationshipSavings),
      })
    } catch (e) {
      console.error('Failed to load budget', e)
      setError('Unable to load budget data.')
    }
  }

  const totalPercent = useMemo(() => {
    const values = [
      form.savings,
      form.offering,
      form.utilities,
      form.relationship,
      form.relationshipSavings,
    ]
    return values.reduce((sum, value) => sum + (Number(value) || 0), 0)
  }, [form])

  const totalValid = Math.abs(totalPercent - 100) < 0.01

  function handleFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
    setError(null)
    setMessage(null)
  }

  async function handleSave() {
    if (!totalValid) {
      setError('The category percentages must add up to exactly 100%. Please correct them before saving.')
      setMessage(null)
      return
    }

    if (!budget) {
      setError('Budget data is not available yet.')
      return
    }

    setSaving(true)
    setError(null)
    setMessage(null)

    try {
      const nextBudget: Budget = {
        ...budget,
        salary: Number(form.salary) || 0,
        savings: Number(form.savings) || 0,
        offering: Number(form.offering) || 0,
        utilities: Number(form.utilities) || 0,
        relationship: Number(form.relationship) || 0,
        relationshipSavings: Number(form.relationshipSavings) || 0,
      }

      const updated = await window.api.updateBudget(nextBudget)
      setBudget(updated)
      setForm({
        salary: String(updated.salary),
        savings: String(updated.savings),
        offering: String(updated.offering),
        utilities: String(updated.utilities),
        relationship: String(updated.relationship),
        relationshipSavings: String(updated.relationshipSavings),
      })
      setMessage('Budget saved successfully!')
    } catch (saveError) {
      console.error('Failed to save budget', saveError)
      setError('Unable to save your budget. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const previewSalary = Number(form.salary) || 0
  const previewCategories = categories.map((category) => {
    const key = category.key as keyof BudgetForm
    const percent = Number(form[key]) || 0
    return {
      label: category.label,
      percent,
      amount: previewSalary * (percent / 100),
    }
  })

  return (
    <div className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">AA Budget App v1.0</span>
          <h1>Planning monthly salary allocations</h1>
          <p>Change salary and percentages independently, then save once your total reaches 100%.</p>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <span>Current salary</span>
            <strong>${budget ? budget.salary.toLocaleString() : '—'}</strong>
          </div>
        </div>
      </section>

      <main className="budget-layout">
        <section className="budget-form card">
          <div className="section-header">
            <div>
              <h2>Budget settings</h2>
            </div>
            <div className={`total-pill ${totalValid ? 'valid' : 'invalid'}`}>
              {totalPercent.toFixed(1)}% allocated
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="salary">Salary</label>
            <input className='salary-input-field'
              id="salary"
              name="salary"
              type="number"
              min="0"
              step="100"
              value={form.salary}
              onChange={handleFieldChange}
              placeholder="Enter salary"
            />
          </div>

          <div className="category-grid">
            {categories.map((category) => {
              const name = category.key as keyof BudgetForm
              return (
                <div className="form-row" key={category.key}>
                  <label htmlFor={category.key}>{category.label}</label>
                  <div className="percentage-input">
                    <input
                      id={category.key}
                      name={category.key}
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={form[name]}
                      onChange={handleFieldChange}
                      placeholder="0"
                    />
                    <span>%</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="budget-meter">
            <div className="meter-track">
              <div className="meter-fill" style={{ width: `${Math.min(Math.max(totalPercent, 0), 100)}%` }} />
            </div>
            <div className="meter-meta">
              <span>{totalValid ? 'Ready to save.' : 'Adjust until 100% total.'}</span>
              <span className={totalValid ? 'meter-ok' : 'meter-warning'}>
                {totalValid ? 'Perfect!' : totalPercent < 100 ? `Need ${ (100 - totalPercent).toFixed(1)}% more` : `Remove ${ (totalPercent - 100).toFixed(1)}%`}
              </span>
            </div>
          </div>

          {error && <div className="status-banner error-banner">{error}</div>}
          {message && <div className="status-banner success-banner">{message}</div>}

          <button className="save-button" disabled={saving} onClick={handleSave}>
            {saving ? 'Saving…' : 'Save budget'}
          </button>
        </section>

        <aside className="budget-preview card">
          <div className="preview-header">
            <h2>Preview</h2>
            <span className="salary-allocations-title">Salary & allocations</span>
          </div>

          <div className="preview-row">
            <span className="preview-row-title">Salary</span>
            <strong>${previewSalary.toLocaleString()}</strong>
          </div>

          {previewCategories.map((item) => (
            <div className="preview-row" key={item.label}>
              <span className="preview-row-title">{item.label}</span>
              <strong>
                ${item.amount.toFixed(2)}
              </strong>
            </div>
          ))}

          <div className="preview-footer">
            <span>Allocation status</span>
            <strong>{totalValid ? 'Balanced' : 'Needs adjustment'}</strong>
          </div>
        </aside>
      </main>
    </div>
  )
}

export default App
