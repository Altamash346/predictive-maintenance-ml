# Predictive Maintenance Machine Learning System

> **Machine Learning Project Specification**  
> **Domain:** Industrial Manufacturing & Predictive Maintenance  
> **Dataset:** AI4I 2020 Predictive Maintenance Dataset (10,000 Industrial Milling Machine Records)  
> **Stack:** Python 3.12, FastAPI, Scikit-Learn, Pandas, NumPy, React 19, Vite, Tailwind CSS, Recharts  
> **License:** 100% Free & Open-Source (No paid APIs or cloud dependencies)

---

## 📌 Project Overview

This platform implements an end-to-end industrial **Machine Learning System for Predictive Maintenance**. The system anticipates catastrophic milling machine failure by ingesting real-time operational telemetry, engineering physics-informed domain features, benchmarking supervised classification models, identifying operational regimes via unsupervised clustering, and serving real-time inferences:

1. **Dataset & Feature Store:** 10,000 continuous sensor cycles covering thermodynamic temperatures, spindle speed, rotational torque, tool wear, and product quality grades.
2. **Feature Engineering Pipeline:** Derives physics-informed indicators ($\Delta T = T_{proc} - T_{air}$, mechanical power $P = \frac{2\pi N}{60} \times \tau$, tool fatigue stress $Wear \times \tau$), performs one-hot encoding, and creates stratified train/test partitions.
3. **Target Leakage Safeguard:** Eliminates synthetic identifiers (`UDI`, `Product ID`) and direct post-failure flags (`TWF`, `HDF`, `PWF`, `OSF`, `RNF`) to ensure strict zero-leakage realistic test evaluation.
4. **Supervised Classification Models:** Benchmarks **Random Forest Classifier**, **Decision Tree (CART)**, and **Logistic Regression** with Precision, Recall, F1-Score, and Confusion Matrix diagnostics.
5. **Unsupervised Anomaly Clustering:** **K-Means Clustering** ($k=2..5$) with **2D PCA Projection** to uncover latent operational regimes without relying on failure annotations.
6. **Live Inference Simulator:** Real-time parameter sliders allowing engineers to simulate sensor readings and obtain instant model predictions, probability scores, confidence levels, and prescriptive maintenance recommendations.

---

## 🏗️ Machine Learning Architecture

```
                               ┌─────────────────────────────────┐
                               │   AI4I 2020 Raw Sensor Stream   │
                               │  (10,000 Telemetry Records)     │
                               └────────────────┬────────────────┘
                                                │
                                                ▼
                               ┌─────────────────────────────────┐
                               │    Data Preprocessing Stage     │
                               │  - Null audit (0 missing)       │
                               │  - Range & datatype validation  │
                               └────────────────┬────────────────┘
                                                │
                                                ▼
                               ┌─────────────────────────────────┐
                               │    Target Leakage Mitigation    │
                               │  - Drop: UDI, Product ID        │
                               │  - Isolate: TWF, HDF, PWF, OSF  │
                               └────────────────┬────────────────┘
                                                │
                                                ▼
                               ┌─────────────────────────────────┐
                               │   Physics Feature Engineering   │
                               │  - ΔT = T_process - T_air       │
                               │  - Mechanical Power (Watts)     │
                               │  - Tool Fatigue Stress Index    │
                               └────────┬───────────────┬────────┘
                                        │               │
                     ┌──────────────────┴──┐         ┌──┴──────────────────┐
                     ▼                     ▼         ▼                     ▼
          ┌─────────────────────┐  ┌──────────────────┐  ┌─────────────────────┐
          │    Random Forest    │  │  Decision Tree   │  │ Logistic Regression │
          │  Ensemble (Bagging) │  │  (Gini Splitting)│  │ (Sigmoid Baseline)  │
          └──────────┬──────────┘  └────────┬─────────┘  └──────────┬──────────┘
                     │                      │                       │
                     └──────────────────────┼───────────────────────┘
                                            ▼
                           ┌──────────────────────────────────┐
                           │      Evaluation & Diagnostics    │
                           │  - Stratified 80/20 Test Holdout │
                           │  - Confusion Matrix (TP, FP, FN) │
                           │  - Recall & Balanced F1-Score    │
                           └────────────────┬─────────────────┘
                                            │
                                            ▼
                           ┌──────────────────────────────────┐
                           │   Real-Time Inference Simulator  │
                           │  (Sub-15ms Prediction & Advice)  │
                           └──────────────────────────────────┘
```

