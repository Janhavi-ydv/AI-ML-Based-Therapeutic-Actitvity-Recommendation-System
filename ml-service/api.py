from fastapi import FastAPI
import joblib
import pandas as pd

app = FastAPI()

# Load model artifacts
artifacts = joblib.load("therapeutic_model.pkl")

model = artifacts["model"]
scaler = artifacts["scaler"]
feature_columns = artifacts["feature_columns"]


def preprocess_input(input_data):

    df = pd.DataFrame([input_data])

    stress_mapping = {
        'Low (1-4)': 1,
        'Moderate (5)': 2,
        'Moderately High (6-8)': 3,
        'High (9-10)': 4
    }

    df['Stress Level (1-10)_Ordinal'] = df['Stress Level (1-10)'].map(stress_mapping)
    df = df.drop(columns=['Stress Level (1-10)'])

    categorical_cols = df.drop(columns=['User ID','Age','BMI','Stress Level (1-10)_Ordinal'], errors='ignore').columns
    df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)

    df = df.reindex(columns=feature_columns, fill_value=0)

    numerical_cols = ['Age','BMI','Stress Level (1-10)_Ordinal']
    df[numerical_cols] = scaler.transform(df[numerical_cols])

    return df


@app.get("/")
def home():
    return {"message": "Therapeutic Recommendation API running"}


@app.post("/predict")
def predict(data: dict):

    processed = preprocess_input(data)

    prediction = model.predict(processed)

    exercise_pred = int(prediction[0][0])
    meditation_pred = int(prediction[0][1])

    return {
        "exercise_prediction": exercise_pred,
        "meditation_prediction": meditation_pred
    }
