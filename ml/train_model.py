import os
import re
import joblib 
import numpy as np
import pandas as pd

from sklearn.compose import TransformedTargetRegressor
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
import matplotlib.pyplot as plt

from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor

from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

try:
    from xgboost import XGBRegressor
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False


# --------------------------------------------------
# 1. LOAD DATA
# --------------------------------------------------

DATA_PATH = "data/raw/used_cars.csv"
MODEL_DIR = "ml/saved_model"

os.makedirs(MODEL_DIR, exist_ok=True)

df = pd.read_csv(DATA_PATH)
print("Dataset shape:", df.shape)
print("\nColumn names:", df.columns.tolist())
print("\nMissing values:\n", df.isnull().sum())
print("\nPrice summary:\n", df["price"].describe())
print("\nSample prices:\n", df["price"].head(10))
print("Dataset loaded successfully")
print("Shape:", df.shape)


# --------------------------------------------------
# 2. CLEAN PRICE
# --------------------------------------------------

def clean_price(value):
    if pd.isna(value):
        return np.nan

    value = str(value)
    value = re.sub(r"[^0-9.]", "", value)

    try:
        return float(value)
    except ValueError:
        return np.nan


df["price"] = df["price"].apply(clean_price)
print("\nCleaned price summary:")
print(df["price"].describe())

print("\nHighest 10 prices:")
print(df.nlargest(10, "price")[["brand", "model", "model_year", "price"]])

print("\nCars priced above $200,000:")
print(
    df.loc[df["price"] > 200000,
           ["brand", "model", "model_year", "price"]]
    .sort_values("price", ascending=False)
    .to_string(index=False)
)


# --------------------------------------------------
# 3. CLEAN MILAGE
# --------------------------------------------------

def clean_milage(value):
    if pd.isna(value):
        return np.nan

    value = str(value)

    numbers = re.findall(r"[\d,]+(?:\.\d+)?", value)

    if not numbers:
        return np.nan

    milage = float(numbers[0].replace(",", ""))

    # Convert kilometers to miles when unit is explicitly km
    if "km" in value.lower():
        milage = milage * 0.621371

    return milage


df["milage"] = df["milage"].apply(clean_milage)
print("Duplicate rows:", df.duplicated().sum())

print(
    "Duplicate brand-model-year combinations:",
    df.duplicated(
        subset=["brand", "model", "model_year"]
    ).sum()
)


# --------------------------------------------------
# 4. CLEAN MODEL YEAR
# --------------------------------------------------

df["model_year"] = pd.to_numeric(
    df["model_year"],
    errors="coerce"
)


# --------------------------------------------------
# 5. REMOVE INVALID TARGET VALUES
# --------------------------------------------------

df = df.dropna(subset=["price"])
CURRENT_YEAR = 2026

df["vehicle_age"] = CURRENT_YEAR - df["model_year"]

df["mileage_per_year"] = (
    df["milage"] / df["vehicle_age"].clip(lower=1)
)
print("Unique brands:", df["brand"].nunique())
print("Unique models:", df["model"].nunique())
print("Unique model years:", df["model_year"].nunique())
print("Price range:", df["price"].min(), "-", df["price"].max())

print("Rows after cleaning:", len(df))


# --------------------------------------------------
# 6. FEATURES AND TARGET
# --------------------------------------------------

features = [
    "brand",
    "model",
    "model_year",
    "milage",
    "fuel_type",
    "engine",
    "transmission",
    "ext_col",
    "int_col",
    "accident",
    "clean_title",
    "vehicle_age",
    "mileage_per_year",
]

X = df[features]
y = df["price"]


# --------------------------------------------------
# 7. TRAIN / TEST SPLIT
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42
)

print("Training samples:", len(X_train))
print("Testing samples:", len(X_test))


# --------------------------------------------------
# 8. PREPROCESSING
# --------------------------------------------------

numeric_features = [
    "model_year",
    "milage",
    "vehicle_age",
    "mileage_per_year",
]

categorical_features = [
    "brand",
    "model",
    "fuel_type",
    "engine",
    "transmission",
    "ext_col",
    "int_col",
    "accident",
    "clean_title",
]


numeric_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
])


categorical_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    (
        "encoder",
        OneHotEncoder(
            handle_unknown="ignore",
            sparse_output=False
        ),
    ),
])


preprocessor = ColumnTransformer([
    ("numeric", numeric_pipeline, numeric_features),
    ("categorical", categorical_pipeline, categorical_features),
])


# --------------------------------------------------
# 9. MODELS
# --------------------------------------------------

models = {
    "Linear Regression": LinearRegression(),

    "Decision Tree": DecisionTreeRegressor(
        random_state=42
    ),

    "Random Forest": RandomForestRegressor(
        n_estimators=200,
        random_state=42,
        n_jobs=-1
    ),

    "Gradient Boosting": GradientBoostingRegressor(
        n_estimators=200,
        random_state=42
    ),
}


if XGBOOST_AVAILABLE:
    models["XGBoost"] = XGBRegressor(
        n_estimators=300,
        learning_rate=0.05,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="reg:squarederror",
        random_state=42,
        n_jobs=-1
    )


