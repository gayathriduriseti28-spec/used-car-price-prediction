import { useEffect, useState } from "react";
import {
  CalendarDays,
  Gauge,
  Fuel,
  Cog,
  Settings,
  ShieldCheck,
  Palette,
  FileCheck,
  Pencil,
} from "lucide-react";

function Specification() {
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const loadPrediction = () => {
      const savedHistory =
        JSON.parse(localStorage.getItem("predictionHistory")) || [];

      if (savedHistory.length > 0) {
        setPrediction(savedHistory[0]);
      } else {
        setPrediction(null);
      }
    };

    loadPrediction();

    window.addEventListener("predictionUpdated", loadPrediction);

    return () => {
      window.removeEventListener("predictionUpdated", loadPrediction);
    };
  }, []);

  const specifications = [
    {
      icon: CalendarDays,
      label: "Year",
      value: prediction?.year || "--",
    },
    {
      icon: Gauge,
      label: "Mileage",
      value: prediction ? `${prediction.mileage} miles` : "--",
    },
    {
      icon: Fuel,
      label: "Fuel Type",
      value: prediction?.fuelType || "--",
    },
    {
      icon: Cog,
      label: "Engine Type",
      value: prediction?.engineType || "--",
    },
    {
      icon: Settings,
      label: "Transmission",
      value: prediction?.transmission || "--",
    },
    {
      icon: ShieldCheck,
      label: "Accident History",
      value: prediction?.accidentHistory || "--",
    },
    {
      icon: Palette,
      label: "Exterior Color",
      value: prediction?.exteriorColor || "Unknown",
    },
    {
      icon: Palette,
      label: "Interior Color",
      value: prediction?.interiorColor || "Unknown",
    },
    {
      icon: FileCheck,
      label: "Clean Title",
      value: prediction?.cleanTitle || "--",
    },
  ];

  return (
    <section className="dashboard-card specification">
      <div className="section-heading">
        <div className="section-title">
          <FileCheck size={22} />
          <h3>Specification</h3>
        </div>

        <button className="edit-button">
          <Pencil size={16} />
          Edit
        </button>
      </div>

      <div className="spec-grid">
        {specifications.map((item) => {
          const Icon = item.icon;

          return (
            <div className="spec-item" key={item.label}>
              <Icon size={23} />

              <div>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Specification;