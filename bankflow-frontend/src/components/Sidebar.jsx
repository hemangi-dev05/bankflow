import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const ITEMS = [
  { to: "/app", label: "Overview", icon: "◧", end: true },
  { to: "/app/open-account", label: "Open Account", icon: "+" },
  { to: "/app/transfer", label: "Transfer", icon: "⇄" },
  { to: "/app/pay", label: "Pay", icon: "◈" },
  { to: "/app/withdraw", label: "Withdraw", icon: "↑" },
  { to: "/app/piggy-bank", label: "Piggy Bank", icon: "◎" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav aria-label="Banking actions">
        {ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
          >
            <span className="sidebar-icon" aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
