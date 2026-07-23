import { useEffect, useState } from 'react'
import { createCategory, deleteCategory, getCategories } from '../api/categories'
import './Categories.css'

const emptyForm = { name: '', type: 'expense', color: '#6366f1' }

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await createCategory(form)
      setCategories([...categories, res.data])
      setForm(emptyForm)
      setShowForm(false)
    } catch {
      setError('Could not create category')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return
    try {
      await deleteCategory(id)
      setCategories(categories.filter((c) => c.id !== id))
    } catch {
      setError('Cannot delete a default category')
    }
  }

  const income = categories.filter((c) => c.type === 'income')
  const expense = categories.filter((c) => c.type === 'expense')

  if (loading) return <p className="loading">Loading...</p>

  return (
    <div className="categories-page">
      <div className="page-header">
        <h2 className="page-title">Categories</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New category'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-row">
            <div className="field">
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="field">
              <label>Color</label>
              <div className="color-field">
                <input type="color" name="color" value={form.color} onChange={handleChange} className="color-input" />
                <span className="color-value">{form.color}</span>
              </div>
            </div>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary">Create</button>
        </form>
      )}

      <div className="category-groups">
        <div className="category-group">
          <h3 className="group-title expense-title">Expenses</h3>
          {expense.length === 0 ? (
            <p className="empty">No expense categories.</p>
          ) : (
            <ul className="category-list">
              {expense.map((c) => (
                <li key={c.id} className="category-item">
                  <div className="category-left">
                    <span className="category-dot" style={{ background: c.color }} />
                    <span className="category-name">{c.name}</span>
                  </div>
                  {c.user_id && (
                    <button className="btn-delete" onClick={() => handleDelete(c.id)}>Delete</button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="category-group">
          <h3 className="group-title income-title">Income</h3>
          {income.length === 0 ? (
            <p className="empty">No income categories.</p>
          ) : (
            <ul className="category-list">
              {income.map((c) => (
                <li key={c.id} className="category-item">
                  <div className="category-left">
                    <span className="category-dot" style={{ background: c.color }} />
                    <span className="category-name">{c.name}</span>
                  </div>
                  {c.user_id && (
                    <button className="btn-delete" onClick={() => handleDelete(c.id)}>Delete</button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
