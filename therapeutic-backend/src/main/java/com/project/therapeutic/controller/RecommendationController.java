package com.project.therapeutic.controller;

import com.project.therapeutic.dto.RecommendationRequest;
import com.project.therapeutic.dto.RecommendationResponse;
import com.project.therapeutic.service.RecommendationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    /**
     * POST /api/recommendation
     * Accepts patient health data and returns personalised therapeutic recommendations.
     */
    @PostMapping("/recommendation")
    public ResponseEntity<?> getRecommendation(
            @Valid @RequestBody RecommendationRequest request,
            BindingResult bindingResult) {

        // Return 400 with field-level validation errors
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors()
                    .stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            fe -> fe.getDefaultMessage() != null ? fe.getDefaultMessage() : "Invalid value",
                            (existing, replacement) -> existing
                    ));
            log.warn("Validation failed: {}", errors);
            return ResponseEntity.badRequest().body(Map.of("errors", errors));
        }

        log.info("Received recommendation request for age={}, bmi={}, stressLevel={}",
                request.getAge(), request.getBmi(), request.getStressLevel());

        RecommendationResponse response = recommendationService.generateRecommendation(request);

        log.info("Returning recommendation: exercise='{}', meditation='{}'",
                response.getExerciseRecommendation(), response.getMeditationRecommendation());

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/health
     * Simple health-check endpoint.
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "AI-ML Therapeutic Activity Recommendation System");
        return ResponseEntity.ok(status);
    }
}
