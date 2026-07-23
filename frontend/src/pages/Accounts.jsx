import { useEffect, useState } from 'react'
import { createAccount, deleteAccount, getAccounts } from '../api/accounts'
import './Accounts.css'

const ACCOUNT_TYPES = ['checking', 'savings', 'credit_card', 'cash']

const emptyForm = { name: '', type: 'checking', balance: '', currency: 'CLP' }

export default function Accounts() {
  const [accounts, setAccounts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAccounts()
      .then((res) => setAccounts(res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await createAccount({ ...form, balance: parseFloat(form.balance) || 0 })
      setAccounts([...accounts, res.data])
      setForm(emptyForm)
      setShowForm(false)
    } catch {
      setError('Could not create account')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this account?')) return
    await deleteAccount(id)
    setAccounts(accounts.filter((a) => a.id !== id))
  }

  if (loading) return <p className="loading">Loading...</p>

  return (
    <div className="accounts-page">
      <div className="page-header">
        <h2 className="page-title">Accounts</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New account'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="account-form">
          <div className="form-row">
            <div className="field">
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                {ACCOUNT_TYPES.map((t) => (
                  <option key={t} value={t}>{t.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Balance</label>
              <input name="balance" type="number" value={form.balance} onChange={handleChange} />
            </div>
            <div className="field">
              <label>Currency</label>
              <input name="currency" value={form.currency} onChange={handleChange} maxLength={3} />
            </div>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary">Create</button>
        </form>
      )}

      {accounts.length === 0 ? (
        <p className="empty">No accounts yet.</p>
      ) : (
        <ul className="account-list">
          {accounts.map((account) => (
            <li key={account.id} className="account-item">
              <div className="account-info">
                <span className="account-name">{account.name}</span>
                <span className="account-type">{account.type.replace('_', ' ')}</span>
              </div>
              <div className="account-right">
                <span className="account-balance">
                  {account.currency} {account.balance.toLocaleString()}
                </span>
                <button className="btn-delete" onClick={() => handleDelete(account.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
