import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function PriceDistribution() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/price-distribution")
      .then((response) => response.json())
      .then((result) => {
        setData(result);
      })
      .catch((error) => {
        console.error("Price distribution error:", error);
      });
  }, []);

  return (
    <section className="dashboard-card price-distribution">

      <div className="card-title">
        <span className="title-icon">▥</span>
        <h3>Price Distribution</h3>
      </div>

      <div className="distribution-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>

            <CartesianGrid
              stroke="#23384d"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="range"
              stroke="#91a4b8"
            />

            <YAxis
              stroke="#91a4b8"
            />

            <Tooltip />

            <Bar
              dataKey="count"
              fill="#168cff"
              radius={[5, 5, 0, 0]}
            />

          </BarChart>
        </ResponsiveContainer>
      </div>

    </section>
  );
}

export default PriceDistribution;