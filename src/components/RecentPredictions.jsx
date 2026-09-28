import { useEffect, useState } from "react";

function RecentPredictions() {
  const [predictions, setPredictions] = useState([]);

  const loadPredictions = () => {
    const savedHistory =
      JSON.parse(localStorage.getItem("predictionHistory")) || [];

    setPredictions(savedHistory.slice(0, 5));
  };

  useEffect(() => {
    loadPredictions();

    window.addEventListener("predictionUpdated", loadPredictions);

    return () => {
      window.removeEventListener("predictionUpdated", loadPredictions);
    };
  }, []);

  return (
    <div className="dashboard-card recent-predictions">
      <div className="card-header">
        <div>
          <h2>Recent Predictions</h2>
          <p>Your latest car price predictions</p>
        </div>
      </div>

      {predictions.length === 0 ? (
        <div className="empty-state">
          <p>No predictions yet.</p>
        </div>
      ) : (
        <div className="recent-predictions-list">
          {predictions.map((item, index) => (
            <div className="recent-prediction-item" key={index}>
              <div>
                <h3>
                  {item.brand} {item.model}
                </h3>

                <span>
                  {item.year} • {item.mileage} miles
                </span>
              </div>

              <strong>
                $
                {Number(item.price).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentPredictions;