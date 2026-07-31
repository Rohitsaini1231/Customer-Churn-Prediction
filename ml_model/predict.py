import os
import logging
import joblib
import pandas as pd
import numpy as np

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

_model_cache = None
_preprocessor_cache = None

REQUIRED_FEATURES = [
    'tenure',
    'monthly_charges',
    'total_charges',
    'contract_mtm',
    'fiber_optic',
    'tech_support',
    'elec_check'
]

def load_artifacts():
    global _model_cache, _preprocessor_cache

    if _model_cache is not None:
        return _model_cache, _preprocessor_cache

    base_dir = os.path.dirname(__file__)

    model_paths = [
        os.path.join(base_dir, 'trained_model.joblib'),
        os.path.join('ml_model', 'trained_model.joblib'),
        'trained_model.joblib'
    ]

    for mp in model_paths:
        if os.path.exists(mp):
            try:
                _model_cache = joblib.load(mp)
                logger.info(f"Loaded model from {mp}")
                break
            except Exception as e:
                logger.error(f"Error loading model from {mp}: {e}")

    preprocessor_paths = [
        os.path.join(base_dir, 'preprocessor.joblib'),
        os.path.join('ml_model', 'preprocessor.joblib'),
        'preprocessor.joblib'
    ]

    for pp in preprocessor_paths:
        if os.path.exists(pp):
            try:
                _preprocessor_cache = joblib.load(pp)
                logger.info(f"Loaded preprocessor from {pp}")
                break
            except Exception as e:
                logger.error(f"Error loading preprocessor from {pp}: {e}")

    if _model_cache is None:
        raise FileNotFoundError("Trained model file (trained_model.joblib) not found. Please run train.py first.")

    return _model_cache, _preprocessor_cache

def validate_and_format_input(data_dict):
    if not isinstance(data_dict, dict):
        raise ValueError("Input data must be a dictionary")

    tenure = float(data_dict.get('tenure', data_dict.get('tenureMonths', 12)))
    if tenure < 0:
        raise ValueError("tenure must be non-negative")

    monthly_charges = float(data_dict.get('monthly_charges', data_dict.get('monthlyCharges', 70.0)))
    if monthly_charges < 0:
        raise ValueError("monthly_charges must be non-negative")

    total_charges_raw = data_dict.get('total_charges', data_dict.get('totalCharges'))
    if total_charges_raw is not None and total_charges_raw != '':
        total_charges = float(total_charges_raw)
        if total_charges < 0:
            raise ValueError("total_charges must be non-negative")
    else:
        total_charges = round(tenure * monthly_charges, 2)

    contract = str(data_dict.get('contract', ''))
    contract_mtm = 1 if (contract == 'Month-to-month' or data_dict.get('contract_mtm') in [1, True, '1']) else 0

    internet = str(data_dict.get('internetService', ''))
    fiber_optic = 1 if (internet == 'Fiber optic' or data_dict.get('fiber_optic') in [1, True, '1']) else 0

    tech_sup = data_dict.get('techSupport')
    tech_support = 1 if (tech_sup in [True, 'Yes', 1, '1'] or data_dict.get('tech_support') in [1, True, '1']) else 0

    payment = str(data_dict.get('paymentMethod', ''))
    elec_check = 1 if (payment == 'Electronic check' or data_dict.get('elec_check') in [1, True, '1']) else 0

    df = pd.DataFrame([{
        'tenure': tenure,
        'monthly_charges': monthly_charges,
        'total_charges': total_charges,
        'contract_mtm': contract_mtm,
        'fiber_optic': fiber_optic,
        'tech_support': tech_support,
        'elec_check': elec_check
    }], columns=REQUIRED_FEATURES)

    return df

def predict_single(data_dict):
    try:
        model, preprocessor = load_artifacts()
        features_df = validate_and_format_input(data_dict)

        if preprocessor is not None:
            try:
                scaled_arr = preprocessor.transform(features_df)
                input_data = pd.DataFrame(scaled_arr, columns=REQUIRED_FEATURES)
            except Exception as e:
                logger.warning(f"Preprocessor transform failed: {e}. Falling back to raw features.")
                input_data = features_df
        else:
            input_data = features_df

        prediction_class = int(model.predict(input_data)[0])
        probabilities = model.predict_proba(input_data)[0]
        churn_prob = float(probabilities[1])

        label = "Churn" if prediction_class == 1 else "No Churn"

        return {
            'prediction': prediction_class,
            'prediction_label': label,
            'churn_probability': round(churn_prob, 4),
            'no_churn_probability': round(float(probabilities[0]), 4)
        }

    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise RuntimeError(f"Model prediction execution error: {str(e)}")

if __name__ == '__main__':
    sample = {
        'tenure': 3,
        'monthly_charges': 104.8,
        'total_charges': 314.4,
        'contract_mtm': 1,
        'fiber_optic': 1,
        'tech_support': 0,
        'elec_check': 1
    }
    result = predict_single(sample)
    print(f"Prediction Result: {result}")

