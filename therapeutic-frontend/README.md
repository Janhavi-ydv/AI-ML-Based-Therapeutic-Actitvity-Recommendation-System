# Therapeutic Activity Recommendation System — Frontend

A clean, medical-grade React frontend that collects patient health data and calls an AI/ML backend to return personalised exercise and meditation recommendations.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 |
| HTTP | Axios |
| Fonts | Playfair Display · DM Sans · DM Mono (Google Fonts) |

---

## Project Structure

```
therapeutic-frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── index.css
    ├── main.jsx
    ├── App.jsx
    ├── components/
    │   └── RecommendationForm.jsx   # Main UI + form logic
    └── services/
        └── api.js                   # Axios wrapper → POST /api/recommendation
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173** (or the next available port).

### 3. Backend requirement

The frontend expects the backend API at:

```
POST http://localhost:8080/api/recommendation
```

#### Request body (JSON)

```json
{
  "age": 34,
  "gender": "Male",
  "bmi": 24.5,
  "stressLevel": 2,
  "smokingStatus": "Never",
  "alcoholConsumption": "Occasional",
  "exerciseFrequency": "3-4x per week",
  "chronicCondition": "None",
  "anxietySymptoms": "Mild",
  "sleepDisturbance": "None"
}
```

#### Expected response (JSON)

```json
{
  "recommendedExercise": "Brisk Walking",
  "recommendedMeditation": "Mindfulness Breathing"
}
```

> The frontend also accepts snake_case keys (`recommended_exercise`, `recommended_meditation`) and short keys (`exercise`, `meditation`).

---

## Form Fields

| Field | Type | Values |
|-------|------|--------|
| Age | Number | 1 – 120 |
| Gender | Select | Male / Female / Other |
| BMI | Number | 10.0 – 60.0 |
| Stress Level | Select | 1 (Low) – 4 (Severe) |
| Smoking Status | Select | Never / Former / Current |
| Alcohol Consumption | Select | None / Occasional / Moderate / Heavy |
| Exercise Frequency | Select | Sedentary / 1-2x per week / 3-4x per week / Daily |
| Chronic Condition | Select | None / Diabetes / Hypertension / … |
| Anxiety Symptoms | Select | None / Mild / Moderate / Severe |
| Sleep Disturbance | Select | None / Mild / Moderate / Severe |

---

## Build for Production

```bash
npm run build
```

Output is written to `dist/`. Serve with any static file host or:

```bash
npm run preview
```

---

## Notes

- No environment variables are required for local development.
- To change the backend URL, edit `src/services/api.js` → `API_BASE_URL`.
- The UI is fully responsive (mobile-first).
