# %%
from google.colab import drive
import os


drive.mount('/content/drive')
os.chdir('/content/drive/My Drive/Colab Notebooks/')

# %%
%pip install -r requirements.txt -q

# %%
import warnings
warnings.filterwarnings("ignore")

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import (
    train_test_split,
    StratifiedKFold,
    cross_val_score,
)
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    classification_report,
    confusion_matrix,
)

from sklearn.ensemble import ExtraTreesClassifier, StackingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.feature_selection import SelectFromModel

from imblearn.combine import SMOTEENN

from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from catboost import CatBoostClassifier

import shap
import joblib

import sklearn
import xgboost
import lightgbm
import catboost

print(
    "sklearn:", sklearn.__version__,
    "| xgboost:", xgboost.__version__,
    "| lightgbm:", lightgbm.__version__,
    "| catboost:", catboost.__version__,
)

# %%
url = "ILPD.csv"
df = pd.read_csv(url, header=None)

df.columns = [
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
    "is_patient",
]

df.head()

# %%
print("Dataset Shape:", df.shape)
df.describe()

# %%
null_counts = df.isnull().sum()
print(null_counts)

plt.figure(figsize=(10, 4))
sns.barplot(x=null_counts.index, y=null_counts.values)
plt.xticks(rotation=45)
plt.title("Missing Values per Column")
plt.show()

# %%
df["A/G Ratio"] = pd.to_numeric(df["A/G Ratio"], errors="coerce")
df.dropna(inplace=True)

print("Shape after removing nulls:", df.shape)

# %%
df["Gender"] = LabelEncoder().fit_transform(df["Gender"].astype(str))
df["is_patient"] = df["is_patient"].replace(2, 0).astype(int)

sns.countplot(x="is_patient", data=df)
plt.title("Target Distribution (0=Healthy, 1=Diseased)")
plt.show()

df["is_patient"].value_counts()

# %%
X = df.drop("is_patient", axis=1)
y = df["is_patient"]

print("X shape:", X.shape)
print("y distribution:\n", y.value_counts())

# %%
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

X_scaled_df = pd.DataFrame(X_scaled, columns=X.columns)
X_scaled_df.describe().T

# %%
plt.figure(figsize=(12, 6))
for i, col in enumerate(X.columns[:6]):
    plt.subplot(2, 3, i + 1)
    sns.histplot(X_scaled_df[col], bins=20, kde=True)
    plt.title(col)
plt.tight_layout()
plt.show()

# %%
feature_selector = ExtraTreesClassifier(n_estimators=250, random_state=42)
feature_selector.fit(X_scaled, y)

importances = feature_selector.feature_importances_
feat_df = pd.DataFrame({"Feature": X.columns, "Importance": importances})
feat_df = feat_df.sort_values(by="Importance", ascending=False)

plt.figure(figsize=(10, 5))
sns.barplot(x="Importance", y="Feature", data=feat_df)
plt.title("Feature Importance (ExtraTrees)")
plt.show()

# %%
model_selector = SelectFromModel(
    feature_selector, prefit=True, max_features=8
)
X_selected = model_selector.transform(X_scaled)

selected_features = X.columns[model_selector.get_support()]
print("Selected features:", selected_features.tolist())

# %%
sns.countplot(x=y)
plt.title("Before SMOTEENN")
plt.show()

smote_enn = SMOTEENN(random_state=42)
X_balanced, y_balanced = smote_enn.fit_resample(X_selected, y)

sns.countplot(x=y_balanced)
plt.title("After SMOTEENN")
plt.show()

pd.Series(y_balanced).value_counts()

# %%
base_learners = [
    ("xgb", XGBClassifier(
        n_estimators=600,
        learning_rate=0.015,
        max_depth=8,
        subsample=0.95,
        colsample_bytree=0.85,
        gamma=0.1,
        reg_lambda=2,
        use_label_encoder=False,
        eval_metric="logloss",
    )),
    ("et", ExtraTreesClassifier(n_estimators=400, max_depth=14, random_state=42)),
    ("lgbm", LGBMClassifier(n_estimators=600, learning_rate=0.01, max_depth=11)),
    ("cat", CatBoostClassifier(
        verbose=0,
        iterations=500,
        depth=9,
        learning_rate=0.01,
        l2_leaf_reg=5,
    )),
]

# %%
y_balanced = np.where(y_balanced == 2, 0, y_balanced).astype(int)

X_train_b, X_test_b, y_train_b, y_test_b = train_test_split(
    X_balanced,
    y_balanced,
    test_size=0.2,
    stratify=y_balanced,
    random_state=42,
)

metrics = {
    "Model": [],
    "Accuracy": [],
    "Precision": [],
    "Recall": [],
    "F1": [],
    "AUC": [],
}

for name, model in base_learners:
    model.fit(X_train_b, y_train_b)
    y_pred = model.predict(X_test_b)
    y_proba = model.predict_proba(X_test_b)[:, 1]

    metrics["Model"].append(name.upper())
    metrics["Accuracy"].append(accuracy_score(y_test_b, y_pred))
    metrics["Precision"].append(precision_score(y_test_b, y_pred))
    metrics["Recall"].append(recall_score(y_test_b, y_pred))
    metrics["F1"].append(f1_score(y_test_b, y_pred))
    metrics["AUC"].append(roc_auc_score(y_test_b, y_proba))

results_df = pd.DataFrame(metrics)
results_df

# %%
meta_learner = LogisticRegression(max_iter=1500, C=0.5, solver="liblinear")

stack_model = StackingClassifier(
    estimators=base_learners,
    final_estimator=meta_learner,
    passthrough=True,
    cv=3, # 5
    n_jobs=-1,
)

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42) # 15
cv_scores = cross_val_score(stack_model, X_balanced, y_balanced, cv=cv)

print("CV scores:", cv_scores)
print("Mean CV:", cv_scores.mean(), "±", cv_scores.std())

# %%
X_train, X_test, y_train, y_test = train_test_split(
    X_balanced,
    y_balanced,
    test_size=0.2,
    stratify=y_balanced,
    random_state=42,
)

stack_model.fit(X_train, y_train)
y_pred = stack_model.predict(X_test)
y_proba = stack_model.predict_proba(X_test)[:, 1]

print("Accuracy:", accuracy_score(y_test, y_pred))
print("AUC:", roc_auc_score(y_test, y_proba))
print(classification_report(y_test, y_pred))

# %%
cm = confusion_matrix(y_test, y_pred)

plt.figure(figsize=(6, 4))
sns.heatmap(
    cm,
    annot=True,
    fmt="d",
    cmap="Blues",
    xticklabels=["Healthy", "Patient"],
    yticklabels=["Healthy", "Patient"],
)
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.show()

# %%
joblib.dump(
    {
        "model": stack_model,
        "scaler": scaler,
        "selector": feature_selector,
        "selected_features": X.columns.tolist(),
    },
    "ensemble_model.pkl",
)

print("Model bundle saved as ensemble_model.pkl")

# %%
%cp ensemble_model.pkl /content/drive/MyDrive/

# %%
xgb_model = stack_model.named_estimators_["xgb"]

explainer = shap.Explainer(
    xgb_model.predict_proba,
    X_train,
    feature_names=np.array(X.columns)[model_selector.get_support()],
)

shap_values = explainer(X_test)

shap.summary_plot(
    shap_values[..., 1],
    X_test,
    feature_names=np.array(X.columns)[model_selector.get_support()],
    plot_type="bar",
)


