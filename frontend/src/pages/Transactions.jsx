import { useEffect, useState } from 'react'
import { getAccounts } from '../api/accounts'
import { getCategories } from '../api/categories'
import { createTransaction, deleteTransaction, getTransactions, updateTransaction } from '../api/transactions'
import './Transactions.css'

const emptyForm = {
  account_id: '',
  category_id: '',
  amount: '',
  type: 'expense',
  description: '',
  date: new Date().toISOString().slice(0, 16),
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [accounts, setAccounts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getTransactions(), getAccounts(), getCategories()]).then(
      ([txRes, accRes, catRes]) => {
        setTransactions(txRes.data)
        setAccounts(accRes.data)
        setCategories(catRes.data)
        if (accRes.data.length > 0)
          setForm((f) => ({ ...f, account_id: accRes.data[0].id }))
      }
    ).finally(() => setLoading(false))
  }, [])

  const filteredCategories = (type) => categories.filter((c) => c.type === type)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value, ...(name === 'type' ? { category_id: '' } : {}) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        ...form,
        account_id: parseInt(form.account_id),
        category_id: form.category_id ? parseInt(form.category_id) : null,
        amount: parseFloat(form.amount),
        date: new Date(form.date).toISOString(),
      }
      const res = await createTransaction(payload)
      setTransactions([res.data, ...transactions])
      setForm(emptyForm)
      setShowForm(false)
    } catch {
      setError('Could not create transaction')
    }
  }

  const startEdit = (tx) => {
    setEditingId(tx.id)
    setEditForm({
      amount: tx.amount,
      category_id: tx.category_id ?? '',
      description: tx.description ?? '',
      date: new Date(tx.date).toISOString().slice(0, 16),
      type: tx.type,
    })
  }

  const handleEditChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value })

  const handleEditSubmit = async (tx) => {
    try {
      const payload = {
        amount: parseFloat(editForm.amount),
        category_id: editForm.category_id ? parseInt(editForm.category_id) : null,
        description: editForm.description || null,
        date: new Date(editForm.date).toISOString(),
      }
      const res = await updateTransaction(tx.id, payload)
      setTransactions(transactions.map((t) => (t.id === tx.id ? res.data : t)))
      setEditingId(null)
    } catch {
      setError('Could not update transaction')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return
    await deleteTransaction(id)
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const getAccountName = (id) => accounts.find((a) => a.id === id)?.name ?? '—'
  const getCategoryName = (id) => categories.find((c) => c.id === id)?.name ?? '—'

  if (loading) return <p className="loading">Loading...</p>

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h2 className="page-title">Transactions</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New transaction'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-row">
            <div className="field">
              <label>Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="field">
              <label>Amount</label>
              <input name="amount" type="number" min="0" step="0.01" value={form.amount} onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Account</label>
              <select name="account_id" value={form.account_id} onChange={handleChange} required>
                <option value="">Select account</option>
                {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Category</label>
              <select name="category_id" value={form.category_id} onChange={handleChange}>
                <option value="">None</option>
                {filteredCategories(form.type).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Date</label>
              <input name="date" type="datetime-local" value={form.date} onChange={handleChange} required />
            </div>
            <div className="field field-description">
              <label>Description</label>
              <input name="description" value={form.description} onChange={handleChange} />
            </div>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary">Create</button>
        </form>
      )}

      {transactions.length === 0 ? (
        <p className="empty">No transactions yet.</p>
      ) : (
        <ul className="transaction-list">
          {transactions.map((tx) =>
            editingId === tx.id ? (
              <li key={tx.id} className="transaction-item editing">
                <div className="edit-row">
                  <div className="field">
                    <label>Amount</label>
                    <input name="amount" type="number" value={editForm.amount} onChange={handleEditChange} />
                  </div>
                  <div className="field">
                    <label>Category</label>
                    <select name="category_id" value={editForm.category_id} onChange={handleEditChange}>
                      <option value="">None</option>
                      {filteredCategories(editForm.type).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>Date</label>
                    <input name="date" type="datetime-local" value={editForm.date} onChange={handleEditChange} />
                  </div>
                  <div className="field field-description">
                    <label>Description</label>
                    <input name="description" value={editForm.description} onChange={handleEditChange} />
                  </div>
                </div>
                <div className="edit-actions">
                  <button className="btn-primary" onClick={() => handleEditSubmit(tx)}>Save</button>
                  <button className="btn-cancel" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </li>
            ) : (
              <li key={tx.id} className="transaction-item">
                <div className="tx-left">
                  <span className={`tx-type-badge ${tx.type}`}>{tx.type}</span>
                  <div className="tx-meta">
                    <span className="tx-desc">{tx.description || '—'}</span>
                    <span className="tx-detail">
                      {getAccountName(tx.account_id)} · {getCategoryName(tx.category_id)} · {new Date(tx.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="tx-right">
                  <span className={`tx-amount ${tx.type}`}>
                    {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()}
                  </span>
                  <button className="btn-edit" onClick={() => startEdit(tx)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(tx.id)}>Delete</button>
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  )
}
