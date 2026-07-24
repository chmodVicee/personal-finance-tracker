import { useEffect, useState } from 'react'
import { getAccounts } from '../api/accounts'
import { getCategories } from '../api/categories'
import { getTransactions } from '../api/transactions'
import ExpensesByCategory from '../components/dashboard/ExpensesByCategory'
import MonthlyOverview from '../components/dashboard/MonthlyOverview'
import './Dashboard.css'

export default function Dashboard() {
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAccounts(), getTransactions({ limit: 500 }), getCategories()])
      .then(([accRes, txRes, catRes]) => {
        setAccounts(accRes.data)
        setTransactions(txRes.data)
        setCategories(catRes.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0)

  const now = new Date()
  const monthlyTx = transactions.filter((tx) => {
    const d = new Date(tx.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const income = monthlyTx.filter((tx) => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0)
  const expenses = monthlyTx.filter((tx) => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0)
  const recent = [...transactions].slice(0, 5)

  if (loading) return <p className="loading">Loading...</p>

  return (
    <div className="dashboard">
      <h2 className="page-title">Dashboard</h2>

      <div className="summary-cards">
        <div className="card">
          <span className="card-label">Total Balance</span>
          <span className="card-value">{totalBalance.toLocaleString()}</span>
        </div>
        <div className="card">
          <span className="card-label">Monthly Income</span>
          <span className="card-value income">+{income.toLocaleString()}</span>
        </div>
        <div className="card">
          <span className="card-label">Monthly Expenses</span>
          <span className="card-value expense">-{expenses.toLocaleString()}</span>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="section-title">Monthly Overview</h3>
          <MonthlyOverview transactions={transactions} />
        </div>
        <div className="chart-card">
          <h3 className="section-title">Expenses by Category</h3>
          <ExpensesByCategory transactions={transactions} categories={categories} />
        </div>
      </div>

      <div className="recent-section">
        <h3 className="section-title">Recent Transactions</h3>
        {recent.length === 0 ? (
          <p className="empty">No transactions yet.</p>
        ) : (
          <ul className="tx-list">
            {recent.map((tx) => (
              <li key={tx.id} className="tx-item">
                <span className="tx-desc">{tx.description || '—'}</span>
                <span className={`tx-amount ${tx.type}`}>
                  {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
