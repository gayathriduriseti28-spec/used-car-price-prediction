import {
  Home,
  Search,
  ClipboardList,
  Scale,
  BarChart3,
  Car,
  Info,
  LogOut,
} from "lucide-react";

function Sidebar({ setCurrentPage, currentPage }) {
  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Car size={38} strokeWidth={2} />
        </div>

        <div className="logo-text">
          <span>UsedCar</span>
          <strong>Prediction</strong>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        <a
  href="#"
  className={`nav-item ${
  currentPage === "dashboard" ? "active" : ""
}`}
  onClick={(e) => {
    e.preventDefault();
    setCurrentPage("dashboard");
  }}
>
          <Home size={22} />
          <span>Dashboard</span>
        </a>

        <a
  href="#"
  className={`nav-item ${
  currentPage === "predict" ? "active" : ""
}`}
  onClick={(e) => {
    e.preventDefault();
    setCurrentPage("predict");
  }}
>
  <Search size={22} />
  <span>Predict Price</span>
</a>
<a
  href="#"
  className={`nav-item ${
    currentPage === "history" ? "active" : ""
  }`}
  onClick={(e) => {
    e.preventDefault();
    setCurrentPage("history");
  }}
>
  <ClipboardList size={22} />
  <span>Prediction History</span>
</a>
<a
  href="#"
  className={`nav-item ${
    currentPage === "compare" ? "active" : ""
  }`}
  onClick={(e) => {
    e.preventDefault();
    setCurrentPage("compare");
  }}
>
  <Scale size={22} />
  <span>Compare Cars</span>
</a>

        <a
  href="#"
  className={`nav-item ${
    currentPage === "analytics" ? "active" : ""
  }`}
  onClick={(e) => {
    e.preventDefault();
    setCurrentPage("analytics");
  }}
>
          <BarChart3 size={22} />
          <span>Market Analytics</span>
        </a>

        <a
  href="#"
  className={`nav-item ${
    currentPage === "recommended" ? "active" : ""
  }`}
  onClick={(e) => {
    e.preventDefault();
    setCurrentPage("recommended");
  }}
>
          <Car size={22} />
          <span>Recommended Cars</span>
        </a>
<a
  href="#"
  className={`nav-item ${
    currentPage === "about" ? "active" : ""
  }`}
  onClick={(e) => {
    e.preventDefault();
    setCurrentPage("about");
  }}
>
  <Info size={22} />
  <span>About Project</span>
</a>

      </nav>

      {/* Logout */}
      <div className="sidebar-bottom">
        <a href="#" className="nav-item">
          <LogOut size={22} />
          <span>Logout</span>
        </a>
      </div>

    </aside>
  );
}

export default Sidebar;