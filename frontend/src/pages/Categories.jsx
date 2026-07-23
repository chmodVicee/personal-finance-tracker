import { useEffect, useState } from 'react'
import { createCategory, deleteCategory, getCategories, updateCategory } from '../api/categories'
import './Categories.css'

const emptyForm = { name: '', type: 'expense', color: '#6366f1' }

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
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

  const startEdit = (category) => {
    setEditingId(category.id)
    setEditForm({ name: category.name, color: category.color })
  }

  const handleEditChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value })

  const handleEditSubmit = async (id) => {
    try {
      const res = await updateCategory(id, editForm)
      setCategories(categories.map((c) => (c.id === id ? res.data : c)))
      setEditingId(null)
    } catch {
      setError('Could not update category')
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

  const renderCategory = (c) =>
    editingId === c.id ? (
      <li key={c.id} className="category-item editing">
        <div className="edit-row">
          <input name="name" value={editForm.name} onChange={handleEditChange} />
          <div className="color-field">
            <input type="color" name="color" value={editForm.color} onChange={handleEditChange} className="color-input" />
            <span className="color-value">{editForm.color}</span>
          </div>
        </div>
        <div className="edit-actions">
          <button className="btn-primary" onClick={() => handleEditSubmit(c.id)}>Save</button>
          <button className="btn-cancel" onClick={() => setEditingId(null)}>Cancel</button>
        </div>
      </li>
    ) : (
      <li key={c.id} className="category-item">
        <div className="category-left">
          <span className="category-dot" style={{ background: c.color }} />
          <span className="category-name">{c.name}</span>
        </div>
        {c.user_id && (
          <div className="item-actions">
            <button className="btn-edit" onClick={() => startEdit(c)}>Edit</button>
            <button className="btn-delete" onClick={() => handleDelete(c.id)}>Delete</button>
          </div>
        )}
      </li>
    )

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
            <ul className="category-list">{expense.map(renderCategory)}</ul>
          )}
        </div>
        <div className="category-group">
          <h3 className="group-title income-title">Income</h3>
          {income.length === 0 ? (
            <p className="empty">No income categories.</p>
          ) : (
            <ul className="category-list">{income.map(renderCategory)}</ul>
          )}
        </div>
      </div>
    </div>
  )
}
