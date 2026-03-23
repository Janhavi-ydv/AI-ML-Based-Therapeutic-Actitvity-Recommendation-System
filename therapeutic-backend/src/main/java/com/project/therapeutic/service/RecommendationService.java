package com.project.therapeutic.service;

import com.project.therapeutic.dto.RecommendationRequest;
import com.project.therapeutic.dto.RecommendationResponse;
import org.springframework.stereotype.Service;

@Service
public class RecommendationService {

    // BMI thresholds
    private static final double BMI_UNDERWEIGHT   = 18.5;
    private static final double BMI_NORMAL_MAX    = 24.9;
    private static final double BMI_OVERWEIGHT    = 28.0;
    private static final double BMI_OBESE         = 35.0;

    // Stress thresholds
    private static final int STRESS_HIGH          = 3;
    private static final int STRESS_VERY_HIGH     = 4;

    public RecommendationResponse generateRecommendation(RecommendationRequest req) {
        String exercise   = determineExercise(req);
        String meditation = determineMeditation(req);
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

    // -------------------------------------------------------------------------
    // Exercise logic
    // -------------------------------------------------------------------------
    private String determineExercise(RecommendationRequest req) {
        double bmi              = req.getBmi();
        int    age              = req.getAge();
        String chronicCondition = req.getChronicCondition().toLowerCase();
        String exerciseFreq     = req.getExerciseFrequency().toLowerCase();
        boolean isElderly       = age >= 60;

        // Chronic condition overrides take highest priority
        if (chronicCondition.contains("diabetes")) {
            return bmi > BMI_OVERWEIGHT ? "Aerobic Walking" : "Light Cycling";
        }

        if (chronicCondition.contains("hypertension") || chronicCondition.contains("heart")) {
            return "Low-Impact Stretching";
        }

        if (chronicCondition.contains("arthritis") || chronicCondition.contains("joint")) {
            return "Aquatic Therapy / Water Aerobics";
        }

        // BMI-based rules
        if (bmi < BMI_UNDERWEIGHT) {
            return isElderly ? "Gentle Strength Training" : "Moderate Strength Training";
        }

        if (bmi <= BMI_NORMAL_MAX) {
            if ("never".equals(exerciseFreq) || "rare".equals(exerciseFreq)) {
                return "Brisk Walking";
            }
            return "Jogging / Light Running";
        }

        if (bmi <= BMI_OVERWEIGHT) {
            return isElderly ? "Aerobic Walking" : "Cycling / Elliptical Training";
        }

        if (bmi <= BMI_OBESE) {
            return "Aerobic Walking";
        }

        // BMI > 35 (severely obese)
        return "Chair-Based Low-Impact Aerobics";
    }

    // -------------------------------------------------------------------------
    // Meditation logic
    // -------------------------------------------------------------------------
    private String determineMeditation(RecommendationRequest req) {
        int     stress         = req.getStressLevel();
        boolean hasAnxiety     = "yes".equalsIgnoreCase(req.getAnxietySymptoms());
        boolean hasSleep       = "yes".equalsIgnoreCase(req.getSleepDisturbance());
        String  chronicCond    = req.getChronicCondition().toLowerCase();

        // Very high stress OR anxiety → Mindfulness
        if (stress >= STRESS_VERY_HIGH || hasAnxiety) {
            return "Mindfulness Meditation";
        }

        // High stress with sleep disturbance → Guided Sleep Meditation
        if (stress >= STRESS_HIGH && hasSleep) {
            return "Guided Sleep Meditation";
        }

        // High stress alone → Mindfulness
        if (stress >= STRESS_HIGH) {
            return "Mindfulness Meditation";
        }

        // Sleep disturbance without high stress
        if (hasSleep) {
            return "Progressive Muscle Relaxation";
        }

        // Chronic pain conditions
        if (chronicCond.contains("fibromyalgia") || chronicCond.contains("chronic pain")) {
            return "Body Scan Meditation";
        }

        // Low stress, no special flags → gentle options
        return stress <= 2 ? "Breathing Meditation" : "Yoga Stretching";
    }

    // -------------------------------------------------------------------------
    // Intensity level
    // -------------------------------------------------------------------------
    private String determineIntensity(RecommendationRequest req) {
        double bmi   = req.getBmi();
        int    age   = req.getAge();
        int    stress = req.getStressLevel();
        String freq  = req.getExerciseFrequency().toLowerCase();
        String chronic = req.getChronicCondition().toLowerCase();

        boolean highRisk = chronic.contains("heart") || chronic.contains("hypertension")
                        || bmi > BMI_OBESE || age >= 65;

        if (highRisk) return "Low";

        if ("never".equals(freq) || "rare".equals(freq) || stress >= STRESS_VERY_HIGH) {
            return "Low to Moderate";
        }

        if (bmi > BMI_OVERWEIGHT || age >= 50) return "Moderate";

        return "Moderate to High";
    }

    // -------------------------------------------------------------------------
    // Recommended session duration
    // -------------------------------------------------------------------------
    private String determineDuration(RecommendationRequest req) {
        int    age    = req.getAge();
        double bmi    = req.getBmi();
        String freq   = req.getExerciseFrequency().toLowerCase();

        if (age >= 65 || bmi > BMI_OBESE) return "20–30 minutes per session";

        if ("never".equals(freq) || "rare".equals(freq)) return "15–20 minutes per session";

        if (bmi > BMI_OVERWEIGHT) return "30–45 minutes per session";

        return "30–60 minutes per session";
    }

    // -------------------------------------------------------------------------
    // Additional notes
    // -------------------------------------------------------------------------
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
}
