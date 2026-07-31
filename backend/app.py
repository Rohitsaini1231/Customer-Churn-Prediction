from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'ml_model')
MODEL_PATH = os.path.join(MODEL_DIR, 'trained_model.joblib')
PREPROCESSOR_PATH = os.path.join(MODEL_DIR, 'preprocessor.joblib')

_cached_model = None
_cached_preprocessor = None

def get_model_and_preprocessor():
    global _cached_model, _cached_preprocessor
    if _cached_model is not None:
        return _cached_model, _cached_preprocessor

    target_paths = [
        MODEL_PATH,
        os.path.join('ml_model', 'trained_model.joblib'),
        os.path.abspath('ml_model/trained_model.joblib'),
    ]

    for path in target_paths:
        if os.path.exists(path):
            try:
                _cached_model = joblib.load(path)
                break
            except Exception as e:
                app.logger.error(f"Error loading model from {path}: {e}")

    preproc_paths = [
        PREPROCESSOR_PATH,
        os.path.join('ml_model', 'preprocessor.joblib'),
        os.path.abspath('ml_model/preprocessor.joblib'),
    ]
    for path in preproc_paths:
        if os.path.exists(path):
            try:
                _cached_preprocessor = joblib.load(path)
                break
            except Exception as e:
                app.logger.error(f"Error loading preprocessor from {path}: {e}")

    if _cached_model is None:
        try:
            from ml_model.train import train_churn_model
            train_churn_model()
            for path in target_paths:
                if os.path.exists(path):
                    _cached_model = joblib.load(path)
                    break
        except Exception as e:
            app.logger.error(f"Failed to auto-train model: {e}")

    return _cached_model, _cached_preprocessor

@app.route('/health', methods=['GET'])
@app.route('/api/health', methods=['GET'])
def health_check():
    model, preprocessor = get_model_and_preprocessor()
    return jsonify({
        "status": "active",
        "system": "Customer Churn Prediction ML Engine",
        "model_loaded": model is not None,
        "preprocessor_loaded": preprocessor is not None,
        "version": "2.1.0"
    })

@app.route('/api/predict', methods=['POST'])
@app.route('/predict', methods=['POST'])
def predict_churn():
    try:
        data = request.get_json(silent=True) or {}

        # Validate numeric inputs
        try:
            tenure = float(data.get('tenureMonths', data.get('tenure', 12)))
            if tenure < 0:
                return jsonify({"error": "tenureMonths must be a non-negative number"}), 400
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid numerical value for tenureMonths"}), 400

        try:
            monthly_charges = float(data.get('monthlyCharges', data.get('monthly_charges', 70.0)))
            if monthly_charges < 0:
                return jsonify({"error": "monthlyCharges must be a non-negative number"}), 400
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid numerical value for monthlyCharges"}), 400

        total_charges_raw = data.get('totalCharges', data.get('total_charges'))
        if total_charges_raw is not None and total_charges_raw != '':
            try:
                total_charges = float(total_charges_raw)
                if total_charges < 0:
                    return jsonify({"error": "totalCharges must be a non-negative number"}), 400
            except (ValueError, TypeError):
                return jsonify({"error": "Invalid numerical value for totalCharges"}), 400
        else:
            total_charges = round(tenure * monthly_charges, 2)

        contract = str(data.get('contract', ''))
        contract_mtm = 1 if (contract == 'Month-to-month' or data.get('contract_mtm') in [1, True, '1']) else 0

        internet = str(data.get('internetService', ''))
        fiber_optic = 1 if (internet == 'Fiber optic' or data.get('fiber_optic') in [1, True, '1']) else 0

        tech_sup = data.get('techSupport')
        tech_support = 1 if (tech_sup in [True, 'Yes', 1, '1'] or data.get('tech_support') in [1, True, '1']) else 0

        payment = str(data.get('paymentMethod', ''))
        elec_check = 1 if (payment == 'Electronic check' or data.get('elec_check') in [1, True, '1']) else 0

        features_df = pd.DataFrame([{
            'tenure': tenure,
            'monthly_charges': monthly_charges,
            'total_charges': total_charges,
            'contract_mtm': contract_mtm,
            'fiber_optic': fiber_optic,
            'tech_support': tech_support,
            'elec_check': elec_check
        }])

        model, preprocessor = get_model_and_preprocessor()

        if preprocessor is not None:
            try:
                input_data = preprocessor.transform(features_df)
            except Exception as e:
                app.logger.warning(f"Preprocessing transform failed: {e}, using raw features.")
                input_data = features_df
        else:
            input_data = features_df

        if model is not None:
            prediction = int(model.predict(input_data)[0])
            probabilities = model.predict_proba(input_data)[0]
            churn_prob = float(probabilities[1])
        else:
            churn_prob = 0.50
            prediction = 1 if churn_prob >= 0.5 else 0

        prob = round(churn_prob, 4)

        if prob >= 0.75:
            risk_level = "Critical"
        elif prob >= 0.50:
            risk_level = "High"
        elif prob >= 0.25:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        monthly_revenue_at_risk = round(monthly_charges * prob, 2)
        estimated_ltv_loss = round(monthly_charges * 24 * prob, 2)

        return jsonify({
            "status": "success",
            "prediction": prediction,
            "churnProbability": prob,
            "churn_probability": prob,
            "riskLevel": risk_level,
            "risk_level": risk_level,
            "monthlyRevenueAtRisk": monthly_revenue_at_risk,
            "revenue_at_risk": monthly_revenue_at_risk,
            "estimatedLtvLoss": estimated_ltv_loss,
            "estimated_ltv_loss": estimated_ltv_loss
        })

    except Exception as e:
        app.logger.error(f"Error processing prediction request: {e}")
        return jsonify({"error": "Internal server error during prediction calculation", "details": str(e)}), 500

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)


