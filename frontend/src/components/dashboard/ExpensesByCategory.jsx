import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

export default function ExpensesByCategory({ transactions, categories }) {
  const now = new Date()

  const currentMonthExpenses = transactions.filter((tx) => {
    const d = new Date(tx.date)
    return (
      tx.type === 'expense' &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    )
  })

  const totals = {}
  for (const tx of currentMonthExpenses) {
    const key = tx.category_id ?? 'uncategorized'
    totals[key] = (totals[key] || 0) + tx.amount
  }

  const data = Object.entries(totals).map(([id, value]) => {
    const category = categories.find((c) => c.id === parseInt(id))
    return {
      name: category?.name ?? 'Uncategorized',
      value,
      color: category?.color ?? '#6b7280',
    }
  })

  if (data.length === 0) {
    return <p className="chart-empty">No expenses this month.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          strokeWidth={0}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => value.toLocaleString()}
          contentStyle={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px' }}
          itemStyle={{ color: 'var(--text)' }}
          labelStyle={{ color: 'var(--text-heading)' }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
