import { useEffect, useState } from "react";
import { Tag, Car } from "lucide-react";

function EstimatedPrice() {
  const [latestPrice, setLatestPrice] = useState(null);

  const loadLatestPrice = () => {
    const history =
      JSON.parse(localStorage.getItem("predictionHistory")) || [];

    if (history.length > 0) {
      setLatestPrice(history[0].price);
    } else {
      setLatestPrice(null);
    }
  };

  useEffect(() => {
    loadLatestPrice();

    window.addEventListener("predictionUpdated", loadLatestPrice);

    return () => {
      window.removeEventListener("predictionUpdated", loadLatestPrice);
    };
  }, []);

  const viewPredictionDetails = () => {
    window.dispatchEvent(new Event("openPredictionHistory"));
  };

  return (
    <section className="estimated-price">
      <div className="estimated-icon">
        <Tag size={25} />
      </div>

      <h3>Estimated Price</h3>

      <div className="estimated-value">
        {latestPrice !== null
          ? `$${Number(latestPrice).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          : "$--"}
      </div>

      <p>ML Prediction</p>

      <Car className="estimated-car-icon" size={48} />

      <button
        className="prediction-button"
        onClick={viewPredictionDetails}
      >
        View Prediction Details →
      </button>
    </section>
  );
}

export default EstimatedPrice;