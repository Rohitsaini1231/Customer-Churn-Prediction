from flask import Flask, request, jsonify
from flask_cors import CORS
import os
app=Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"status":"running","message":"Customer Churn Prediction Demo API"})

@app.route("/health")
@app.route("/api/health")
def health():
    return jsonify({"status":"active","system":"Customer Churn Prediction Demo","model_loaded":False,"version":"demo-1.0"})

@app.route("/predict",methods=["POST"])
@app.route("/api/predict",methods=["POST"])
def predict():
    data=request.get_json(silent=True) or {}
    tenure=float(data.get("tenureMonths",data.get("tenure",12)))
    monthly=float(data.get("monthlyCharges",70))
    if monthly>80 or tenure<6:
        prediction=1
        probability=0.82
    else:
        prediction=0
        probability=0.18
    if probability>=0.75:risk="Critical"
    elif probability>=0.50:risk="High"
    elif probability>=0.25:risk="Medium"
    else:risk="Low"
    return jsonify({
      "status":"success",
      "prediction":prediction,
      "churnProbability":probability,
      "churn_probability":probability,
      "riskLevel":risk,
      "risk_level":risk,
      "monthlyRevenueAtRisk":round(monthly*probability,2),
      "revenue_at_risk":round(monthly*probability,2),
      "estimatedLtvLoss":round(monthly*24*probability,2),
      "estimated_ltv_loss":round(monthly*24*probability,2)
    })

if __name__=="__main__":
    port=int(os.environ.get("PORT",5000))
    app.run(host="0.0.0.0",port=port)