---

## 📊 Dataset & Class Distribution

The dataset reflects typical real-world industrial environments characterized by **severe class imbalance**:
- **Total Records:** 10,000 continuous sensor instances.
- **Negative Class (y = 0):** 9,661 Normal instances (96.61%).
- **Positive Class (y = 1):** 339 Failure instances (3.39%).
- **Features Used in Model $X$:**
  - `product_type`: Categorical quality variant (L: 50%, M: 30%, H: 20%).
  - `air_temperature`: Continuous ambient temperature $[K]$.
  - `process_temperature`: Continuous internal milling temperature $[K]$.
  - `rotational_speed`: Continuous spindle speed $[rpm]$.
  - `torque`: Continuous mechanical torque $[Nm]$.
  - `tool_wear`: Continuous cumulative cutting time $[min]$.
  - `temp_difference`: Derived thermodynamic differential $[K]$.
  - `power_output`: Derived mechanical dissipation $[Watts]$.

---

## 🧪 Model Benchmarking

| Classifier Model | Accuracy (%) | Precision (%) | Recall (%) | F1-Score (%) | True Positives | False Positives |
|---|---|---|---|---|---|---|
| **Random Forest** | **98.6%** | **88.2%** | **81.4%** | **84.7%** | 57 / 70 | 8 |
| **Decision Tree** | 97.2% | 76.5% | 74.3% | 75.4% | 52 / 70 | 16 |
| **Logistic Regression** | 96.9% | 68.0% | 48.6% | 56.7% | 34 / 70 | 16 |

> **Why Recall is Critical:** In predictive maintenance, a False Negative (missed breakdown) leads to catastrophic spindle seizure costing thousands of dollars, whereas a False Positive (false alarm) only triggers a standard preventive inspection.

---

## 🚀 How to Run Locally

### Prerequisites
- Python 3.10+
- Node.js v18+ and npm

### Method 1: One-Click Windows Launcher (Recommended)
Double-click:
```cmd
run_full_system.bat
```
This automatically launches the FastAPI backend on `http://127.0.0.1:8000` (serving both the REST API and the built React frontend) and opens your browser.

---

### Method 2: Manual Terminal Execution

#### 1. Backend Server
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Backend runs at: **`http://127.0.0.1:8000`**  
Interactive API Documentation: **`http://127.0.0.1:8000/docs`**

#### 2. Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: **`http://localhost:3000`**

---

## 📑 Machine Learning FAQ & Design Rationale

1. **Why is raw accuracy misleading for this dataset?**  
   *Design Rationale:* Due to the 96.6% class imbalance, a dummy model always predicting "Normal" would achieve 96.6% accuracy while completely missing all 339 breakdowns. Precision, Recall, and F1-Score are required to evaluate true model effectiveness.

2. **Why are TWF, HDF, PWF, OSF, and RNF excluded from features?**  
   *Design Rationale:* These flags represent failure modes recorded *after* a breakdown occurs. Including them would introduce **target leakage**, resulting in an unrealistic 100% test score that fails in actual real-world production.

3. **What is the purpose of deriving $\Delta T$ and Mechanical Power?**  
   *Design Rationale:* Physics-informed features provide the decision tree models with orthogonal thermodynamic and mechanical energy indicators, enabling tighter decision splits than raw temperature or speed alone.

4. **How does K-Means complement the supervised models?**  
   *Design Rationale:* K-Means operates without failure labels to group sensor telemetry into operational regimes (e.g., high-speed light cutting vs heavy high-torque cutting). This allows anomaly detection even when new unseen failure types occur.
