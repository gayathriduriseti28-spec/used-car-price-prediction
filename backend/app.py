from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load trained ML model
model = joblib.load(
    "../ml/saved_model/used_car_price_model.joblib"
)

# Load dataset
df = pd.read_csv("../data/raw/used_cars.csv")


# --------------------------------------------------
# HOME
# --------------------------------------------------

@app.route("/")
def home():
    return jsonify({
        "message": "Used Car Price Prediction API is running"
    })


# --------------------------------------------------
# PREDICT PRICE
# --------------------------------------------------

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    model_year = int(data["year"])
    mileage = float(data["mileage"])
    vehicle_age = 2026 - model_year

    input_data = pd.DataFrame([{
        "brand": data["brand"],
        "model": data["model"],
        "model_year": model_year,
        "milage": mileage,
        "fuel_type": data["fuelType"],
        "engine": data["engineType"],
        "transmission": data["transmission"],
        "ext_col": "Unknown",
        "int_col": "Unknown",
        "accident": (
            "At least 1 accident or damage reported"
            if data["accidentHistory"] == "Yes"
            else "None reported"
        ),
        "clean_title": data["cleanTitle"],
        "vehicle_age": vehicle_age,
        "mileage_per_year": mileage / max(vehicle_age, 1)
    }])

    predicted_price = model.predict(input_data)[0]

    return jsonify({
        "predicted_price": round(float(predicted_price), 2)
    })

# --------------------------------------------------
# PRICE DISTRIBUTION
# --------------------------------------------------

@app.route("/price-distribution", methods=["GET"])
def price_distribution():

    prices = (
        df["price"]
        .astype(str)
        .str.replace(r"[^0-9.]", "", regex=True)
    )

    prices = pd.to_numeric(
        prices,
        errors="coerce"
    ).dropna()

    bins = [
        0,
        10000,
        20000,
        30000,
        40000,
        50000,
        60000,
        float("inf")
    ]

    labels = [
        "0-10K",
        "10K-20K",
        "20K-30K",
        "30K-40K",
        "40K-50K",
        "50K-60K",
        "60K+"
    ]

    distribution = pd.cut(
        prices,
        bins=bins,
        labels=labels,
        right=False
    ).value_counts().sort_index()

    result = []

    for label in labels:
        result.append({
            "range": label,
            "count": int(distribution.get(label, 0))
        })

    return jsonify(result)

@app.route("/price-trend", methods=["GET"])
def price_trend():
    prices = (
        df["price"]
        .astype(str)
        .str.replace(r"[^0-9.]", "", regex=True)
    )

    prices = pd.to_numeric(prices, errors="coerce")

    trend_df = pd.DataFrame({
        "year": pd.to_numeric(df["model_year"], errors="coerce"),
        "price": prices
    })

    trend_df = trend_df.dropna()
    trend_df = trend_df[
    (trend_df["year"] >= 2015) &
    (trend_df["year"] <= 2024)
]

    trend = (
        trend_df
        .groupby("year")["price"]
        .mean()
        .reset_index()
        .sort_values("year")
    )

    result = []

    for _, row in trend.iterrows():
        result.append({
            "year": int(row["year"]),
            "price": round(float(row["price"]), 2)
        })

    return jsonify(result)

@app.route("/market-analytics", methods=["GET"])
def market_analytics():
    # Clean price column
    prices = (
        df["price"]
        .astype(str)
        .str.replace(r"[^0-9.]", "", regex=True)
    )

    prices = pd.to_numeric(prices, errors="coerce")

    # Clean mileage column
    mileage = (
        df["milage"]
        .astype(str)
        .str.replace(",", "", regex=False)
        .str.extract(r"([\d.]+)")[0]
    )

    mileage = pd.to_numeric(mileage, errors="coerce")

    # Create cleaned dataframe
    analytics_df = pd.DataFrame({
        "price": prices,
        "mileage": mileage,
        "fuel_type": df["fuel_type"]
    })

    analytics_df = analytics_df.dropna(
        subset=["price", "mileage"]
    )

    # Fuel type distribution
    fuel_counts = (
        df["fuel_type"]
        .fillna("Unknown")
        .astype(str)
        .value_counts()
    )

    total_fuel_records = fuel_counts.sum()

    fuel_distribution = []

    for fuel_type, count in fuel_counts.items():
        fuel_distribution.append({
            "fuel_type": fuel_type,
            "count": int(count),
            "percentage": round(
                (count / total_fuel_records) * 100,
                2
            )
        })

    return jsonify({
        "total_vehicles": int(len(df)),
        "average_price": round(
            float(analytics_df["price"].mean()),
            2
        ),
        "min_price": round(
            float(analytics_df["price"].min()),
            2
        ),
        "max_price": round(
            float(analytics_df["price"].max()),
            2
        ),
        "average_mileage": round(
            float(analytics_df["mileage"].mean()),
            2
        ),
        "fuel_distribution": fuel_distribution
    })

@app.route("/recommended-cars", methods=["GET"])
def recommended_cars():
    recommended = df.copy()

    recommended["price"] = (
        recommended["price"]
        .astype(str)
        .str.replace(r"[^0-9.]", "", regex=True)
    )
    recommended["price"] = pd.to_numeric(
        recommended["price"], errors="coerce"
    )

    recommended["milage"] = (
        recommended["milage"]
        .astype(str)
        .str.replace(",", "", regex=False)
        .str.extract(r"([\d.]+)")[0]
    )
    recommended["milage"] = pd.to_numeric(
        recommended["milage"], errors="coerce"
    )

    recommended = recommended.dropna(
        subset=["brand", "model", "model_year", "price", "milage"]
    )

    recommended = recommended.sort_values(
        by="price",
        ascending=True
    ).head(6)

    result = []

    for _, row in recommended.iterrows():
        result.append({
            "brand": row["brand"],
            "model": row["model"],
            "year": int(row["model_year"]),
            "mileage": round(float(row["milage"])),
            "price": round(float(row["price"]), 2)
        })

    return jsonify(result)


# --------------------------------------------------
# MODEL PERFORMANCE
# --------------------------------------------------
@app.route("/model-performance", methods=["GET"])
def model_performance():
    results = pd.read_csv(
        "../ml/saved_model/model_results.csv",
        index_col=0
    )

    result = []

    for name, row in results.iterrows():
        result.append({
            "name": name,
            "MAE": round(float(row["MAE"]), 2),
            "RMSE": round(float(row["RMSE"]), 2),
            "R2": round(float(row["R2"]), 4),
            "R2_percentage": round(float(row["R2"]) * 100, 2)
        })

    return jsonify(result)

# --------------------------------------------------
# RUN SERVER
# --------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True, port=5000)