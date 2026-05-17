import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.HashMap;
import java.util.Map;

@Service
public class MlService {

    private final String ML_API_URL = "http://127.0.0.1:8000/predict";

    public Map<String, Object> getPrediction(Map<String, Object> inputData) {

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(inputData, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                ML_API_URL,
                request,
                Map.class
        );

        return response.getBody();
    }
}