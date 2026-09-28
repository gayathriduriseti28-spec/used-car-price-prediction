import { useEffect, useState } from "react";
import { Settings } from "lucide-react";

function ModelPerformance() {
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/model-performance")
      .then((response) => response.json())
      .then((data) => {
        setModels(data);
      })
      .catch((error) => {
        console.error("Model performance error:", error);
      });
  }, []);

  return (
    <section className="dashboard-card model-performance">
      <div className="card-title">
        <Settings size={22} />
        <h3>Model Performance</h3>
      </div>

      <div className="model-list">
        {models.map((model) => (
          <div className="model-item" key={model.name}>
            <div className="model-header">
              <span>{model.name}</span>
              <strong>{model.score}%</strong>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.max(model.score, 0)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ModelPerformance;