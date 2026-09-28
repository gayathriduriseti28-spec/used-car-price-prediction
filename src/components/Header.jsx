import {
  Menu,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

function Header() {
  return (
    <header className="header">

      {/* Left Section */}
      <div className="header-left">
        <button className="menu-button">
          <Menu size={27} />
        </button>

        <h1>Used Car Price Prediction</h1>
      </div>

      {/* Right Section */}
      <div className="header-right">

        {/* Search */}
        <div className="search-box">
          <Search size={21} />
          <input
            type="text"
            placeholder="Search cars, brands, models..."
          />
        </div>

        {/* Notification */}
        <button className="notification-button">
          <Bell size={23} />
          <span className="notification-dot"></span>
        </button>

        {/* Profile */}
        <div className="profile">
          <div className="profile-image">
            G
          </div>

          <span className="profile-name">
            Gayathri
          </span>

          <ChevronDown size={18} />
        </div>

      </div>

    </header>
  );
}

export default Header;