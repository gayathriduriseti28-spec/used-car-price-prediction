import pandas as pd
import matplotlib.pyplot as plt
import os

# Load model evaluation results
file_path = os.path.join(
    os.path.dirname(__file__),
    "saved_model",
    "model_results.csv"
)

df = pd.read_csv(file_path, index_col=0)

# Create output folder
output_dir = os.path.join(os.path.dirname(__file__), "graphs")
os.makedirs(output_dir, exist_ok=True)

# Plot each evaluation metric separately
metrics = ["MAE", "RMSE", "R2"]

for metric in metrics:
    plt.figure(figsize=(10, 6))
    plt.bar(df.index, df[metric])
    plt.title(f"Model Comparison Using {metric}")
    plt.xlabel("Machine Learning Models")
    plt.ylabel(metric)
    plt.xticks(rotation=30, ha="right")
    plt.tight_layout()

    save_path = os.path.join(output_dir, f"{metric}_comparison.png")
    plt.savefig(save_path, dpi=300)
    plt.close()

print("Graphs saved successfully in:", output_dir)

import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import os

# Load the saved model
base_dir = os.path.dirname(__file__)
model_path = os.path.join(
    base_dir, "saved_model", "used_car_price_model.joblib"
)
model = joblib.load(model_path)

# Load dataset
data_path = os.path.join(
    base_dir, "..", "data", "raw", "used_cars.csv"
)
df = pd.read_csv(data_path)

# Use the same test split and preprocessing as training
# IMPORTANT: This graph needs the same X_test and y_test
# used during model training.
print("Model loaded successfully.")
print("To plot actual vs predicted prices, we need the exact test split.")