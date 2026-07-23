import { NavLink } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import './Sidebar.css'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/accounts', label: 'Accounts' },
  { to: '/categories', label: 'Categories' },
  { to: '/transactions', label: 'Transactions' },
]

export default function Sidebar() {
  const logout = useAuthStore((s) => s.logout)

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Finance</span>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={logout}>
        Logout
      </button>
    </aside>
  )
}
