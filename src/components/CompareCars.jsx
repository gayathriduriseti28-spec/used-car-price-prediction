import { useState } from "react";
import { Car, Plus, X, Loader2 } from "lucide-react";
import { getCarImage } from "../utils/carImages";

function CompareCars() {
  const [cars, setCars] = useState([
    {
      id: 1,
      brand: "",
      model: "",
      year: "",
      mileage: "",
      fuelType: "Gasoline",
      engineType: "Unknown",
      transmission: "Automatic",
      accidentHistory: "No",
      cleanTitle: "Yes",
      predictedPrice: null,
      loading: false,
    },
  ]);

  const addCar = () => {
    if (cars.length < 3) {
      setCars([
        ...cars,
        {
          id: Date.now(),
          brand: "",
          model: "",
          year: "",
          mileage: "",
          fuelType: "Gasoline",
          engineType: "Unknown",
          transmission: "Automatic",
          accidentHistory: "No",
          cleanTitle: "Yes",
          predictedPrice: null,
          loading: false,
        },
      ]);
    }
  };

  const removeCar = (id) => {
    if (cars.length > 1) {
      setCars(cars.filter((car) => car.id !== id));
    }
  };

  const updateCar = (id, field, value) => {
    setCars(
      cars.map((car) =>
        car.id === id
          ? {
              ...car,
              [field]: value,
              predictedPrice: null,
            }
          : car
      )
    );
  };

  const predictPrice = async (id) => {
    const car = cars.find((item) => item.id === id);

    if (!car.brand || !car.model || !car.year || !car.mileage) {
      alert("Please enter Brand, Model, Year and Mileage.");
      return;
    }

    setCars((currentCars) =>
      currentCars.map((item) =>
        item.id === id
          ? { ...item, loading: true }
          : item
      )
    );

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            brand: car.brand,
            model: car.model,
            year: car.year,
            mileage: car.mileage,
            fuelType: car.fuelType,
            engineType: car.engineType,
            transmission: car.transmission,
            accidentHistory: car.accidentHistory,
            cleanTitle: car.cleanTitle,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Prediction failed");
      }

      setCars((currentCars) =>
        currentCars.map((item) =>
          item.id === id
            ? {
                ...item,
                predictedPrice: data.predicted_price,
                loading: false,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Comparison prediction error:", error);

      setCars((currentCars) =>
        currentCars.map((item) =>
          item.id === id
            ? { ...item, loading: false }
            : item
        )
      );

      alert("Unable to get prediction. Make sure Flask is running.");
    }
  };

  return (
    <div className="predict-page compare-page">
      <div className="page-heading">
        <h1>Compare Cars</h1>
        <p>Compare up to three cars using the ML price prediction model.</p>
      </div>

      <div className="compare-grid">
        {cars.map((car, index) => (
          <div className="compare-card" key={car.id}>
      <div className="compare-card-header">

  <div className="compare-car-image">
    <img
      src={getCarImage(car.brand, car.model)}
      alt={`${car.brand || "Car"} ${car.model || ""}`}
    />
  </div>

  <div className="compare-card-title">
    <span>Vehicle {index + 1}</span>

    <h2>
      {car.brand && car.model
        ? `${car.brand} ${car.model}`
        : "Select a car"}
    </h2>
  </div>

              {cars.length > 1 && (
                <button
                  className="remove-car-button"
                  onClick={() => removeCar(car.id)}
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="compare-form">
              <label>
                Brand
                <input
                  type="text"
                  placeholder="e.g. Toyota"
                  value={car.brand}
                  onChange={(e) =>
                    updateCar(car.id, "brand", e.target.value)
                  }
                />
              </label>

              <label>
                Model
                <input
                  type="text"
                  placeholder="e.g. Camry"
                  value={car.model}
                  onChange={(e) =>
                    updateCar(car.id, "model", e.target.value)
                  }
                />
              </label>

              <label>
                Model Year
                <input
                  type="number"
                  placeholder="2020"
                  value={car.year}
                  onChange={(e) =>
                    updateCar(car.id, "year", e.target.value)
                  }
                />
              </label>

              <label>
                Mileage
                <input
                  type="number"
                  placeholder="50000"
                  value={car.mileage}
                  onChange={(e) =>
                    updateCar(car.id, "mileage", e.target.value)
                  }
                />
              </label>

              <label>
                Fuel Type
                <select
                  value={car.fuelType}
                  onChange={(e) =>
                    updateCar(car.id, "fuelType", e.target.value)
                  }
                >
                  <option value="Gasoline">Gasoline</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Diesel">Diesel</option>
                  <option value="E85 Flex Fuel">E85 Flex Fuel</option>
                  <option value="Plug-In Hybrid">Plug-In Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </label>

              <label>
                Engine Type
                <input
                  type="text"
                  placeholder="e.g. 3.5 Liter V6"
                  value={car.engineType}
                  onChange={(e) =>
                    updateCar(car.id, "engineType", e.target.value)
                  }
                />
              </label>

              <label>
                Transmission
                <select
                  value={car.transmission}
                  onChange={(e) =>
                    updateCar(car.id, "transmission", e.target.value)
                  }
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="CVT">CVT</option>
                  <option value="Transmission Unknown">
                    Transmission Unknown
                  </option>
                </select>
              </label>

              <label>
                Accident History
                <select
                  value={car.accidentHistory}
                  onChange={(e) =>
                    updateCar(
                      car.id,
                      "accidentHistory",
                      e.target.value
                    )
                  }
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </label>

              <label>
                Clean Title
                <select
                  value={car.cleanTitle}
                  onChange={(e) =>
                    updateCar(car.id, "cleanTitle", e.target.value)
                  }
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </label>

              <button
                className="prediction-button"
                onClick={() => predictPrice(car.id)}
                disabled={car.loading}
              >
                {car.loading ? (
                  <>
                    <Loader2 size={17} className="loading-icon" />
                    Predicting...
                  </>
                ) : (
                  "Predict Price"
                )}
              </button>

              {car.predictedPrice !== null && (
                <div className="compare-prediction">
                  <span>Estimated Price</span>
                  <strong>
                    $
                    {Number(car.predictedPrice).toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </strong>
                </div>
              )}
            </div>
          </div>
        ))}

        {cars.length < 3 && (
          <button className="add-car-card" onClick={addCar}>
            <Plus size={28} />
            <span>Add Another Car</span>
          </button>
        )}
      </div>

      {cars.length > 1 && (
        <div className="comparison-preview">
          <h2>Comparison</h2>

          <div className="comparison-table">
            <div className="comparison-row comparison-header">
              <span>Specification</span>

              {cars.map((car, index) => (
                <span key={car.id}>
                  {car.brand && car.model
                    ? `${car.brand} ${car.model}`
                    : `Car ${index + 1}`}
                </span>
              ))}
            </div>

            <div className="comparison-row">
              <span>Year</span>

              {cars.map((car) => (
                <span key={car.id}>
                  {car.year || "--"}
                </span>
              ))}
            </div>

            <div className="comparison-row">
              <span>Mileage</span>

              {cars.map((car) => (
                <span key={car.id}>
                  {car.mileage
                    ? `${Number(car.mileage).toLocaleString()} miles`
                    : "--"}
                </span>
              ))}
            </div>

            <div className="comparison-row">
              <span>Estimated Price</span>

              {cars.map((car) => (
                <span key={car.id}>
                  {car.predictedPrice !== null
                    ? `$${Number(
                        car.predictedPrice
                      ).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : "--"}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompareCars;