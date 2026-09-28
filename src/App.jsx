import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import FeaturedCar from "./components/FeaturedCar";
import PriceTrend from "./components/PriceTrend";
import ModelPerformance from "./components/ModelPerformance";
import Specification from "./components/Specification";
import EstimatedPrice from "./components/EstimatedPrice";
import RecommendedCars from "./components/RecommendedCars";
import RecentPredictions from "./components/RecentPredictions";
import PriceDistribution from "./components/PriceDistribution";
import PredictPrice from "./components/PredictPrice";
import PredictionHistory from "./components/PredictionHistory";
import CompareCars from "./components/CompareCars";
import MarketAnalytics from "./components/MarketAnalytics";
import AboutProject from "./components/AboutProject";

import "./App.css";

function App() {
   const [currentPage, setCurrentPage] = useState("dashboard");
   useEffect(() => {
  const openHistory = () => {
    setCurrentPage("history");
  };

  window.addEventListener("openPredictionHistory", openHistory);

  return () => {
    window.removeEventListener("openPredictionHistory", openHistory);
  };
}, []);
  return (
    <div className="app">
      <Sidebar
  setCurrentPage={setCurrentPage}
  currentPage={currentPage}
/>

      <div className="main-area">
        <Header />

        <main className="main-content">
          {currentPage === "dashboard" && (
  <>
    <div className="top-dashboard">
      <FeaturedCar />
      <PriceTrend />
      <ModelPerformance />
    </div>

    <div className="middle-dashboard">
      <Specification />
      <EstimatedPrice />
      <RecommendedCars dashboard />
    </div>

    <div className="bottom-dashboard">
      <RecentPredictions />
      <PriceDistribution />
    </div>
  </>
)}

{currentPage === "predict" && <PredictPrice />}
{currentPage === "history" && <PredictionHistory />}
{currentPage === "compare" && <CompareCars />}
{currentPage === "analytics" && <MarketAnalytics />}
{currentPage === "recommended" && <RecommendedCars />}
{currentPage === "about" && <AboutProject />}
        </main>

      </div>

    </div>
  );
}

export default App;