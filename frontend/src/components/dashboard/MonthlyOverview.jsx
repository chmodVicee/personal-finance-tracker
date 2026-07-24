import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function MonthlyOverview({ transactions }) {
  const now = new Date()

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    return { month: d.getMonth(), year: d.getFullYear(), label: MONTH_NAMES[d.getMonth()] }
  })

  const data = months.map(({ month, year, label }) => {
    const monthTx = transactions.filter((tx) => {
      const d = new Date(tx.date)
      return d.getMonth() === month && d.getFullYear() === year
    })
    const income = monthTx.filter((tx) => tx.type === 'income').reduce((s, tx) => s + tx.amount, 0)
    const expenses = monthTx.filter((tx) => tx.type === 'expense').reduce((s, tx) => s + tx.amount, 0)
    return { label, income, expenses }
  })

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} barCategoryGap="30%">
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => new Intl.NumberFormat('en', { notation: 'compact' }).format(v)} width={45} />
        <Tooltip
          formatter={(value) => value.toLocaleString()}
          contentStyle={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px' }}
          itemStyle={{ color: 'var(--text)' }}
          labelStyle={{ color: 'var(--text-heading)' }}
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
        />
        <Bar dataKey="income" name="Income" fill="var(--green)" radius={[3, 3, 0, 0]} />
        <Bar dataKey="expenses" name="Expenses" fill="var(--red)" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
