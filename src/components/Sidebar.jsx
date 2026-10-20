
import {
  Home,
  Search,
  ClipboardList,
  Scale,
  BarChart3,
  Car,
  Info,
} from "lucide-react";

function Sidebar({ setCurrentPage, currentPage }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", Icon: Home },
    { id: "predict", label: "Predict Price", Icon: Search },
    { id: "history", label: "Prediction History", Icon: ClipboardList },
    { id: "compare", label: "Compare Cars", Icon: Scale },
    { id: "analytics", label: "Market Analytics", Icon: BarChart3 },
    { id: "recommended", label: "Recommended Cars", Icon: Car },
    { id: "about", label: "About Project", Icon: Info },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Car size={38} strokeWidth={2} />
        </div>

        <div className="logo-text">
          <span>UsedCar</span>
          <strong>Prediction</strong>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(({ id, label, Icon }) => (
          <a
            key={id}
            href="#"
            className={`nav-item ${currentPage === id ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(id);
            }}
          >
            <Icon size={22} />
            <span>{label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
