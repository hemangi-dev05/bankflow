import { Link } from "react-router-dom";
import "./ActionTile.css";

export default function ActionTile({ to, icon, label }) {
  return (
    <Link to={to} className="action-tile">
      <span className="action-tile-icon" aria-hidden="true">{icon}</span>
      <span className="action-tile-label">{label}</span>
    </Link>
  );
}
