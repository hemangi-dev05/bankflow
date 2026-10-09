import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const PUBLIC_LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services & Products" },
  { to: "/about", label: "About Us" },
];

const APP_LINKS = [
  { to: "/app", label: "Home", end: true },
  { to: "/app/profile", label: "Your Profile" },
  { to: "/services", label: "Services & Products" },
  { to: "/about", label: "About Us" },
  { to: "/app/transactions", label: "Transaction History" },
  { to: "/app/mini-statement", label: "Mini Statement" },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const links = isAuthenticated ? APP_LINKS : PUBLIC_LINKS;

  function handleLogout() {
    logout();
    setDrawerOpen(false);
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to={isAuthenticated ? "/app" : "/"} className="navbar-logo">
          BANKFLOW
        </NavLink>

        <nav className="navbar-links" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `navbar-link ${isActive ? "navbar-link-active" : ""}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <span className="navbar-user">{user.name.split(" ")[0]}</span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-ghost btn-sm">
                Sign In
              </NavLink>
              <NavLink to="/signup" className="btn btn-primary btn-sm">
                Open Account
              </NavLink>
            </>
          )}
        </div>

        <button
          className="navbar-burger"
          aria-label="Open menu"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {drawerOpen && (
        <div className="navbar-drawer">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className="navbar-drawer-link"
              onClick={() => setDrawerOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <>
              <NavLink to="/app/transfer" className="navbar-drawer-link" onClick={() => setDrawerOpen(false)}>
                Transfer
              </NavLink>
              <NavLink to="/app/pay" className="navbar-drawer-link" onClick={() => setDrawerOpen(false)}>
                Pay
              </NavLink>
              <NavLink to="/app/withdraw" className="navbar-drawer-link" onClick={() => setDrawerOpen(false)}>
                Withdraw
              </NavLink>
              <NavLink to="/app/piggy-bank" className="navbar-drawer-link" onClick={() => setDrawerOpen(false)}>
                Piggy Bank
              </NavLink>
              <button className="btn btn-secondary btn-block" style={{ marginTop: 12 }} onClick={handleLogout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="navbar-drawer-link" onClick={() => setDrawerOpen(false)}>
                Sign In
              </NavLink>
              <NavLink to="/signup" className="btn btn-primary btn-block" style={{ marginTop: 8 }} onClick={() => setDrawerOpen(false)}>
                Open Account
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}
