import { useState } from "react";
import {
  Car,
  CalendarDays,
  Gauge,
  Fuel,
  Cog,
  Settings,
  ShieldCheck,
  FileCheck,
  Sparkles,
  DollarSign,
} from "lucide-react";

function PredictPrice() {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    mileage: "",
    fuelType: "",
    engineType: "",
    transmission: "",
    accidentHistory: "No",
    cleanTitle: "Yes",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      const newPrediction = {
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        mileage: formData.mileage,
        fuelType: formData.fuelType,
        engineType: formData.engineType,
        transmission: formData.transmission,
        accidentHistory: formData.accidentHistory,
        cleanTitle: formData.cleanTitle,
        price: data.predicted_price,
        date: new Date().toLocaleString(),
      };

      const existingHistory =
        JSON.parse(localStorage.getItem("predictionHistory")) || [];

      localStorage.setItem(
        "predictionHistory",
        JSON.stringify([newPrediction, ...existingHistory])
      );

      setPrediction(data.predicted_price);

      window.dispatchEvent(new Event("predictionUpdated"));
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Unable to connect to prediction server.");
    }

    setLoading(false);
  };

  return (
    <div className="predict-page">

      {/* PAGE HEADER */}
      <div className="page-heading prediction-page-heading">
        <div>
          <div className="heading-with-icon">
            <div className="heading-icon">
              <Sparkles size={22} />
            </div>

            <div>
              <h1>Predict Car Price</h1>
              <p>
                Enter the vehicle details to get an estimated market price.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="prediction-layout">

        {/* FORM CARD */}
        <div className="prediction-form-card">

          <div className="prediction-card-header">
            <div>
              <h2>Vehicle Information</h2>
              <p>Provide the details of the used car.</p>
            </div>

            <div className="vehicle-header-icon">
              <Car size={25} />
            </div>
          </div>

          <form className="prediction-form" onSubmit={handlePredict}>

            {/* BRAND */}
            <div className="form-group">
              <label>
                <Car size={16} />
                Brand
              </label>

              <input
                type="text"
                name="brand"
                placeholder="e.g. Toyota"
                value={formData.brand}
                onChange={handleChange}
                required
              />
            </div>

            {/* MODEL */}
            <div className="form-group">
              <label>
                <Car size={16} />
                Model
              </label>

              <input
                type="text"
                name="model"
                placeholder="e.g. Camry"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </div>

            {/* YEAR */}
            <div className="form-group">
              <label>
                <CalendarDays size={16} />
                Model Year
              </label>

              <input
                type="number"
                name="year"
                placeholder="e.g. 2020"
                value={formData.year}
                onChange={handleChange}
                required
              />
            </div>

            {/* MILEAGE */}
            <div className="form-group">
              <label>
                <Gauge size={16} />
                Mileage
              </label>

              <input
                type="number"
                name="mileage"
                placeholder="e.g. 50000"
                value={formData.mileage}
                onChange={handleChange}
                required
              />
            </div>

            {/* FUEL */}
            <div className="form-group">
              <label>
                <Fuel size={16} />
                Fuel Type
              </label>

              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                required
              >
                <option value="">Select fuel type</option>
                <option value="Gasoline">Gasoline</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="E85 Flex Fuel">E85 Flex Fuel</option>
                <option value="Plug-In Hybrid">Plug-In Hybrid</option>
              </select>
            </div>

            {/* ENGINE */}
            <div className="form-group">
              <label>
                <Cog size={16} />
                Engine Type
              </label>

              <input
                type="text"
                name="engineType"
                placeholder="e.g. 3.5 Liter V6"
                value={formData.engineType}
                onChange={handleChange}
                required
              />
            </div>

            {/* TRANSMISSION */}
            <div className="form-group">
              <label>
                <Settings size={16} />
                Transmission
              </label>

              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                required
              >
                <option value="">Select transmission</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            {/* ACCIDENT */}
            <div className="form-group">
              <label>
                <ShieldCheck size={16} />
                Accident History
              </label>

              <select
                name="accidentHistory"
                value={formData.accidentHistory}
                onChange={handleChange}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            {/* CLEAN TITLE */}
            <div className="form-group">
              <label>
                <FileCheck size={16} />
                Clean Title
              </label>

              <select
                name="cleanTitle"
                value={formData.cleanTitle}
                onChange={handleChange}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="predict-button"
              disabled={loading}
            >
              {loading ? (
                "Predicting..."
              ) : (
                <>
                  <Sparkles size={19} />
                  Predict Price
                </>
              )}
            </button>

          </form>
        </div>

        {/* RESULT PANEL */}
        <div className="prediction-result-panel">

          <div className="result-panel-icon">
            <DollarSign size={30} />
          </div>

          <span className="result-label">Estimated Market Price</span>

          {prediction !== null ? (
            <>
              <h2>
                $
                {Number(prediction).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h2>

              <div className="result-status">
                <span></span>
                ML Prediction Generated
              </div>

              <div className="result-car">
                <Car size={70} />
              </div>

              <div className="result-summary">
                <strong>
                  {formData.brand} {formData.model}
                </strong>

                <span>
                  {formData.year} • {formData.mileage} miles
                </span>
              </div>
            </>
          ) : (
            <>
              <h2 className="no-result-price">$--</h2>

              <p className="result-message">
                Enter the vehicle details and click{" "}
                <strong>Predict Price</strong> to generate an estimate.
              </p>

              <div className="result-car empty-result-car">
                <Car size={80} />
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}

export default PredictPrice;