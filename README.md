# Customer Churn Prediction System

A production-ready end-to-end Machine Learning and Analytics Web Platform for forecasting customer churn probability, evaluating financial risk, analyzing segment churn patterns, and executing retention workflows.

## System Architecture

- **Machine Learning Engine**: Gradient Boosting & Random Forest models trained on customer demographic, subscription, and billing features with standard scaler preprocessing.
- **Backend Service**: Python Flask REST API (`/api/predict`, `/api/customers`, `/api/metrics`, `/api/retrain`, `/health`).
- **Frontend Dashboard**: React 18, TypeScript, Tailwind CSS, Recharts analytics, and interactive churn predictor.
- **Containerization**: Docker multi-stage builds & Docker Compose setup for instant reproducible deployment.

## Repository Structure

```
.
├── backend/
│   └── app.py                # Flask REST API server
├── ml_model/
│   ├── train.py              # ML model training pipeline & metrics evaluation
│   ├── predict.py            # Inference engine with artifact caching & validation
│   ├── trained_model.joblib  # Saved trained model artifact
│   └── preprocessor.joblib   # Saved preprocessor scaler artifact
├── dataset/
│   └── telecom_churn.csv     # Customer churn dataset
├── src/                      # React TypeScript application
│   ├── components/           # Dashboard, Predictor, Segment & Model views
│   ├── data/                 # Data stores & prediction utilities
│   ├── utils/                # ZIP packaging & download utilities
│   ├── types.ts              # TypeScript domain models
│   ├── App.tsx               # Main Application Container
│   └── main.tsx              # Application Entry Point
├── Dockerfile                # Docker multi-stage build container
├── docker-compose.yml        # Multi-container orchestration
├── requirements.txt          # Python ML & Backend dependencies
├── package.json              # Frontend Node dependencies
├── .env.example              # Environment variables template
└── README.md                 # System Documentation
```

## Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 20+
- Docker & Docker Compose (Optional)

### Option 1: Docker Compose (Recommended)
```bash
docker-compose up --build
```
Navigate to `http://localhost:3000` in your browser.

### Option 2: Manual Local Setup

1. **Train Machine Learning Model & Start Backend API**:
```bash
pip install -r requirements.txt
python ml_model/train.py
python backend/app.py
```

2. **Start Frontend Dashboard**:
```bash
npm install
npm run dev
```

## Machine Learning Model Evaluation

The model training pipeline (`ml_model/train.py`) trains and evaluates multiple classifiers (Random Forest and Gradient Boosting Classifier) using stratified train-test splits and outputs real-time performance metrics upon execution:

- **Metrics Calculated**: Accuracy, Precision, Recall, F1 Score, and ROC-AUC.
- **Artifact Generation**: The best performing model artifact and fitted scaler are automatically persisted to `ml_model/trained_model.joblib` and `ml_model/preprocessor.joblib`.
- **Primary Risk Factors**: Contract Type (Month-to-month), Tenure, Tech Support status, Internet Service Type (Fiber Optic), and Monthly Billing Charges.

## License
Apache License 2.0 - Open source enterprise system.
