package com.project.therapeutic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResponse {

    private String exerciseRecommendation;
    private String meditationRecommendation;
    private String intensityLevel;
    private String sessionDuration;
    private String additionalNotes;
}
