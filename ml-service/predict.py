import joblib
import pandas as pd

# Load saved model artifacts
artifacts = joblib.load("therapeutic_model.pkl")

model = artifacts["model"]
scaler = artifacts["scaler"]
feature_columns = artifacts["feature_columns"]

print("Model loaded successfully")

def predict_recommendation(input_data):

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

    prediction = model.predict(df)

    return prediction


sample_input = {
    "User ID": 1,
    "Age": 45,
    "BMI": 28,
    "Stress Level (1-10)": "Moderate (5)",
    "Gender": "Male",
    "Smoking Status": "No",
    "Alcohol Consumption": "Occasional",
    "Exercise Frequency": "Rare",
    "Chronic Condition": "Diabetes",
    "Anxiety Symptoms": "Yes",
    "Sleep Disturbance": "Yes"
}

result = predict_recommendation(sample_input)

print("Prediction Output:", result)
