import { useEffect, useState } from "react";
import {
  Car,
  CalendarDays,
  Gauge,
  Fuel,
  Settings,
  Trash2,
  History,
  DollarSign,
} from "lucide-react";

function PredictionHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("predictionHistory")) || [];

    setHistory(savedHistory);
  }, []);

  const deletePrediction = (indexToDelete) => {
    const updatedHistory = history.filter(
      (_, index) => index !== indexToDelete
    );

    setHistory(updatedHistory);

    localStorage.setItem(
      "predictionHistory",
      JSON.stringify(updatedHistory)
    );

    window.dispatchEvent(new Event("predictionUpdated"));
  };

  const clearHistory = () => {
    setHistory([]);

    localStorage.removeItem("predictionHistory");

    window.dispatchEvent(new Event("predictionUpdated"));
  };

  return (
    <div className="predict-page history-page">

      {/* HEADER */}
      <div className="page-heading history-heading">
        <div className="heading-with-icon">
          <div className="heading-icon">
            <History size={22} />
          </div>

          <div>
            <h1>Prediction History</h1>
            <p>View and manage your previous car price predictions.</p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            className="clear-history-button"
            onClick={clearHistory}
          >
            <Trash2 size={17} />
            Clear All
          </button>
        )}
      </div>

      {/* EMPTY STATE */}
      {history.length === 0 ? (
        <div className="history-empty-state">
          <div className="empty-history-icon">
            <History size={38} />
          </div>

          <h2>No Predictions Yet</h2>

          <p>
            Your previous car price predictions will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* SUMMARY */}
          <div className="history-summary">
            <div className="history-summary-icon">
              <History size={20} />
            </div>

            <div>
              <span>Total Predictions</span>
              <strong>{history.length}</strong>
            </div>
          </div>

          {/* HISTORY LIST */}
          <div className="prediction-history-list">

            {history.map((item, index) => (
              <div className="history-card" key={index}>

                <div className="history-card-left">

                  <div className="history-car-icon">
                    <Car size={28} />
                  </div>

                  <div className="history-car-content">

                    <div className="history-car-title">
                      <h2>
                        {item.brand} {item.model}
                      </h2>

                      <span className="history-date">
                        {item.date}
                      </span>
                    </div>

                    <div className="history-details">

                      <span>
                        <CalendarDays size={15} />
                        {item.year}
                      </span>

                      <span>
                        <Gauge size={15} />
                        {Number(item.mileage).toLocaleString()} miles
                      </span>

                      {item.fuelType && (
                        <span>
                          <Fuel size={15} />
                          {item.fuelType}
                        </span>
                      )}

                      {item.transmission && (
                        <span>
                          <Settings size={15} />
                          {item.transmission}
                        </span>
                      )}

                    </div>

                  </div>
                </div>

                {/* PRICE */}
                <div className="history-price-section">

                  <div className="history-price-label">
                    <DollarSign size={15} />
                    Estimated Price
                  </div>

                  <h2>
                    $
                    {Number(item.price).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h2>

                  <button
                    className="delete-history-button"
                    onClick={() => deletePrediction(index)}
                    title="Delete prediction"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

              </div>
            ))}

          </div>
        </>
      )}

    </div>
  );
}

export default PredictionHistory;