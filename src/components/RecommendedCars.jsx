import { useEffect, useState } from "react";
import { Car, Gauge, CalendarDays } from "lucide-react";

function RecommendedCars({ dashboard = false }) {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/recommended-cars")
      .then((response) => response.json())
      .then((data) => setCars(data))
      .catch((error) =>
        console.error("Recommended cars error:", error)
      );
  }, []);

  if (dashboard) {
    return (
      <section className="dashboard-card recommended-cars">
        <div className="section-heading">
          <div>
            <h3>Recommended Cars</h3>
            <p>Explore vehicles available in the dataset.</p>
          </div>
        </div>

        <div className="recommended-list">
          {cars.slice(0, 3).map((car, index) => (
            <div className="recommended-item" key={index}>
              <div className="recommended-image">
                <Car size={25} />
              </div>

              <div className="recommended-info">
                <strong>
                  {car.brand} {car.model}
                </strong>

                <span>
                  {car.year} • {car.mileage.toLocaleString()} miles
                </span>
              </div>

              <strong className="recommended-price">
                ${Number(car.price).toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
              </strong>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="predict-page recommended-page">
      <div className="page-heading">
        <div>
          <h1>Recommended Cars</h1>
          <p>Explore vehicles available in the dataset.</p>
        </div>
      </div>

      <div className="recommended-page-grid">
        {cars.map((car, index) => (
          <div className="recommended-page-card" key={index}>
            <div className="recommended-page-icon">
              <Car size={32} />
            </div>

            <h2>
              {car.brand} {car.model}
            </h2>

            <div className="recommended-page-details">
              <span>
                <CalendarDays size={16} />
                {car.year}
              </span>

              <span>
                <Gauge size={16} />
                {car.mileage.toLocaleString()} miles
              </span>
            </div>

            <div className="recommended-page-price">
              <span>Price</span>
              <strong>
                $
                {Number(car.price).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecommendedCars;