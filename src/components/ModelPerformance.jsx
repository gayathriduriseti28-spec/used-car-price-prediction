
import { useEffect, useState } from "react";
import { Settings, Trophy, X } from "lucide-react";

function ModelPerformance() {
  const [models, setModels] = useState([]);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/model-performance")
      .then((response) => {
        if (!response.ok) throw new Error("API error");
        return response.json();
      })
      .then(setModels)
      .catch(() => setError("Unable to load metrics."));
  }, []);

  const bestModel = models.reduce(
    (best, model) =>
      !best || Number(model.RMSE) < Number(best.RMSE)
        ? model
        : best,
    null
  );

  const formatMoney = (value) =>
    "$" + Number(value).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    });

  const ModelDetails = ({ model }) => (
    <div className="model-item">
      <strong>{model.name}</strong>
      <div className="metric-row">
        <span>MAE</span>
        <span>{formatMoney(model.MAE)}</span>
      </div>
      <div className="metric-row">
        <span>RMSE</span>
        <span>{formatMoney(model.RMSE)}</span>
      </div>
      <div className="metric-row">
        <span>R² Score</span>
        <span>{(Number(model.R2) * 100).toFixed(2)}%</span>
      </div>
    </div>
  );

  return (
    <section className="dashboard-card model-performance">
      <div className="card-title">
        <Settings size={22} />
        <h3>Model Performance</h3>
      </div>

      {error && <p>{error}</p>}

      {bestModel && (
        <>
          <div className="best-model">
            <Trophy size={22} />
            <div>
              <strong>Best Model</strong>
              <p>{bestModel.name}</p>
              <small>Lowest RMSE</small>
            </div>
          </div>

          <div className="best-model-metrics">
            <div>
              <span>MAE</span>
              <strong>{formatMoney(bestModel.MAE)}</strong>
            </div>
            <div>
              <span>RMSE</span>
              <strong>{formatMoney(bestModel.RMSE)}</strong>
            </div>
            <div>
              <span>R² Score</span>
              <strong>
                {(Number(bestModel.R2) * 100).toFixed(2)}%
              </strong>
            </div>
          </div>

          <button
            className="view-models-btn"
            onClick={() => setShowAll(true)}
          >
            View All Models
          </button>
        </>
      )}

      {showAll && (
        <div className="models-modal-overlay">
          <div
            className="models-modal"
            role="dialog"
            aria-modal="true"
            aria-label="All model performance metrics"
          >
            <div className="models-modal-header">
              <h3>All Model Results</h3>
              <button
                className="close-models-btn"
                onClick={() => setShowAll(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="model-list">
              {models.map((model) => (
                <ModelDetails key={model.name} model={model} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ModelPerformance;
