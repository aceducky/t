import streamlit as st
import requests

# --------------------------------------------------
# Config
# --------------------------------------------------
API_URL = "http://localhost:8000/api/predict"

st.set_page_config(
    page_title="Liver Disease Predictor",
    page_icon="🧪",
    layout="centered",
)

# --------------------------------------------------
# Session state routing
# --------------------------------------------------
if "page" not in st.session_state:
    st.session_state.page = "home"


# --------------------------------------------------
# Home Page
# --------------------------------------------------
def home_page():
    st.title("🧪 Liver Disease Risk Prediction")

    st.markdown(
        """
        This application predicts **liver disease risk** using a machine learning model
        trained on clinical laboratory data.

        ⚠️ **Disclaimer:**  
        This tool is for **educational purposes only** and does **not** replace
        professional medical advice.
        """
    )

    st.markdown("---")

    col1, col2 = st.columns(2)

    with col1:
        st.markdown("### 🔬 What does it use?")
        st.write(
            """
            - Age & Gender  
            - Bilirubin levels  
            - Liver enzymes (ALT, AST)  
            - Protein markers  
            """
        )

    with col2:
        st.markdown("### 📊 What does it give?")
        st.write(
            """
            - Risk classification  
            - Confidence score  
            - Highlighted abnormal values  
            """
        )

    st.markdown("---")

    if st.button("🚀 Get Started"):
        st.session_state.page = "predict"


# --------------------------------------------------
# Predict Page
# --------------------------------------------------
def predict_page():
    st.title("📋 Enter Patient Details")

    st.caption("All values should be numeric. Units are indicated where applicable.")

    with st.form("prediction_form"):
        # --- Demographics ---
        st.subheader("👤 Demographics")
        age = st.slider("Age (years)", 0, 120, 35)
        gender = st.selectbox("Gender", options=[("Female", 0), ("Male", 1)], format_func=lambda x: x[0])[1]

        # --- Bilirubin ---
        st.subheader("🧪 Bilirubin Levels")
        total_bilirubin = st.number_input("Total Bilirubin (mg/dL)", min_value=0.0, value=0.8)
        direct_bilirubin = st.number_input("Direct Bilirubin (mg/dL)", min_value=0.0, value=0.2)

        # --- Enzymes ---
        st.subheader("🧬 Liver Enzymes")
        alkaline_phosphatase = st.number_input("Alkaline Phosphatase (IU/L)", min_value=0.0, value=120.0)
        alt = st.number_input("ALT / SGPT (IU/L)", min_value=0.0, value=30.0)
        ast = st.number_input("AST / SGOT (IU/L)", min_value=0.0, value=28.0)

        # --- Proteins ---
        st.subheader("🧫 Protein Markers")
        total_proteins = st.number_input("Total Proteins (g/dL)", min_value=0.0, value=7.0)
        albumin = st.number_input("Albumin (g/dL)", min_value=0.0, value=4.2)
        ag_ratio = st.number_input("A/G Ratio", min_value=0.0, value=1.2)

        submitted = st.form_submit_button("🔍 Predict")

    if not submitted:
        return

    # --------------------------------------------------
    # Frontend validation
    # --------------------------------------------------
    if direct_bilirubin > total_bilirubin:
        st.error("Direct bilirubin cannot be greater than total bilirubin.")
        return

    payload = {
        "age": age,
        "gender": gender,
        "total_bilirubin": total_bilirubin,
        "direct_bilirubin": direct_bilirubin,
        "alkaline_phosphatase": alkaline_phosphatase,
        "alt": alt,
        "ast": ast,
        "total_proteins": total_proteins,
        "albumin": albumin,
        "ag_ratio": ag_ratio,
    }

    # --------------------------------------------------
    # API Call
    # --------------------------------------------------
    with st.spinner("Running prediction..."):
        try:
            response = requests.post(API_URL, json=payload, timeout=10)
        except requests.RequestException as e:
            st.error(f"Could not connect to backend API: {e}")
            return

    if response.status_code != 200:
        st.error("Prediction failed.")
        st.json(response.json())
        return

    result = response.json()

    # --------------------------------------------------
    # Display Results
    # --------------------------------------------------
    st.markdown("---")
    st.subheader("🩺 Prediction Result")

    if result["risk"] == "High Risk":
        st.error(f"**{result['prediction']}**")
    else:
        st.success(f"**{result['prediction']}**")

    st.metric("Confidence", f"{result['confidence'] * 100:.1f}%")
    st.write(result["summary"])

    if result["warnings"]:
        st.markdown("### ⚠️ Abnormal Findings")
        for w in result["warnings"]:
            if w["severity"] == "high":
                st.error(w["message"])
            elif w["severity"] == "moderate":
                st.warning(w["message"])
            else:
                st.info(w["message"])
    else:
        st.success("No abnormal lab values detected.")

    st.markdown("---")

    if st.button("⬅ Back to Home"):
        st.session_state.page = "home"


# --------------------------------------------------
# Router
# --------------------------------------------------
if st.session_state.page == "home":
    home_page()
else:
    predict_page()
