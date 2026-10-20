
import { Menu, Search } from "lucide-react";

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-button">
          <Menu size={27} />
        </button>

        <h1>Used Car Price Prediction</h1>
      </div>

      <div className="header-right">
        <div className="search-box">
          <Search size={21} />
          <input
            type="text"
            placeholder="Search cars, brands, models..."
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
