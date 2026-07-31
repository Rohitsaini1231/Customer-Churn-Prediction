import pandas as pd
import numpy as np
import os
import logging
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


def load_data():
    possible_paths = [
        os.path.join(os.path.dirname(__file__), "..", "dataset", "telecom_churn.csv"),
        os.path.join("dataset", "telecom_churn.csv"),
        "telecom_churn.csv",
    ]

    for path in possible_paths:
        if os.path.exists(path):
            logger.info(f"Loading dataset: {path}")
            return pd.read_csv(path)

    raise FileNotFoundError("telecom_churn.csv not found.")


def preprocess_dataset(df):
    df = df.copy()

    if "TotalCharges" in df.columns:
        df["TotalCharges"] = pd.to_numeric(df["TotalCharges"], errors="coerce")
        df["TotalCharges"] = df["TotalCharges"].fillna(
            df["tenure"] * df["MonthlyCharges"]
        )

    # Target column
    if "Churn" in df.columns:
        df["churn_target"] = (
            df["Churn"]
            .astype(str)
            .str.strip()
            .str.lower()
            .map({"yes": 1, "no": 0, "1": 1, "0": 0})
        )

        if df["churn_target"].isna().any():
            raise ValueError("Invalid values found in Churn column.")

    else:
        raise ValueError("Churn column not found.")

    X = pd.DataFrame({
        "tenure": df["tenure"].astype(float),
        "monthly_charges": df["MonthlyCharges"].astype(float),
        "total_charges": df["TotalCharges"].astype(float),
        "contract_mtm": (
            df["Contract"] == "Month-to-month"
        ).astype(int),
        "fiber_optic": (
            df["InternetService"] == "Fiber optic"
        ).astype(int),
        "tech_support": (
            df["TechSupport"] == "Yes"
        ).astype(int),
        "elec_check": (
            df["PaymentMethod"] == "Electronic check"
        ).astype(int),
    })

    y = df["churn_target"].astype(int)

    return X, y


def train_churn_model():
    logger.info("Starting training...")

    df = load_data()
    X, y = preprocess_dataset(df)

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )

    scaler = StandardScaler()

    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    models = {
        "Random Forest": RandomForestClassifier(
            n_estimators=100,
            random_state=42,
            max_depth=8,
        ),
        "Gradient Boosting": GradientBoostingClassifier(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=4,
            random_state=42,
        ),
    }

    best_model = None
    best_auc = 0

    for name, model in models.items():
        logger.info(f"Training {name}")

        model.fit(X_train, y_train)

        pred = model.predict(X_test)
        proba = model.predict_proba(X_test)[:, 1]

        acc = accuracy_score(y_test, pred)
        auc = roc_auc_score(y_test, proba)

        logger.info(f"{name}")
        logger.info(f"Accuracy : {acc:.4f}")
        logger.info(f"ROC AUC  : {auc:.4f}")
        logger.info(f"Precision: {precision_score(y_test,pred):.4f}")
        logger.info(f"Recall   : {recall_score(y_test,pred):.4f}")
        logger.info(f"F1 Score : {f1_score(y_test,pred):.4f}")

        if auc > best_auc:
            best_auc = auc
            best_model = model

    model_path = os.path.join(
        os.path.dirname(__file__),
        "trained_model.joblib",
    )

    scaler_path = os.path.join(
        os.path.dirname(__file__),
        "preprocessor.joblib",
    )

    joblib.dump(best_model, model_path)
    joblib.dump(scaler, scaler_path)

    logger.info("Model Saved Successfully")
    logger.info(model_path)
    logger.info(scaler_path)


if __name__ == "__main__":
    train_churn_model()