import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ml")
@CrossOrigin
public class MlController {

    @Autowired
    private MlService mlService;

    @PostMapping("/predict")
    public Map<String, Object> predict(@RequestBody Map<String, Object> input) {
        return mlService.getPrediction(input);
    }
}