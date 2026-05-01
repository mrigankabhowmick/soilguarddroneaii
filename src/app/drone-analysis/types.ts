export interface Zone {
  zone_id: string;
  health_status: string;
  color_code: string;
  dominant_issue: string;
  estimated_coordinates: string;
  health_score: number;
  vegetation_index: string;
  weed_percent: number;
  dryness_percent: number;
  notes: string;
  thumbnail_request: boolean;
}

export interface HeatmapCell {
  cell_id: string;
  row: number;
  col: number;
  health_score: number;
  color: string;
  weed_density: string;
  disease_probability: string;
}

export interface Mapping {
  estimated_boundary_polygon: string[]; // specific type if coordinates are numbers
  drone_heading: string;
  relative_altitude: string;
  zones: Zone[];
  heatmap_grid: HeatmapCell[];
}

export interface AreaAnalysis {
  healthy_percent: number;
  stressed_percent: number;
  diseased_percent: number;
  dry_percent: number;
  weed_percent: number;
  bare_soil_percent: number;
  waterlogged_percent: number;
  overcrowded_percent: number;
}

export interface ObjectCounts {
  plants: string;
  weeds: string;
  bare_soil_patches: string;
  waterlogged_areas: string;
  other_objects: string[];
}

export interface Recommendations {
  irrigation: string;
  fertilizer: string;
  weed_control: string;
  pest_control: string;
  disease_management: string;
  yield_prediction: string;
  scan_suggestion: string;
}

export interface ReportMetadata {
  image_quality: string;
  notes: string;
  requires_more_images: boolean;
}

export interface AgriAnalysis {
  field_health_score: number;
  vegetation_index: string;
  crop_condition: string;
  water_stress: string;
  soil_dryness: string;
  sunlight_exposure: string;
  growth_uniformity: number;
  plant_height_estimate: string;
  growth_stage: string;

  weed_detected: boolean;
  weed_coverage_percent: number;
  disease_detected: boolean;
  disease_type: string;
  pest_detected: boolean;
  pest_type: string;
  anomalies: string[];

  area_analysis: AreaAnalysis;
  object_counts: ObjectCounts;
  
  confidence: {
    crop_condition: number;
    weed_detection: number;
    disease_detection: number;
    water_stress: number;
    vegetation_index: number;
    zonal_mapping: number;
  };

  mapping: Mapping;
  recommendations: Recommendations;
  report_metadata: ReportMetadata;
}