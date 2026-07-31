import pandas as pd
import numpy as np
import os
import logging
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def load_data():
    possible_paths = [
        os.path.join(os.path.dirname(__file__), '..', 'dataset', 'telecom_churn.csv'),
        os.path.join('dataset', 'telecom_churn.csv'),
        'telecom_churn.csv'
    ]
    
    csv_path = None
    for path in possible_paths:
        if os.path.exists(path):
            csv_path = path
            break
            
    if not csv_path:
        raise FileNotFoundError("telecom_churn.csv not found in dataset directories.")
        
    logger.info(f"Loading dataset from: {csv_path}")
    df = pd.read_csv(csv_path)
    return df

def preprocess_dataset(df):
    logger.info("Preprocessing dataset...")
    df = df.copy()
    
    # Handle TotalCharges missing/space values
    if 'TotalCharges' in df.columns:
        df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
        df['TotalCharges'] = df['TotalCharges'].fillna(df['tenure'] * df['MonthlyCharges'])
    elif 'total_charges' in df.columns:
        df['total_charges'] = pd.to_numeric(df['total_charges'], errors='coerce')
        
    # Map target column
    if 'Churn' in df.columns:
        if df['Churn'].dtype == object:
            df['churn_target'] = df['Churn'].apply(lambda x: 1 if str(x).strip().lower() == 'yes' or str(x) == '1' else 0)
        else:
            df['churn_target'] = df['Churn'].astype(int)
    elif 'churn' in df.columns:
        df['churn_target'] = df['churn'].astype(int)
    else:
        raise ValueError("Target column 'Churn' not found in dataset.")

    # Standardize column names or extract explicit required features
    tenure = df['tenure'].astype(float) if 'tenure' in df.columns else df['tenureMonths'].astype(float)
    monthly_charges = df['MonthlyCharges'].astype(float) if 'MonthlyCharges' in df.columns else df['monthly_charges'].astype(float)
    total_charges = df['TotalCharges'].astype(float) if 'TotalCharges' in df.columns else df['total_charges'].astype(float)

    if 'Contract' in df.columns:
        contract_mtm = df['Contract'].apply(lambda x: 1 if str(x).strip() == 'Month-to-month' else 0)
    else:
        contract_mtm = df.get('contract_mtm', 0).astype(int)

    if 'InternetService' in df.columns:
        fiber_optic = df['InternetService'].apply(lambda x: 1 if str(x).strip() == 'Fiber optic' else 0)
    else:
        fiber_optic = df.get('fiber_optic', 0).astype(int)

    if 'TechSupport' in df.columns:
        tech_support = df['TechSupport'].apply(lambda x: 1 if str(x).strip().lower() in ['yes', 'true', '1'] else 0)
    else:
        tech_support = df.get('tech_support', 0).astype(int)

    if 'PaymentMethod' in df.columns:
        elec_check = df['PaymentMethod'].apply(lambda x: 1 if str(x).strip() == 'Electronic check' else 0)
    else:
        elec_check = df.get('elec_check', 0).astype(int)

    X = pd.DataFrame({
        'tenure': tenure,
        'monthly_charges': monthly_charges,
        'total_charges': total_charges,
        'contract_mtm': contract_mtm,
        'fiber_optic': fiber_optic,
        'tech_support': tech_support,
        'elec_check': elec_check
    })

    y = df['churn_target']

    return X, y

def train_churn_model():
    try:
        logger.info("[+] Starting Customer Churn Model Training Pipeline...")
        df = load_data()
        X, y = preprocess_dataset(df)

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        # Re-wrap in DataFrame to keep column names
        X_train_scaled_df = pd.DataFrame(X_train_scaled, columns=X.columns)
        X_test_scaled_df = pd.DataFrame(X_test_scaled, columns=X.columns)

        models = {
            'Random Forest': RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42),
            'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=4, random_state=42)
        }

        results = {}
        best_model_name = None
        best_auc = -1.0
        best_model = None

        for name, model in models.items():
            logger.info(f"Training {name} model...")
            model.fit(X_train_scaled_df, y_train)

            y_pred = model.predict(X_test_scaled_df)
            y_proba = model.predict_proba(X_test_scaled_df)[:, 1]

            acc = accuracy_score(y_test, y_pred)
            prec = precision_score(y_test, y_pred, zero_division=0)
            rec = recall_score(y_test, y_pred, zero_division=0)
            f1 = f1_score(y_test, y_pred, zero_division=0)
            auc = roc_auc_score(y_test, y_proba)

            results[name] = {
                'accuracy': acc,
                'precision': prec,
                'recall': rec,
                'f1_score': f1,
                'roc_auc': auc,
                'model': model
            }

            logger.info(f"[{name}] Evaluation Metrics:")
            logger.info(f"  - Accuracy:  {acc:.4f}")
            logger.info(f"  - Precision: {prec:.4f}")
            logger.info(f"  - Recall:    {rec:.4f}")
            logger.info(f"  - F1-Score:  {f1:.4f}")
            logger.info(f"  - ROC-AUC:   {auc:.4f}")

            if auc > best_auc:
                best_auc = auc
                best_model_name = name
                best_model = model

        logger.info(f"[✓] Best Performing Model Selected: {best_model_name} (ROC-AUC: {best_auc:.4f})")

        output_dir = os.path.join(os.path.dirname(__file__))
        os.makedirs(output_dir, exist_ok=True)

        model_save_path = os.path.join(output_dir, 'trained_model.joblib')
        preprocessor_save_path = os.path.join(output_dir, 'preprocessor.joblib')

        joblib.dump(best_model, model_save_path)
        joblib.dump(scaler, preprocessor_save_path)

        logger.info(f"[✓] Saved model to {model_save_path}")
        logger.info(f"[✓] Saved preprocessor scaler to {preprocessor_save_path}")

        return {
            'best_model': best_model_name,
            'metrics': results[best_model_name]
        }

    except Exception as e:
        logger.error(f"[!] Exception encountered during model training: {e}")
        raise e

if __name__ == '__main__':
    train_churn_model()

