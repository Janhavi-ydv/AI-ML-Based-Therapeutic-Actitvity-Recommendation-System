package com.project.therapeutic.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RecommendationRequest {

    @NotNull(message = "Age is required")
    @Min(value = 1, message = "Age must be at least 1")
    @Max(value = 120, message = "Age must be at most 120")
    private Integer age;

    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "^(Male|Female|Other)$", message = "Gender must be Male, Female, or Other")
    private String gender;

    @NotNull(message = "BMI is required")
    @DecimalMin(value = "10.0", message = "BMI must be at least 10.0")
    @DecimalMax(value = "60.0", message = "BMI must be at most 60.0")
    private Double bmi;

    @NotNull(message = "Stress level is required")
    @Min(value = 1, message = "Stress level must be between 1 and 5")
    @Max(value = 5, message = "Stress level must be between 1 and 5")
    private Integer stressLevel;

    @NotBlank(message = "Smoking status is required")
    @Pattern(regexp = "^(Yes|No)$", message = "Smoking status must be Yes or No")
    private String smokingStatus;

    @NotBlank(message = "Alcohol consumption is required")
    @Pattern(regexp = "^(None|Occasional|Regular)$", message = "Alcohol consumption must be None, Occasional, or Regular")
    private String alcoholConsumption;

    @NotBlank(message = "Exercise frequency is required")
    @Pattern(regexp = "^(Never|Rare|Moderate|Regular)$", message = "Exercise frequency must be Never, Rare, Moderate, or Regular")
    private String exerciseFrequency;

    @NotBlank(message = "Chronic condition is required")
    private String chronicCondition;

    @NotBlank(message = "Anxiety symptoms field is required")
    @Pattern(regexp = "^(Yes|No)$", message = "Anxiety symptoms must be Yes or No")
    private String anxietySymptoms;

    @NotBlank(message = "Sleep disturbance field is required")
    @Pattern(regexp = "^(Yes|No)$", message = "Sleep disturbance must be Yes or No")
    private String sleepDisturbance;
}
