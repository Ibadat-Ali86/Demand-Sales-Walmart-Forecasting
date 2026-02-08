 # File: 09_phase2_statistical_models.py
"""
Phase 2: ARIMA, SARIMA, and Prophet Models
Weeks 4-5
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import os
from statsmodels.tsa.statespace.sarimax import SARIMAX
from prophet import Prophet
import warnings
warnings.filterwarnings('ignore')

# Create directory for saving visualizations
# Create directory for saving visualizations
script_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.dirname(script_dir)
data_dir = os.path.join(project_dir, 'data')
visuals_dir = os.path.join(project_dir, 'visuals')

os.makedirs(visuals_dir, exist_ok=True)
path = visuals_dir


print("=" * 80)
print("PHASE 2: STATISTICAL FORECASTING MODELS")
print("=" * 80)

# Load data
# Load data
train_df = pd.read_csv(os.path.join(data_dir, 'walmart_train.csv'), parse_dates=['Date'])
val_df = pd.read_csv(os.path.join(data_dir, 'walmart_val.csv'), parse_dates=['Date'])
test_df = pd.read_csv(os.path.join(data_dir, 'walmart_test.csv'), parse_dates=['Date'])

# Select one store-dept for modeling (you can loop through all later)
SAMPLE_STORE = 1
SAMPLE_DEPT = 1

train_sample = train_df[(train_df['Store'] == SAMPLE_STORE) & (train_df['Dept'] == SAMPLE_DEPT)].copy()
val_sample = val_df[(val_df['Store'] == SAMPLE_STORE) & (val_df['Dept'] == SAMPLE_DEPT)].copy()

train_sample = train_sample.sort_values('Date').set_index('Date')
val_sample = val_sample.sort_values('Date').set_index('Date')

print(f"\nModeling Store {SAMPLE_STORE}, Dept {SAMPLE_DEPT}")
print(f"Train size: {len(train_sample)} weeks")
print(f"Val size: {len(val_sample)} weeks")

# ============================================================================
# MODEL 1: SARIMA
# ============================================================================
print("\n" + "="*80)
print("MODEL 1: SARIMA")
print("="*80)

print("Training SARIMA model...")
print("(This may take 2-3 minutes...)")

# SARIMA parameters: (p,d,q) x (P,D,Q,s)
# p,d,q: non-seasonal AR, differencing, MA
# P,D,Q,s: seasonal AR, differencing, MA, seasonality
# For weekly data with yearly seasonality: s=52

try:
    sarima_model = SARIMAX(
        train_sample['Weekly_Sales'],
        order=(1, 1, 1),  # Simple ARIMA part
        seasonal_order=(1, 1, 1, 52),  # Yearly seasonality
        enforce_stationarity=False,
        enforce_invertibility=False
    )
    
    sarima_fit = sarima_model.fit(disp=False)
    print("SARIMA trained successfully")
    
    # Forecast
    sarima_forecast = sarima_fit.forecast(steps=len(val_sample))
    sarima_forecast = pd.Series(sarima_forecast.values, index=val_sample.index)
    
    # Calculate MAPE
    sarima_mape = np.mean(np.abs((val_sample['Weekly_Sales'] - sarima_forecast) / val_sample['Weekly_Sales'])) * 100
    print(f"SARIMA Validation MAPE: {sarima_mape:.2f}%")
    
except Exception as e:
    print(f"WARNING: SARIMA failed: {e}")
    print("Using simple moving average as fallback...")
    sarima_forecast = pd.Series([train_sample['Weekly_Sales'].mean()] * len(val_sample), index=val_sample.index)
    sarima_mape = np.mean(np.abs((val_sample['Weekly_Sales'] - sarima_forecast) / val_sample['Weekly_Sales'])) * 100

# ============================================================================
# MODEL 2: PROPHET
# ============================================================================
print("\n" + "="*80)
print("MODEL 2: PROPHET")
print("="*80)

print("Training Prophet model...")

# Prophet needs specific column names
prophet_train = train_sample.reset_index()[['Date', 'Weekly_Sales']]
prophet_train.columns = ['ds', 'y']

# Initialize Prophet with yearly seasonality
prophet_model = Prophet(
    yearly_seasonality=True,
    weekly_seasonality=False,  # We have weekly data points, not daily
    daily_seasonality=False,
    seasonality_mode='multiplicative',
    changepoint_prior_scale=0.05
)

# Add US holidays
prophet_model.add_country_holidays(country_name='US')

# Fit
prophet_model.fit(prophet_train)
print("Prophet trained")

# Forecast
future = prophet_model.make_future_dataframe(periods=len(val_sample), freq='W')
prophet_forecast_df = prophet_model.predict(future)

# Extract validation period predictions
prophet_forecast = prophet_forecast_df.tail(len(val_sample))[['ds', 'yhat']].set_index('ds')
prophet_forecast.index = val_sample.index
prophet_forecast = prophet_forecast['yhat']

# Calculate MAPE
prophet_mape = np.mean(np.abs((val_sample['Weekly_Sales'] - prophet_forecast) / val_sample['Weekly_Sales'])) * 100
print(f"Prophet Validation MAPE: {prophet_mape:.2f}%")

# ============================================================================
# MODEL 3: SIMPLE BASELINE (Moving Average)
# ============================================================================
print("\n" + "="*80)
print("MODEL 3: BASELINE (52-week Moving Average)")
print("="*80)

# Simple baseline: use average of last 52 weeks
baseline_forecast = pd.Series([train_sample['Weekly_Sales'].tail(52).mean()] * len(val_sample),
                              index=val_sample.index)

baseline_mape = np.mean(np.abs((val_sample['Weekly_Sales'] - baseline_forecast) / val_sample['Weekly_Sales'])) * 100
print(f"Baseline Validation MAPE: {baseline_mape:.2f}%")

# ============================================================================
# COMPARISON VISUALIZATION
# ============================================================================
print("\n" + "="*80)
print("CREATING COMPARISON VISUALIZATION")
print("="*80)

fig, axes = plt.subplots(2, 1, figsize=(18, 12))

# Plot 1: Forecasts comparison
ax1 = axes[0]

# Plot training data (last 52 weeks for context)
ax1.plot(train_sample.index[-52:], train_sample['Weekly_Sales'].tail(52),
         label='Training Data', color='black', linewidth=2)

# Plot actual validation
ax1.plot(val_sample.index, val_sample['Weekly_Sales'],
         label='Actual', color='blue', linewidth=2, marker='o', markersize=4)

# Plot forecasts
ax1.plot(sarima_forecast.index, sarima_forecast.values,
         label=f'SARIMA (MAPE: {sarima_mape:.1f}%)',
         color='red', linewidth=2, linestyle='--')

ax1.plot(prophet_forecast.index, prophet_forecast.values,
         label=f'Prophet (MAPE: {prophet_mape:.1f}%)',
         color='green', linewidth=2, linestyle='--')

ax1.plot(baseline_forecast.index, baseline_forecast.values,
         label=f'Baseline (MAPE: {baseline_mape:.1f}%)',
         color='orange', linewidth=2, linestyle=':')

ax1.set_title(f'Forecast Comparison - Store {SAMPLE_STORE}, Dept {SAMPLE_DEPT}',
              fontsize=14, fontweight='bold')
ax1.set_ylabel('Weekly Sales ($)', fontsize=12)
ax1.legend(loc='best', fontsize=10)
ax1.grid(True, alpha=0.3)

# Plot 2: Error analysis
ax2 = axes[1]

sarima_errors = val_sample['Weekly_Sales'] - sarima_forecast
prophet_errors = val_sample['Weekly_Sales'] - prophet_forecast
baseline_errors = val_sample['Weekly_Sales'] - baseline_forecast

x = range(len(val_sample))
width = 0.25

ax2.bar([i - width for i in x], sarima_errors, width, label='SARIMA Error', alpha=0.7)
ax2.bar(x, prophet_errors, width, label='Prophet Error', alpha=0.7)
ax2.bar([i + width for i in x], baseline_errors, width, label='Baseline Error', alpha=0.7)

ax2.axhline(0, color='black', linestyle='-', linewidth=1)
ax2.set_title('Forecast Errors by Week', fontsize=14, fontweight='bold')
ax2.set_xlabel('Validation Week', fontsize=12)
ax2.set_ylabel('Error ($)', fontsize=12)
ax2.legend()
ax2.grid(True, alpha=0.3, axis='y')

plt.tight_layout()
plt.savefig(os.path.join(path, 'phase2_model_comparison.png'), dpi=300, bbox_inches='tight')
print("\nComparison plot saved to", os.path.join(path, 'phase2_model_comparison.png'))
plt.show()

# ============================================================================
# CHECKPOINT 2.1: MODEL COMPARISON
# ============================================================================
print("\n" + "="*80)
print("CHECKPOINT 2.1: MODEL EVALUATION")
print("="*80)

results = {
    'SARIMA': sarima_mape,
    'Prophet': prophet_mape,
    'Baseline': baseline_mape
}

print("\nModel Performance (MAPE on Validation):")
for model, mape in sorted(results.items(), key=lambda x: x[1]):
    if mape < 20:
        status = "Excellent"
    elif mape < 30:
        status = "Good"
    else:
        status = "Needs improvement"
    print(f" {model:.<20} {mape:>6.2f}% [{status}]")

best_model = min(results, key=results.get)
print(f"\nBest Model: {best_model} with {results[best_model]:.2f}% MAPE")

if results[best_model] < 30:
    print("\nCHECKPOINT 2.1 PASSED!")
    print("MAPE < 30% achieved. Ready for Phase 3.")
else:
    print("\nWARNING: MAPE > 30%. Consider:")
    print(" - Trying different stores/departments")
    print(" - Tuning model parameters")
    print(" - Adding more features")

# Save results
import json
results_path = os.path.join(path, 'phase2_results.json')
with open(results_path, 'w') as f:
    json.dump(results, f, indent=2)

print(f"\nPhase 2 results saved to {results_path}")

