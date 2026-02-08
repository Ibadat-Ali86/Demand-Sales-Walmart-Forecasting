 # File: 10_phase3_deep_learning_lstm.py
"""
Phase 3: LSTM Neural Network for Time Series Forecasting
Weeks 6-7
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping
import warnings
import os
import json

warnings.filterwarnings('ignore')

# ------------------------------------------------------------------
# Paths
# ------------------------------------------------------------------
script_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.dirname(script_dir)
data_dir = os.path.join(project_dir, 'data')
visuals_dir = os.path.join(project_dir, 'visuals')

os.makedirs(visuals_dir, exist_ok=True)
path = visuals_dir


print("=" * 80)
print("PHASE 3: LSTM DEEP LEARNING MODEL")
print("=" * 80)

# Load data
train_df = pd.read_csv(os.path.join(data_dir, 'walmart_train.csv'), parse_dates=['Date'])
val_df = pd.read_csv(os.path.join(data_dir, 'walmart_val.csv'), parse_dates=['Date'])
test_df = pd.read_csv(os.path.join(data_dir, 'walmart_test.csv'), parse_dates=['Date'])

# Load feature info
with open(os.path.join(data_dir, 'walmart_features.json'), 'r') as f:
    feature_info = json.load(f)

feature_cols = feature_info['all_features']
target_col = feature_info['target']

print(f"Using {len(feature_cols)} features")

# ============================================================================
# PREPARE DATA FOR LSTM
# ============================================================================
print("\n" + "="*80)
print("PREPARING SEQUENCES FOR LSTM")
print("="*80)

# Select one store-dept for demonstration
SAMPLE_STORE = 1
SAMPLE_DEPT = 1

train_sample = train_df[(train_df['Store'] == SAMPLE_STORE) & (train_df['Dept'] == SAMPLE_DEPT)].copy()
val_sample = val_df[(val_df['Store'] == SAMPLE_STORE) & (val_df['Dept'] == SAMPLE_DEPT)].copy()
test_sample = test_df[(test_df['Store'] == SAMPLE_STORE) & (test_df['Dept'] == SAMPLE_DEPT)].copy()

# Sort by date
train_sample = train_sample.sort_values('Date')
val_sample = val_sample.sort_values('Date')
test_sample = test_sample.sort_values('Date')

print(f"Train: {len(train_sample)} weeks")
print(f"Val: {len(val_sample)} weeks")
print(f"Test: {len(test_sample)} weeks")

# Prepare features and target
available_features = [f for f in feature_cols if f in train_sample.columns]

# Scale the data
scaler_X = MinMaxScaler()
scaler_y = MinMaxScaler()

# Fit on train only
X_train = scaler_X.fit_transform(train_sample[available_features])
y_train = scaler_y.fit_transform(train_sample[[target_col]])

X_val = scaler_X.transform(val_sample[available_features])
y_val = scaler_y.transform(val_sample[[target_col]])

print(f"\nFeature matrix shape: {X_train.shape}")

# Create sequences
def create_sequences(X, y, time_steps=12, forecast_horizon=1):
    """Create sequences for LSTM"""
    Xs, ys = [], []
    for i in range(len(X) - time_steps - forecast_horizon + 1):
        Xs.append(X[i:(i + time_steps)])
        ys.append(y[i + time_steps + forecast_horizon - 1])
    return np.array(Xs), np.array(ys)

TIME_STEPS = 12          # Use 12 weeks of history
FORECAST_HORIZON = 1     # Predict 1 week ahead

print(f"\nCreating sequences (time_steps={TIME_STEPS}, horizon={FORECAST_HORIZON})...")

X_train_seq, y_train_seq = create_sequences(X_train, y_train, TIME_STEPS, FORECAST_HORIZON)
X_val_seq, y_val_seq = create_sequences(X_val, y_val, TIME_STEPS, FORECAST_HORIZON)

print(f"Training sequences: {X_train_seq.shape}")
print(f"Validation sequences: {X_val_seq.shape}")

# ============================================================================
# BUILD LSTM MODEL
# ============================================================================
print("\n" + "="*80)
print("BUILDING LSTM MODEL")
print("="*80)

# Set random seed for reproducibility
tf.random.set_seed(42)
np.random.seed(42)

# Build model
model = Sequential([
    LSTM(64, activation='relu', return_sequences=True,
         input_shape=(TIME_STEPS, len(available_features))),
    Dropout(0.2),

    LSTM(32, activation='relu', return_sequences=False),
    Dropout(0.2),

    Dense(16, activation='relu'),
    Dense(1)
])

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.001),
    loss='mse',
    metrics=['mae']
)

print("\nModel Summary:")
model.summary()

# ============================================================================
# TRAIN LSTM
# ============================================================================
print("\n" + "="*80)
print("TRAINING LSTM")
print("="*80)

print("Training... (this may take 5-10 minutes)")

# Early stopping to prevent overfitting
early_stop = EarlyStopping(
    monitor='val_loss',
    patience=10,
    restore_best_weights=True
)

# Train
history = model.fit(
    X_train_seq, y_train_seq,
    epochs=100,
    batch_size=32,
    validation_data=(X_val_seq, y_val_seq),
    callbacks=[early_stop],
    verbose=1
)

print("\nTraining complete")

# ============================================================================
# EVALUATE
# ============================================================================
print("\n" + "="*80)
print("EVALUATION")
print("="*80)

# Predict
y_val_pred_scaled = model.predict(X_val_seq)

# Inverse transform
y_val_pred = scaler_y.inverse_transform(y_val_pred_scaled)
y_val_actual = scaler_y.inverse_transform(y_val_seq)

# Calculate metrics
mape = np.mean(np.abs((y_val_actual - y_val_pred) / y_val_actual)) * 100
mae = np.mean(np.abs(y_val_actual - y_val_pred))
rmse = np.sqrt(np.mean((y_val_actual - y_val_pred) ** 2))

print(f"\nLSTM Validation MAPE: {mape:.2f}%")
print(f"MAE: ${mae:.2f}")
print(f"RMSE: ${rmse:.2f}")

# ============================================================================
# VISUALIZATION
# ============================================================================
print("\n" + "="*80)
print("CREATING VISUALIZATIONS")
print("="*80)

fig, axes = plt.subplots(2, 2, figsize=(16, 12))

# Plot 1: Training history
ax1 = axes[0, 0]
ax1.plot(history.history['loss'], label='Training Loss', linewidth=2)
ax1.plot(history.history['val_loss'], label='Validation Loss', linewidth=2)
ax1.set_title('LSTM Training History', fontsize=12, fontweight='bold')
ax1.set_xlabel('Epoch')
ax1.set_ylabel('Loss (MSE)')
ax1.legend()
ax1.grid(True, alpha=0.3)

# Plot 2: Predictions vs Actual
ax2 = axes[0, 1]
ax2.plot(y_val_actual, label='Actual', marker='o', linewidth=2)
ax2.plot(y_val_pred, label='Predicted', marker='x', linewidth=2)
ax2.set_title(f'LSTM Predictions (MAPE: {mape:.2f}%)', fontsize=12, fontweight='bold')
ax2.set_xlabel('Validation Sample')
ax2.set_ylabel('Weekly Sales ($)')
ax2.legend()
ax2.grid(True, alpha=0.3)

# Plot 3: Scatter plot
ax3 = axes[1, 0]
ax3.scatter(y_val_actual, y_val_pred, alpha=0.6)
min_val = min(y_val_actual.min(), y_val_pred.min())
max_val = max(y_val_actual.max(), y_val_pred.max())
ax3.plot([min_val, max_val], [min_val, max_val], 'r--', linewidth=2, label='Perfect Prediction')
ax3.set_title('Actual vs Predicted', fontsize=12, fontweight='bold')
ax3.set_xlabel('Actual Sales ($)')
ax3.set_ylabel('Predicted Sales ($)')
ax3.legend()
ax3.grid(True, alpha=0.3)

# Plot 4: Error distribution
ax4 = axes[1, 1]
errors = (y_val_actual - y_val_pred).flatten()
ax4.hist(errors, bins=30, edgecolor='black', alpha=0.7)
ax4.axvline(0, color='red', linestyle='--', linewidth=2, label='Zero Error')
ax4.set_title('Prediction Error Distribution', fontsize=12, fontweight='bold')
ax4.set_xlabel('Error ($)')
ax4.set_ylabel('Frequency')
ax4.legend()
ax4.grid(True, alpha=0.3)

plt.tight_layout()

fig_path = os.path.join(path, 'phase3_lstm_results.png')
plt.savefig(fig_path, dpi=300, bbox_inches='tight')
print(f"\nVisualizations saved to {fig_path}")
plt.show()

# Save model
model_path = os.path.join(path, 'walmart_lstm_model.h5')
model.save(model_path)
print(f"\nModel saved to '{model_path}'")

# ============================================================================
# CHECKPOINT 3.1
# ============================================================================
print("\n" + "="*80)
print("CHECKPOINT 3.1: LSTM EVALUATION")
print("="*80)

print(f"\nLSTM Performance:")
print(f"  MAPE: {mape:.2f}%")
print(f"  MAE: ${mae:.2f}")
print(f"  RMSE: ${rmse:.2f}")

if mape < 20:
    print("\nCHECKPOINT 3.1 PASSED!")
    print("Excellent performance (MAPE < 20%)")
elif mape < 30:
    print("\nCHECKPOINT 3.1 PASSED!")
    print("Good performance (MAPE < 30%)")
else:
    print("\nPerformance needs improvement")
    print("Consider: more training data, feature engineering, hyperparameter tuning")

# Save results
results = {
    'mape': float(mape),
    'mae': float(mae),
    'rmse': float(rmse),
    'epochs_trained': len(history.history['loss'])
}

results_json_path = os.path.join(path, 'phase3_lstm_results.json')
with open(results_json_path, 'w') as f:
    json.dump(results, f, indent=2)

print(f"\nLSTM results saved to {results_json_path}")

