import logging
from contextlib import asynccontextmanager
from typing import List, Literal

import joblib
import numpy as np
import pandas as pd
import shap
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, model_validator

# --------------------------------------------------
# Logging
# --------------------------------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("app")

# --------------------------------------------------
# Config
# --------------------------------------------------
MODEL_PATH = "ensemble_model.pkl"

FEATURE_NAMES = [
    "Age",
    "Gender",
    "TB",
    "DB",
    "Alkphos",
    "SGPT",
    "SGOT",
    "TP",
    "ALB",
    "A/G Ratio",
]

# Human-readable feature names for display
FEATURE_DISPLAY_NAMES = {
    "Age": "Age",
    "Gender": "Gender",
    "TB": "Total Bilirubin",
    "DB": "Direct Bilirubin",
    "Alkphos": "Alkaline Phosphatase",
    "SGPT": "ALT (SGPT)",
    "SGOT": "AST (SGOT)",
    "TP": "Total Proteins",
    "ALB": "Albumin",
    "A/G Ratio": "A/G Ratio",
}

TOP_K_FEATURES = 6  # same as during training

# --------------------------------------------------
# Input schema (NO lower-limit enforcement)
# --------------------------------------------------
class PredictionInput(BaseModel):
    age: float = Field(..., ge=0, le=120)
    gender: int = Field(..., ge=0, le=1)

    total_bilirubin: float = Field(..., ge=0)
    direct_bilirubin: float = Field(..., ge=0)

    alkaline_phosphatase: float = Field(..., ge=0)
    alt: float = Field(..., ge=0)
    ast: float = Field(..., ge=0)

    total_proteins: float = Field(..., ge=0)
    albumin: float = Field(..., ge=0)
    ag_ratio: float = Field(..., ge=0)

    @model_validator(mode="after")
    def validate_bilirubin(self):
        if self.direct_bilirubin > self.total_bilirubin:
            raise ValueError(
                "direct_bilirubin cannot exceed total_bilirubin"
            )
        return self

    def to_dataframe(self) -> pd.DataFrame:
        return pd.DataFrame(
            [[
                self.age,
                self.gender,
                self.total_bilirubin,
                self.direct_bilirubin,
                self.alkaline_phosphatase,
                self.alt,
                self.ast,
                self.total_proteins,
                self.albumin,
                self.ag_ratio,
            ]],
            columns=FEATURE_NAMES,
        )

# --------------------------------------------------
# Output schemas
# --------------------------------------------------
Severity = Literal["mild", "moderate", "high"]

class MedicalWarning(BaseModel):
    marker: str
    value: float
    upper_limit: float
    severity: Severity
    message: str

class ShapContribution(BaseModel):
    """SHAP contribution for a single feature."""
    feature: str
    value: float
    contribution: float
    impact: Literal["positive", "negative"]

class PredictionResponse(BaseModel):
    prediction: str
    risk: str
    summary: str
    warnings: List[MedicalWarning]
    shap_contributions: List[ShapContribution]
    base_value: float

# --------------------------------------------------
# Load model bundle
# --------------------------------------------------
def load_model():
    bundle = joblib.load(MODEL_PATH)

    model = bundle.get("model")
    scaler = bundle.get("scaler")
    selector = bundle.get("selector")

    if not all([model, scaler, selector]):
        raise RuntimeError("Model bundle missing required components")

    logger.info("Model, scaler, and selector loaded")
    return model, scaler, selector

def create_shap_explainer(model, selector):
    """Create a SHAP TreeExplainer using the XGBoost base learner."""
    try:
        # Get the XGBoost model from the stacking classifier
        xgb_model = model.named_estimators_["xgb"]
        
        # Create TreeExplainer for fast SHAP computation
        explainer = shap.TreeExplainer(xgb_model)
        
        logger.info("SHAP TreeExplainer created successfully")
        return explainer
    except Exception as e:
        logger.warning(f"Failed to create TreeExplainer, falling back to Explainer: {e}")
        # Fallback to general Explainer
        xgb_model = model.named_estimators_["xgb"]
        explainer = shap.Explainer(xgb_model)
        return explainer

# --------------------------------------------------
# Warning generation (simple & readable)
# --------------------------------------------------
def generate_warnings(data: PredictionInput) -> List[MedicalWarning]:
    rules = [
        ("Alkaline Phosphatase", data.alkaline_phosphatase, 147.0),
        ("ALT / SGPT", data.alt, 56.0),
        ("AST / SGOT", data.ast, 48.0),
        ("Total Bilirubin", data.total_bilirubin, 1.2),
        ("Direct Bilirubin", data.direct_bilirubin, 0.3),
    ]

    warnings: List[MedicalWarning] = []

    for marker, value, upper in rules:
        if value <= upper:
            continue

        ratio = value / upper

        if ratio >= 3:
            severity: Severity = "high"
            label = "highly elevated"
        elif ratio >= 1.5:
            severity = "moderate"
            label = "moderately elevated"
        else:
            severity = "mild"
            label = "mildly elevated"

        warnings.append(
            MedicalWarning(
                marker=marker,
                value=round(value, 2),
                upper_limit=upper,
                severity=severity,
                message=f"{marker} is {label} (normal upper limit {upper}).",
            )
        )

    return warnings

