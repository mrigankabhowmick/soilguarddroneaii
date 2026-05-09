import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "list";

    // Create Supabase client using service role for storage access
    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "list") {
      // List files in user's storage bucket
      const { data, error } = await supabase.storage
        .from("drone-media")
        .list(`${user.id}`, { limit: 100, sortBy: { column: "created_at", order: "desc" } });

      if (error) {
        // Bucket might not exist yet
        return new Response(
          JSON.stringify({ files: [], bucket_status: "not_found", message: "Storage bucket 'drone-media' needs to be created in Supabase dashboard." }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const files = (data || []).map(f => ({
        name: f.name,
        size: f.metadata?.size || 0,
        created_at: f.created_at,
        type: f.name.match(/\.(jpg|jpeg|png|webp)$/i) ? "image"
          : f.name.match(/\.(mp4|mov|avi)$/i) ? "video"
          : "other",
      }));

      return new Response(
        JSON.stringify({ files, total: files.length, user_id: user.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "upload-url") {
      // Generate signed upload URL for client-side upload
      const fileName = url.searchParams.get("file") || "upload.jpg";
      const filePath = `${user.id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("drone-media")
        .createSignedUploadUrl(filePath);

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message, hint: "Ensure 'drone-media' storage bucket exists with appropriate policies." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          signed_url: data.signedUrl,
          path: filePath,
          instructions: "Upload the file using this signed URL with a PUT request.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "sd-card-scan") {
      // Return instructions for SD card scanning + simulated results
      return new Response(
        JSON.stringify({
          status: "scan_requested",
          instructions: {
            browser: "Use the File System Access API (showDirectoryPicker) to select your SD card drive.",
            steps: [
              "1. Insert drone SD card into your computer's card reader",
              "2. Click 'Scan SD Card' in the gallery page",
              "3. Browser will prompt to select the drive/folder",
              "4. Files are read client-side and uploaded to cloud storage",
              "5. AI tags are auto-generated for each file",
            ],
            supported_formats: ["JPG", "JPEG", "PNG", "WEBP", "MP4", "MOV", "DNG"],
            auto_organize: ["date", "farm_area", "crop_type", "gps_location"],
          },
          simulated_scan: {
            total_files: 247,
            total_size_gb: 12.4,
            images: 198,
            videos: 34,
            raw_files: 15,
            oldest: "2024-01-01",
            newest: "2024-01-15",
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action. Use: list, upload-url, sd-card-scan" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Media upload error:", error);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
