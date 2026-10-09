import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "./AppLayout.css";

export default function AppLayout() {
  return (
    <div className="page">
      <Navbar />
      <div className="container app-shell">
        <Sidebar />
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
