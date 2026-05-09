/*
  # Create drone-media storage bucket and policies

  1. Storage
    - Create `drone-media` bucket (public access for reading)
  2. Security
    - Authenticated users can upload/read/delete only their own folder
*/

INSERT INTO storage.buckets (id, name, public) 
VALUES ('drone-media', 'drone-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own media" 
  ON storage.objects FOR INSERT 
  TO authenticated 
  WITH CHECK (bucket_id = 'drone-media' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can read own media" 
  ON storage.objects FOR SELECT 
  TO authenticated 
  USING (bucket_id = 'drone-media' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete own media" 
  ON storage.objects FOR DELETE 
  TO authenticated 
  USING (bucket_id = 'drone-media' AND (storage.foldername(name))[1] = auth.uid()::text);
