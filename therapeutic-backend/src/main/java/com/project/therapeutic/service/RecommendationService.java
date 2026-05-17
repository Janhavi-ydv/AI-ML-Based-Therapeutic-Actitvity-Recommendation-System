package com.project.therapeutic.service;

import com.project.therapeutic.dto.RecommendationRequest;
import com.project.therapeutic.dto.RecommendationResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.HashMap;
import java.util.Map;

@Service
public class RecommendationService {

    private static final String ML_API_URL = "http://127.0.0.1:8000/predict";

    public RecommendationResponse generateRecommendation(RecommendationRequest req) {

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> input = new HashMap<>();
        input.put("User ID", 1);
        input.put("Age", req.getAge());
        input.put("BMI", req.getBmi());
        input.put("Stress Level (1-10)", mapStressLevel(req.getStressLevel()));
        input.put("Sleep Quality", mapSleepQuality(req.getSleepDisturbance()));
        input.put("Diet Quality", "Average"); // default (since not in DTO)
        input.put("Physical Activity Level", mapActivity(req.getExerciseFrequency()));
        input.put("Mental Health Condition", mapMentalHealth(req));
               HttpEntity<Map<String, Object>> request = new HttpEntity<>(input, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                ML_API_URL,
                request,
                Map.class
        );

        Map<String, Object> result = response.getBody();

        String exercise = (String) result.get("exercise");
        String meditation = (String) result.get("meditation");
        String intensity  = determineIntensity(req);
        String duration   = determineDuration(req);
        String notes      = buildAdditionalNotes(req);

        return RecommendationResponse.builder()
                .exerciseRecommendation(exercise)
                .meditationRecommendation(meditation)
                .intensityLevel(intensity)
                .sessionDuration(duration)
                .additionalNotes(notes)
                .build();
    }

    private String mapStressLevel(int stress) {
        if (stress <= 4) return "Low (1-4)";
        if (stress == 5) return "Moderate (5)";
        if (stress <= 8) return "Moderately High (6-8)";
        return "High (9-10)";
    }

    private String determineIntensity(RecommendationRequest req) {
        double bmi   = req.getBmi();
        int    age   = req.getAge();
        int    stress = req.getStressLevel();
        String freq  = req.getExerciseFrequency().toLowerCase();
        String chronic = req.getChronicCondition().toLowerCase();

        boolean highRisk = chronic.contains("heart") || chronic.contains("hypertension")
                || bmi > 35.0 || age >= 65;

        if (highRisk) return "Low";

        if ("never".equals(freq) || "rare".equals(freq) || stress >= 4) {
            return "Low to Moderate";
        }

        if (bmi > 28.0 || age >= 50) return "Moderate";

        return "Moderate to High";
    }

    private String mapActivity(String freq) {
        switch (freq.toLowerCase()) {
            case "never":
            case "rare":
                return "Low";
            case "moderate":
                return "Moderate";
            case "regular":
                return "High";
            default:
                return "Low";
        }
    }

    private String determineDuration(RecommendationRequest req) {
        int    age    = req.getAge();
        double bmi    = req.getBmi();
        String freq   = req.getExerciseFrequency().toLowerCase();

        if (age >= 65 || bmi > 35.0) return "20–30 minutes per session";

        if ("never".equals(freq) || "rare".equals(freq)) return "15–20 minutes per session";

        if (bmi > 28.0) return "30–45 minutes per session";

        return "30–60 minutes per session";
    }

    private String buildAdditionalNotes(RecommendationRequest req) {
        StringBuilder notes = new StringBuilder();

        if ("Yes".equalsIgnoreCase(req.getSmokingStatus())) {
            notes.append("Smoking may reduce cardiovascular endurance; consider cessation support. ");
        }

        if ("Regular".equalsIgnoreCase(req.getAlcoholConsumption())) {
            notes.append("Regular alcohol consumption can interfere with recovery and sleep quality. ");
        }

        if ("Yes".equalsIgnoreCase(req.getSleepDisturbance())) {
            notes.append("Prioritise consistent sleep schedule alongside meditation practice. ");
        }

        String chronic = req.getChronicCondition().toLowerCase();
        if (!chronic.isBlank() && !chronic.equals("none") && !chronic.equals("n/a")) {
            notes.append("Please consult your physician before starting any new exercise programme given your chronic condition. ");
        }

        if (notes.isEmpty()) {
            return "Maintain consistency and stay hydrated throughout your sessions.";
        }

        return notes.toString().trim();
    }
    private String mapSleepQuality(String sleepDisturbance) {
        return sleepDisturbance.equalsIgnoreCase("Yes") ? "Poor" : "Good";
    }

    private String mapMentalHealth(RecommendationRequest req) {
        if (req.getAnxietySymptoms().equalsIgnoreCase("Yes")) {
            return "Anxiety";
        }
        return "None";
    }
}