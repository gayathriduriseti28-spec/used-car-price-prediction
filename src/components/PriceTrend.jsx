import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function PriceTrend() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/price-trend")
      .then((response) => response.json())
      .then((result) => {
        setData(result);
      })
      .catch((error) => {
        console.error("Price trend error:", error);
      });
  }, []);

  return (
    <section className="dashboard-card price-trend">
      <div className="card-title">
        <div className="title-icon">▥</div>
        <h3>Price Trend by Model Year</h3>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              stroke="#23384d"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="year"
              stroke="#91a4b8"
            />

            <YAxis
              stroke="#91a4b8"
              tickFormatter={(value) => `${value / 1000}K`}
            />

            <Tooltip
              formatter={(value) => [
                `$${Number(value).toLocaleString()}`,
                "Average Price",
              ]}
            />

            <Line
              type="monotone"
              dataKey="price"
              stroke="#168cff"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#168cff",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default PriceTrend;