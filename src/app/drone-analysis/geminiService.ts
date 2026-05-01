import { GoogleGenerativeAI } from "@google/generative-ai";
import { AgriAnalysis } from "./types";

const promptText = `
You are an advanced vision system for a precision agriculture drone platform. 
Analyze the provided field image or video frame and return ONLY structured JSON output — 
no explanations outside the JSON. Your goal is to provide deep agronomic insights and 
geospatial mapping data.

Perform ALL of the following analyses:

-------------------------------------------------------
1. FIELD HEALTH & VEGETATION ANALYSIS
-------------------------------------------------------
- Field Health Score (0–100)
- Vegetation Index (pseudo-NDVI / chlorophyll estimate)
- Crop Condition: Healthy / Stressed / Diseased
- Water Stress: Normal / Mild / Severe
- Soil Dryness: Low / Medium / High
- Sunlight Exposure Score
- Growth Uniformity Percentage
- Plant Height Approximation (if shadows or perspective allow)
- Growth Stage Prediction (seedling, vegetative, flowering, fruiting, harvest-ready)

-------------------------------------------------------
2. DISEASE, WEED & PEST ANALYSIS
-------------------------------------------------------
- Weed detection (true/false)
- Weed coverage percentage (0–100)
- Disease type (if identifiable) + severity
- Pest presence (true/false) + type if recognizable
- Anomalies (nutrient deficiency, fungus signs, lodging, hail/flood damage)

-------------------------------------------------------
3. AREA COVERAGE & ZONAL HEALTH BREAKDOWN
-------------------------------------------------------
Estimate percentage of field area appearing:
- Healthy
- Stressed
- Diseased
- Dry / Water-stressed
- Weed-covered
- Waterlogged
- Bare soil
- Overcrowded

-------------------------------------------------------
4. OBJECT & STRUCTURAL DETECTION
-------------------------------------------------------
Count:
- Healthy plants
- Weeds
- Bare soil patches
- Waterlogged patches
- Equipment, humans, animals (if visible)

-------------------------------------------------------
5. CONFIDENCE LEVELS (0–100%)
-------------------------------------------------------
Provide confidence percentages for:
- Crop condition classification
- Weed detection
- Disease detection
- Water stress evaluation
- Vegetation index estimation
- Zonal segmentation

-------------------------------------------------------
6. GEO-SPATIAL MAP OUTPUT (CRITICAL SECTION)
-------------------------------------------------------
Generate mapping-ready data based on what is visible:

6A. FIELD BOUNDARY ESTIMATION  
- Approx polygon of visible field edges  
- Label: “estimated_boundary”

6B. DRONE POSITION / DIRECTION ESTIMATE  
(If visible or inferable via perspective)
- Heading direction
- Relative altitude category: low / medium / high

6C. ZONE MAPPING OUTPUT  
Divide the visible field into meaningful zones (A, B, C...):

For each zone:
{
  "zone_id": "A",
  "health_status": "Healthy / Stressed / Diseased",
  "color_code": "green / yellow / red / blue",
  "dominant_issue": "weed / dryness / disease / none",
  "estimated_coordinates": "approx polygon relative to image frame",
  "health_score": 0-100,
  "vegetation_index": "string",
  "weed_percent": 0-100,
  "dryness_percent": 0-100,
  "notes": "string",
  "thumbnail_request": true
}

6D. HEATMAP/CHOROPLETH DATA  
Return a grid-based map representation (approx 5x5 or suitable grid size):

"heatmap_grid": [
  {
    "cell_id": "0-0",
    "row": 0,
    "col": 0,
    "health_score": 0-100,
    "color": "hex or named color",
    "weed_density": "low/med/high",
    "disease_probability": "low/med/high"
  }
]

6E. PATH / TRAJECTORY ASSIST (if video frame context allows)
- Suggest next optimal flight direction 
- Detect coverage gaps for mapping

-------------------------------------------------------
7. WEATHER-AWARE & ENVIRONMENTAL CONTEXT
-------------------------------------------------------
Infer from image if possible:
- Cloudiness / sunlight intensity
- Wind signs (crop leaning)
- Suggested scan timing (morning/evening)
- Whether spraying is safe (wind or moisture issues)

-------------------------------------------------------
8. AI RECOMMENDATIONS & ACTION PLAN
-------------------------------------------------------
Provide a short actionable plan:
- Irrigation advice
- Fertilizer / nutrient suggestion
- Weed control steps
- Pest or disease treatment
- Zone-specific actions
- Yield impact prediction
- Next optimal scan time

-------------------------------------------------------
9. REPORT METADATA
-------------------------------------------------------
- Image quality score
- Notes on uncertainty or obstructions
- Whether more images are required

-------------------------------------------------------
FINAL OUTPUT FORMAT (STRICT JSON):
-------------------------------------------------------
{
  "field_health_score": number,
  "vegetation_index": "string",
  "crop_condition": "string",
  "water_stress": "string",
  "soil_dryness": "string",
  "sunlight_exposure": "string",
  "growth_uniformity": number,
  "plant_height_estimate": "string",
  "growth_stage": "string",

  "weed_detected": boolean,
  "weed_coverage_percent": number,
  "disease_detected": boolean,
  "disease_type": "string",
  "pest_detected": boolean,
  "pest_type": "string",
  "anomalies": ["string"],

  "area_analysis": {
    "healthy_percent": number,
    "stressed_percent": number,
    "diseased_percent": number,
    "dry_percent": number,
    "weed_percent": number,
    "bare_soil_percent": number,
    "waterlogged_percent": number,
    "overcrowded_percent": number
  },

  "object_counts": {
    "plants": "string",
    "weeds": "string",
    "bare_soil_patches": "string",
    "waterlogged_areas": "string",
    "other_objects": ["string"]
  },

  "confidence": {
    "crop_condition": number,
    "weed_detection": number,
    "disease_detection": number,
    "water_stress": number,
    "vegetation_index": number,
    "zonal_mapping": number
  },

  "mapping": {
    "estimated_boundary_polygon": ["string"],
    "drone_heading": "string",
    "relative_altitude": "string",
    "zones": [
      {
        "zone_id": "string",
        "health_status": "string",
        "color_code": "string",
        "dominant_issue": "string",
        "estimated_coordinates": "string",
        "health_score": number,
        "vegetation_index": "string",
        "weed_percent": number,
        "dryness_percent": number,
        "notes": "string",
        "thumbnail_request": boolean
      }
    ],
    "heatmap_grid": [
      {
        "cell_id": "string",
        "row": number,
        "col": number,
        "health_score": number,
        "color": "string",
        "weed_density": "string",
        "disease_probability": "string"
      }
    ]
  },

  "recommendations": {
    "irrigation": "string",
    "fertilizer": "string",
    "weed_control": "string",
    "pest_control": "string",
    "disease_management": "string",
    "yield_prediction": "string",
    "scan_suggestion": "string"
  },

  "report_metadata": {
    "image_quality": "string",
    "notes": "string",
    "requires_more_images": boolean
  }
}
`;

export const analyzeFieldImage = async (file: File): Promise<AgriAnalysis> => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in your .env.local file");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const base64Data = await fileToBase64(file);

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent([
    promptText,
    {
      inlineData: {
        data: base64Data,
        mimeType: file.type
      }
    }
  ]);

  const text = await result.response.text();
  if (!text) {
    throw new Error("No response from AI");
  }

  try {
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText) as AgriAnalysis;
  } catch (e) {
    console.error("Failed to parse JSON", text);
    throw new Error("Invalid JSON response from AI");
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};