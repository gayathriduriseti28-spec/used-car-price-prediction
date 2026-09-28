import { useEffect, useState } from "react";
import {
  BarChart3,
  Car,
  DollarSign,
  Gauge,
  TrendingUp,
} from "lucide-react";

function MarketAnalytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/market-analytics")
      .then((response) => response.json())
      .then((data) => {
        setAnalytics(data);
      })
      .catch((error) => {
        console.error("Market analytics error:", error);
      });
  }, []);

  if (!analytics) {
    return (
      <div className="predict-page">
        <div className="page-heading">
          <h1>Market Analytics</h1>
          <p>Loading market statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="predict-page market-analytics-page">
      <div className="page-heading">
        <h1>Market Analytics</h1>
        <p>Insights generated from the used car dataset.</p>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-icon">
            <Car size={24} />
          </div>

          <span>Total Vehicles</span>
          <h2>{analytics.total_vehicles.toLocaleString()}</h2>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon">
            <DollarSign size={24} />
          </div>

          <span>Average Price</span>
          <h2>
            ${analytics.average_price.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon">
            <TrendingUp size={24} />
          </div>

          <span>Highest Price</span>
          <h2>
            ${analytics.max_price.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon">
            <Gauge size={24} />
          </div>

          <span>Average Mileage</span>
          <h2>
            {analytics.average_mileage.toLocaleString("en-US")} miles
          </h2>
        </div>
      </div>

      <div className="dashboard-card analytics-section">
        <div className="card-title">
          <BarChart3 size={22} />
          <h3>Fuel Type Distribution</h3>
        </div>

        <div className="fuel-list">
          {analytics.fuel_distribution.map((item) => (
            <div className="fuel-item" key={item.fuel_type}>
              <div className="fuel-header">
                <span>{item.fuel_type}</span>
                <strong>{item.count}</strong>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${item.percentage}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MarketAnalytics;