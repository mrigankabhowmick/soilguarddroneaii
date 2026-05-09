/*
  # SoilGuard AI - Initial Schema

  1. New Tables
    - `profiles` - User profile data linked to auth.users
    - `drones` - Registered drone devices
    - `drone_telemetry` - Real-time telemetry snapshots
    - `flight_logs` - Historical flight records
    - `media_files` - Drone captured images/videos
    - `field_zones` - Farm area / geofence definitions
    - `sensor_readings` - Soil, weather, and environmental sensor data
    - `ai_alerts` - AI-generated detection alerts
    - `missions` - Planned autonomous missions

  2. Security
    - RLS enabled on all tables
    - Authenticated users can only access their own data
*/

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  role text DEFAULT 'farmer',
  avatar_url text DEFAULT '',
  farm_name text DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Drones
CREATE TABLE IF NOT EXISTS drones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL DEFAULT 'Drone 1',
  model text DEFAULT 'SoilGuard X1',
  serial_number text DEFAULT '',
  status text DEFAULT 'offline',
  battery_level integer DEFAULT 100,
  signal_strength integer DEFAULT 0,
  firmware_version text DEFAULT '1.0.0',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE drones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own drones" ON drones FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own drones" ON drones FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own drones" ON drones FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own drones" ON drones FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Drone Telemetry
CREATE TABLE IF NOT EXISTS drone_telemetry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drone_id uuid REFERENCES drones(id) ON DELETE CASCADE NOT NULL,
  latitude double precision DEFAULT 0,
  longitude double precision DEFAULT 0,
  altitude double precision DEFAULT 0,
  speed double precision DEFAULT 0,
  heading double precision DEFAULT 0,
  battery_level integer DEFAULT 100,
  signal_strength integer DEFAULT 0,
  recorded_at timestamptz DEFAULT now()
);
ALTER TABLE drone_telemetry ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own telemetry" ON drone_telemetry FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM drones WHERE drones.id = drone_telemetry.drone_id AND drones.user_id = auth.uid()));
CREATE POLICY "Users can insert own telemetry" ON drone_telemetry FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM drones WHERE drones.id = drone_telemetry.drone_id AND drones.user_id = auth.uid()));

-- Flight Logs
CREATE TABLE IF NOT EXISTS flight_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drone_id uuid REFERENCES drones(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  distance_km double precision DEFAULT 0,
  max_altitude double precision DEFAULT 0,
  avg_speed double precision DEFAULT 0,
  area_covered_ha double precision DEFAULT 0,
  notes text DEFAULT ''
);
ALTER TABLE flight_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own flight logs" ON flight_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own flight logs" ON flight_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own flight logs" ON flight_logs FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Media Files
CREATE TABLE IF NOT EXISTS media_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  drone_id uuid REFERENCES drones(id) ON DELETE SET NULL,
  file_name text NOT NULL DEFAULT '',
  file_url text NOT NULL DEFAULT '',
  thumbnail_url text DEFAULT '',
  file_type text DEFAULT 'image',
  file_size_mb double precision DEFAULT 0,
  crop_type text DEFAULT '',
  farm_area text DEFAULT '',
  latitude double precision,
  longitude double precision,
  ai_tags text[] DEFAULT '{}',
  captured_at timestamptz DEFAULT now()
);
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own media" ON media_files FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own media" ON media_files FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own media" ON media_files FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own media" ON media_files FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Field Zones
CREATE TABLE IF NOT EXISTS field_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL DEFAULT 'Zone A',
  crop_type text DEFAULT '',
  area_ha double precision DEFAULT 0,
  color text DEFAULT '#22c55e',
  coordinates jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE field_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own zones" ON field_zones FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own zones" ON field_zones FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own zones" ON field_zones FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own zones" ON field_zones FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Sensor Readings
CREATE TABLE IF NOT EXISTS sensor_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  zone_id uuid REFERENCES field_zones(id) ON DELETE SET NULL,
  soil_moisture double precision DEFAULT 0,
  soil_temperature double precision DEFAULT 0,
  air_temperature double precision DEFAULT 0,
  humidity double precision DEFAULT 0,
  ndvi double precision DEFAULT 0,
  water_level double precision DEFAULT 0,
  air_quality_index integer DEFAULT 0,
  recorded_at timestamptz DEFAULT now()
);
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sensor readings" ON sensor_readings FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sensor readings" ON sensor_readings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- AI Alerts
CREATE TABLE IF NOT EXISTS ai_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  drone_id uuid REFERENCES drones(id) ON DELETE SET NULL,
  alert_type text NOT NULL DEFAULT 'info',
  severity text DEFAULT 'low',
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  latitude double precision,
  longitude double precision,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE ai_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own alerts" ON ai_alerts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own alerts" ON ai_alerts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON ai_alerts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Missions
CREATE TABLE IF NOT EXISTS missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  drone_id uuid REFERENCES drones(id) ON DELETE SET NULL,
  name text NOT NULL DEFAULT 'Mission 1',
  status text DEFAULT 'planned',
  waypoints jsonb DEFAULT '[]',
  altitude double precision DEFAULT 50,
  speed double precision DEFAULT 5,
  scheduled_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own missions" ON missions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own missions" ON missions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own missions" ON missions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own missions" ON missions FOR DELETE TO authenticated USING (auth.uid() = user_id);
