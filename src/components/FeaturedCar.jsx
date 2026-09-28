import { useEffect, useState } from "react";
import { getCarImage } from "../utils/carImages";
import { Share2 } from "lucide-react";

function FeaturedCar() {
  const [latestPrediction, setLatestPrediction] = useState(null);

  const loadLatestPrediction = () => {
    const history =
      JSON.parse(localStorage.getItem("predictionHistory")) || [];

    if (history.length > 0) {
      setLatestPrediction(history[0]);
    } else {
      setLatestPrediction(null);
    }
  };

  useEffect(() => {
    loadLatestPrediction();

    window.addEventListener("predictionUpdated", loadLatestPrediction);

    return () => {
      window.removeEventListener("predictionUpdated", loadLatestPrediction);
    };
  }, []);

  const handleShare = async () => {
    if (!latestPrediction) {
      alert("Make a prediction first.");
      return;
    }

    const shareText = `Used Car Price Prediction

${latestPrediction.brand} ${latestPrediction.model}
Year: ${latestPrediction.year}
Mileage: ${latestPrediction.mileage} miles
Estimated Price: $${Number(
      latestPrediction.price
    ).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Used Car Price Prediction",
          text: shareText,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Share error:", error);
        }
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("Prediction details copied to clipboard.");
    }
  };

  return (
    <section className="featured-car">
      <div className="featured-header">
        <div>
          <h2>
            {latestPrediction ? `${latestPrediction.brand} ` : "Toyota "}
            <span>
              {latestPrediction ? latestPrediction.model : "Camry"}
            </span>
          </h2>

          <p>
            {latestPrediction
              ? `${latestPrediction.year} | ${latestPrediction.mileage} miles`
              : "2020 | 50,000 km"}
          </p>
        </div>

        <button className="share-button" onClick={handleShare}>
          <Share2 size={18} />
          Share
        </button>
      </div>

      <div className="car-display">

  <div className="car-image-container">
    <img
      src="/cars/camry.png"
      alt="Toyota Camry"
      className="featured-car-image"
    />
  </div>

  <div className="price-overlay">
    <p>Estimated Price</p>

    <strong>
      {latestPrediction
        ? `$${Number(latestPrediction.price).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        : "$--"}
    </strong>
  </div>

</div>
    </section>
  );
}

export default FeaturedCar;