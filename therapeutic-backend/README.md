# AI-ML Based Therapeutic Activity Recommendation System

A Spring Boot REST API backend that provides personalised exercise and meditation recommendations based on patient health data using rule-based simulation logic.

---

## Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Language    | Java 17                 |
| Framework   | Spring Boot 3.2.0       |
| Web         | Spring Web (REST)       |
| Validation  | Spring Validation (JSR) |
| Boilerplate | Lombok                  |
| Build Tool  | Maven                   |

---

## Project Structure

```
therapeutic-backend/
├── src/main/java/com/project/therapeutic/
│   ├── config/
│   │   └── CorsConfig.java               # CORS configuration
│   ├── controller/
│   │   └── RecommendationController.java # REST endpoints
│   ├── dto/
│   │   ├── RecommendationRequest.java    # Input DTO with validation
│   │   └── RecommendationResponse.java   # Output DTO
│   ├── exception/
│   │   └── GlobalExceptionHandler.java   # Centralised error handling
│   ├── service/
│   │   └── RecommendationService.java    # Rule-based recommendation logic
│   └── TherapeuticApplication.java       # Application entry point
├── src/main/resources/
│   └── application.properties
├── pom.xml
└── README.md
```

---

## Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+

### Run the Application

```bash
# Clone / navigate to the project root
cd therapeutic-backend

# Run with Maven
mvn spring-boot:run
```

The server starts on **http://localhost:8080**

---

## API Reference

### Health Check

```
GET /api/health
```

**Response:**
```json
{
  "status": "UP",
  "service": "AI-ML Therapeutic Activity Recommendation System"
}
```

---

### Get Recommendation

```
POST /api/recommendation
Content-Type: application/json
```

**Request Body:**
```json
{
  "age": 45,
  "gender": "Male",
  "bmi": 29,
  "stressLevel": 3,
  "smokingStatus": "No",
  "alcoholConsumption": "Occasional",
  "exerciseFrequency": "Rare",
  "chronicCondition": "Diabetes",
  "anxietySymptoms": "Yes",
  "sleepDisturbance": "Yes"
}
```

**Field Reference:**

| Field               | Type    | Valid Values                         |
|---------------------|---------|--------------------------------------|
| age                 | Integer | 1–120                                |
| gender              | String  | Male, Female, Other                  |
| bmi                 | Double  | 10.0–60.0                            |
| stressLevel         | Integer | 1–5                                  |
| smokingStatus       | String  | Yes, No                              |
| alcoholConsumption  | String  | None, Occasional, Regular            |
| exerciseFrequency   | String  | Never, Rare, Moderate, Regular       |
| chronicCondition    | String  | Free text (e.g. Diabetes, None)      |
| anxietySymptoms     | String  | Yes, No                              |
| sleepDisturbance    | String  | Yes, No                              |

**Success Response (200 OK):**
```json
{
  "exerciseRecommendation": "Aerobic Walking",
  "meditationRecommendation": "Mindfulness Meditation",
  "intensityLevel": "Low to Moderate",
  "sessionDuration": "30–45 minutes per session",
  "additionalNotes": "Please consult your physician before starting any new exercise programme given your chronic condition."
}
```

**Validation Error Response (400 Bad Request):**
```json
{
  "status": 400,
  "error": "Validation Failed",
  "errors": {
    "bmi": "BMI must be at most 60.0",
    "stressLevel": "Stress level must be between 1 and 5"
  }
}
```

---

## Recommendation Rules

### Exercise Rules

| Condition                                      | Recommendation                    |
|------------------------------------------------|-----------------------------------|
| Chronic condition: Diabetes + BMI > 28         | Aerobic Walking                   |
| Chronic condition: Diabetes + BMI ≤ 28         | Light Cycling                     |
| Chronic condition: Hypertension / Heart        | Low-Impact Stretching             |
| Chronic condition: Arthritis / Joint           | Aquatic Therapy / Water Aerobics  |
| BMI < 18.5                                     | Strength Training (age-adjusted)  |
| BMI 18.5–24.9 (sedentary)                      | Brisk Walking                     |
| BMI 18.5–24.9 (active)                         | Jogging / Light Running           |
| BMI 25–28                                      | Cycling / Elliptical Training     |
| BMI 28–35                                      | Aerobic Walking                   |
| BMI > 35                                       | Chair-Based Low-Impact Aerobics   |

### Meditation Rules

| Condition                                      | Recommendation                    |
|------------------------------------------------|-----------------------------------|
| Stress ≥ 4 OR Anxiety = Yes                    | Mindfulness Meditation            |
| Stress ≥ 3 AND Sleep Disturbance = Yes         | Guided Sleep Meditation           |
| Stress ≥ 3                                     | Mindfulness Meditation            |
| Sleep Disturbance = Yes (low stress)           | Progressive Muscle Relaxation     |
| Chronic pain conditions                        | Body Scan Meditation              |
| Stress ≤ 2                                     | Breathing Meditation              |
| Otherwise                                      | Yoga Stretching                   |

---

## Testing with cURL

```bash
curl -X POST http://localhost:8080/api/recommendation \
  -H "Content-Type: application/json" \
  -d '{
    "age": 45,
    "gender": "Male",
    "bmi": 29,
    "stressLevel": 3,
    "smokingStatus": "No",
    "alcoholConsumption": "Occasional",
    "exerciseFrequency": "Rare",
    "chronicCondition": "Diabetes",
    "anxietySymptoms": "Yes",
    "sleepDisturbance": "Yes"
  }'
```

---

## CORS

CORS is enabled for all origins on `/api/**` endpoints. To restrict to a specific frontend domain, update `CorsConfig.java`:

```java
.allowedOriginPatterns("http://localhost:3000", "https://your-frontend.com")
```

---

## Future ML Integration

The `RecommendationService` is designed for easy replacement with an actual ML model:
- Replace `determineExercise()` and `determineMeditation()` with calls to a Python ML microservice
- Or integrate ONNX / Weka model loading directly in the service layer
- The DTO layer and controller remain unchanged
