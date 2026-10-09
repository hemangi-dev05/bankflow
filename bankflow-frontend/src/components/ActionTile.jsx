import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./ActionTile.css";

export default function ActionTile({ to, Icon, label }) {
  return (
    <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }}>
      <Link to={to} className="action-tile">
        <span className="action-tile-icon" aria-hidden="true">
          <Icon size={22} strokeWidth={1.75} />
        </span>
        <span className="action-tile-label">{label}</span>
      </Link>
    </motion.div>
  );
}