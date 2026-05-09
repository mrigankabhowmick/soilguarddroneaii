import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface DroneCommand {
  action: "connect" | "disconnect" | "status" | "command";
  drone_id?: string;
  ip?: string;
  port?: number;
  protocol?: "mavlink" | "dji" | "wifi";
  command?: string;
  params?: Record<string, unknown>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body: DroneCommand = await req.json();

    switch (body.action) {
      case "connect": {
        const ip = body.ip || "192.168.1.1";
        const port = body.port || 14550;
        const protocol = body.protocol || "mavlink";

        // In production, this would open a WebSocket/UDP connection to the drone
        // For now, return connection instructions and simulate handshake
        return new Response(
          JSON.stringify({
            status: "handshake_initiated",
            drone_id: body.drone_id || crypto.randomUUID(),
            connection: {
              ip,
              port,
              protocol,
              instructions: [
                `1. Ensure your drone's companion computer (RPi/ESP32) is powered on`,
                `2. Connect to drone WiFi: ${ip} or same network`,
                `3. MAVLink stream should be on UDP port ${port}`,
                `4. For ArduPilot: set SR0_PROTOCOL=2, SR0_RATE=10`,
                `5. For DJI: enable Mobile SDK API in DJI Assistant`,
              ],
              hardware_required: [
                "Raspberry Pi Zero 2W or ESP32 on drone",
                "MAVLink v2 firmware (ArduPilot/PX4)",
                "WiFi module or 4G LTE hat",
                "USB OTG for RPi serial connection",
              ],
            },
            simulated_telemetry: {
              battery: 78,
              signal: 92,
              altitude: 0,
              speed: 0,
              heading: 0,
              lat: 28.6139,
              lng: 77.2090,
              status: "connected",
            },
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "disconnect": {
        return new Response(
          JSON.stringify({ status: "disconnected", drone_id: body.drone_id }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "status": {
        return new Response(
          JSON.stringify({
            drone_id: body.drone_id,
            status: "connected",
            uptime: "00:42:17",
            packets_received: 1247,
            packets_lost: 3,
            latency_ms: 45,
            mavlink_version: "2.0",
            firmware: "ArduPilot 4.5.1",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "command": {
        const cmd = body.command || "";
        const validCommands = [
          "takeoff", "land", "rtl", "arm", "disarm",
          "goto", "set_speed", "set_altitude", "start_mission",
          "pause_mission", "resume_mission", "emergency_land",
          "torch_on", "torch_off", "torch_brightness",
          "start_recording", "stop_recording", "capture_image",
        ];

        if (!validCommands.includes(cmd)) {
          return new Response(
            JSON.stringify({ error: `Unknown command: ${cmd}`, valid_commands: validCommands }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // In production, this would send MAVLink command to drone
        return new Response(
          JSON.stringify({
            status: "command_sent",
            command: cmd,
            params: body.params || {},
            mavlink_command_id: getMavlinkCommandId(cmd),
            note: "Command queued. In production, this sends a MAVLink COMMAND_LONG packet to the drone.",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action. Use: connect, disconnect, status, command" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("Drone connect error:", error);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getMavlinkCommandId(cmd: string): number {
  const map: Record<string, number> = {
    takeoff: 22,
    land: 21,
    rtl: 20,
    arm: 400,
    disarm: 400,
    goto: 192,
    set_speed: 178,
    set_altitude: 71,
    start_mission: 300,
    pause_mission: 300,
    emergency_land: 84,
  };
  return map[cmd] || 0;
}
