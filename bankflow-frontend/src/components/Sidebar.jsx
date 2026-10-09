import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  ArrowLeftRight,
  Send,
  ArrowUpFromLine,
  PiggyBank,
} from "lucide-react";
import "./Sidebar.css";

const ITEMS = [
  { to: "/app", label: "Overview", Icon: LayoutDashboard, end: true },
  { to: "/app/open-account", label: "Open Account", Icon: PlusCircle },
  { to: "/app/transfer", label: "Transfer", Icon: ArrowLeftRight },
  { to: "/app/pay", label: "Pay", Icon: Send },
  { to: "/app/withdraw", label: "Withdraw", Icon: ArrowUpFromLine },
  { to: "/app/piggy-bank", label: "Piggy Bank", Icon: PiggyBank },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav aria-label="Banking actions">
        {ITEMS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
          >
            <span className="sidebar-icon" aria-hidden="true">
              <Icon size={18} strokeWidth={1.75} />
            </span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}