def generate_summary(prediction: int, warnings: List[MedicalWarning]) -> str:
    if prediction == 0:
        return (
            "No liver disease detected based on the model prediction."
            if not warnings
            else "Low overall risk, with some abnormal lab values."
        )

    return (
        "High risk of liver disease detected."
        if not warnings
        else "High risk of liver disease detected, driven by abnormal lab values."
    )

def compute_shap_contributions(
    explainer: shap.Explainer,
    X_selected: np.ndarray,
    selected_feature_names: List[str],
    original_values: List[float],
) -> tuple[List[ShapContribution], float]:
    """Compute SHAP values and return contributions list."""
    
    # Get SHAP values
    shap_values = explainer.shap_values(X_selected)
    
    # Handle different SHAP output formats
    if isinstance(shap_values, list):
        # Binary classification: use class 1 (disease) SHAP values
        shap_vals = shap_values[1][0] if len(shap_values) > 1 else shap_values[0][0]
    else:
        shap_vals = shap_values[0]
    
    # Get base value (expected value)
    if isinstance(explainer.expected_value, (list, np.ndarray)):
        base_value = float(explainer.expected_value[1]) if len(explainer.expected_value) > 1 else float(explainer.expected_value[0])
    else:
        base_value = float(explainer.expected_value)
    
    contributions = []
    for i, (feature_name, shap_val) in enumerate(zip(selected_feature_names, shap_vals)):
        display_name = FEATURE_DISPLAY_NAMES.get(feature_name, feature_name)
        contributions.append(
            ShapContribution(
                feature=display_name,
                value=round(original_values[i], 2),
                contribution=round(float(shap_val), 4),
                impact="positive" if shap_val > 0 else "negative",
            )
        )
    
    # Sort by absolute contribution (most impactful first)
    contributions.sort(key=lambda x: abs(x.contribution), reverse=True)
    
    return contributions, base_value

# --------------------------------------------------
# FastAPI app
# --------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model, app.state.scaler, app.state.selector = load_model()
    app.state.shap_explainer = create_shap_explainer(app.state.model, app.state.selector)
    
    # Pre-compute selected feature indices
    importances = app.state.selector.feature_importances_
    top_idx = np.argsort(importances)[-TOP_K_FEATURES:]
    app.state.top_feature_idx = np.sort(top_idx)
    app.state.selected_feature_names = [FEATURE_NAMES[i] for i in app.state.top_feature_idx]
    
    logger.info(f"Selected features: {app.state.selected_feature_names}")
    yield

app = FastAPI(
    title="Liver Disease Prediction API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Clean validation errors
# --------------------------------------------------
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError
):
    details = [
        f"{err['loc'][-1]}: {err['msg']}"
        for err in exc.errors()
    ]
    return JSONResponse(
        status_code=400,
        content={
            "error": "Invalid input data",
            "details": details,
        },
    )

# --------------------------------------------------
# Routes
# --------------------------------------------------
@app.get("/api/health")
def health():
    return {
        "model_loaded": True,
        "shap_enabled": app.state.shap_explainer is not None,
        "selected_features": app.state.selected_feature_names,
    }

@app.post("/api/predict", response_model=PredictionResponse)
def predict(data: PredictionInput):
    try:
        # 1) Build DataFrame (10 features)
        X_df = data.to_dataframe()

        # 2) Scale (10 → 10)
        X_scaled = app.state.scaler.transform(X_df)

        # 3) Feature selection (10 → 6)
        X_selected = X_scaled[:, app.state.top_feature_idx]
        
        # Get original (unscaled) values for the selected features
        original_values = X_df.values[0][app.state.top_feature_idx].tolist()

        # 4) Predict
        y = int(app.state.model.predict(X_selected)[0])

        # 5) Compute SHAP contributions
        shap_contributions, base_value = compute_shap_contributions(
            app.state.shap_explainer,
            X_selected,
            app.state.selected_feature_names,
            original_values,
        )

        warnings = generate_warnings(data)
        summary = generate_summary(y, warnings)

        return PredictionResponse(
            prediction="Liver Disease Detected" if y == 1 else "No Liver Disease Detected",
            risk="High Risk" if y == 1 else "Low Risk",
            summary=summary,
            warnings=warnings,
            shap_contributions=shap_contributions,
            base_value=round(base_value, 4),
        )

    except Exception as exc:
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail="Prediction failed") from exc