# --------------------------------------------------
# 10. TRAIN MODELS
# --------------------------------------------------
results = {}
trained_pipelines = {}
for name, model in models.items():
    print("\nTraining:", name)
    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("model", model),
    ])
    pipeline.fit(X_train, y_train)
    predictions = pipeline.predict(X_test)
    mae = mean_absolute_error(
        y_test,
        predictions
    )
    rmse = np.sqrt(
        mean_squared_error(
            y_test,
            predictions
        )
    )
    r2 = r2_score(
        y_test,
        predictions
    )
    results[name] = {
        "MAE": mae,
        "RMSE": rmse,
        "R2": r2,
    }
    trained_pipelines[name] = pipeline
    print("MAE :", round(mae, 2))
    print("RMSE:", round(rmse, 2))
    print("R2  :", round(r2, 4))
    
# --------------------------------------------------
# 10A. RANDOMIZED SEARCH - RANDOM FOREST
# --------------------------------------------------

print("\n================ RANDOMIZED SEARCH ================")

rf_pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", RandomForestRegressor(
        random_state=42,
        n_jobs=-1
    )),
])

param_distributions = {
    "model__n_estimators": [100, 200, 300, 500],
    "model__max_depth": [None, 10, 20, 30, 40],
    "model__min_samples_split": [2, 5, 10],
    "model__min_samples_leaf": [1, 2, 4],
    "model__max_features": ["sqrt", "log2", None],
}

random_search = RandomizedSearchCV(
    estimator=rf_pipeline,
    param_distributions=param_distributions,
    n_iter=10,
    cv=3,
    scoring="neg_root_mean_squared_error",
    random_state=42,
    n_jobs=-1,
)

random_search.fit(X_train, y_train)

tuned_pipeline = random_search.best_estimator_

tuned_predictions = tuned_pipeline.predict(X_test)

tuned_mae = mean_absolute_error(
    y_test,
    tuned_predictions
)

tuned_rmse = np.sqrt(
    mean_squared_error(
        y_test,
        tuned_predictions
    )
)

tuned_r2 = r2_score(
    y_test,
    tuned_predictions
)

results["Random Forest Tuned"] = {
    "MAE": tuned_mae,
    "RMSE": tuned_rmse,
    "R2": tuned_r2,
}

trained_pipelines["Random Forest Tuned"] = tuned_pipeline

print("\nTuned Random Forest Results")
print("MAE :", round(tuned_mae, 2))
print("RMSE:", round(tuned_rmse, 2))
print("R2  :", round(tuned_r2, 4))

print("\nBest Parameters:")
print(random_search.best_params_)

# --------------------------------------------------
# 11. MODEL COMPARISON
# --------------------------------------------------

results_df = pd.DataFrame(results).T

print("\n================ MODEL COMPARISON ================")
print(results_df)

from sklearn.base import clone

print("\n===== LOG-TRANSFORMED RANDOM FOREST =====")

log_rf = Pipeline([
    ("preprocessor", clone(preprocessor)),
    ("model", RandomForestRegressor(
        n_estimators=200,
        random_state=42,
        n_jobs=-1
    ))
])

log_model = TransformedTargetRegressor(
    regressor=log_rf,
    func=np.log1p,
    inverse_func=np.expm1
)

log_model.fit(X_train, y_train)
log_predictions = log_model.predict(X_test)

print("MAE:", round(mean_absolute_error(
    y_test, log_predictions
), 2))

print("RMSE:", round(np.sqrt(mean_squared_error(
    y_test, log_predictions
)), 2))

print("R2:", round(r2_score(
    y_test, log_predictions
), 4))


# --------------------------------------------------
# 12. SELECT MODEL WITH LOWEST RMSE
# --------------------------------------------------

best_model_name = results_df["RMSE"].idxmin()

best_pipeline = trained_pipelines[best_model_name]

print("\nSelected model:", best_model_name)

# Actual vs Predicted Price Graph
actual_prices = y_test
predicted_prices = best_pipeline.predict(X_test)

plt.figure(figsize=(8, 6))
plt.scatter(actual_prices, predicted_prices, alpha=0.5)
plt.plot(
    [actual_prices.min(), actual_prices.max()],
    [actual_prices.min(), actual_prices.max()],
    "r--"
)
plt.xlabel("Actual Price")
plt.ylabel("Predicted Price")
plt.title("Actual vs Predicted Car Prices")
plt.tight_layout()

graph_path = os.path.join(MODEL_DIR, "actual_vs_predicted.png")
plt.savefig(graph_path, dpi=300)
plt.close()

print("Actual vs Predicted graph saved:", graph_path)

# Residual Error Plot
residuals = actual_prices - predicted_prices

plt.figure(figsize=(8, 6))
plt.scatter(predicted_prices, residuals, alpha=0.5)
plt.axhline(y=0, color="red", linestyle="--")
plt.xlabel("Predicted Price")
plt.ylabel("Residual Error")
plt.title("Residual Error Plot")
plt.tight_layout()

residual_path = os.path.join(MODEL_DIR, "residual_error.png")
plt.savefig(residual_path, dpi=300)
plt.close()

print("Residual Error graph saved:", residual_path)

# --------------------------------------------------
# 13. SAVE BEST MODEL
# --------------------------------------------------

model_path = os.path.join(
    MODEL_DIR,
    "used_car_price_model.joblib"
)

joblib.dump(
    best_pipeline,
    model_path
)

print("\nModel saved successfully:")
print(model_path)


# --------------------------------------------------
# 14. SAVE MODEL RESULTS
# --------------------------------------------------

results_path = os.path.join(
    MODEL_DIR,
    "model_results.csv"
)

results_df.to_csv(results_path)

print("Model results saved:")
print(results_path)

print("\nTraining completed successfully!")