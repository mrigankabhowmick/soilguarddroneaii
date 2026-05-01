import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with an environment variable key. 
// If it isn't set, we mock the response for local development.
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
    try {
        const data = await req.json();

        if (!apiKey) {
            // Mock summary if no API key is provided
            return NextResponse.json({
                summary: `(Mock AI Summary) Based on recent parameters, the temperature is ${data.temp}°C and moisture is at ${data.moisture}%. The AI sees a steady environment but flags NPK values (N:${data.n}, P:${data.p}, K:${data.k}) for minor fertilizer correction. Add some Potassium soon!`
            });
        }

        // Call the actual Gemini API
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `You are SoilGuard AI, an expert agricultural assistant. Based on this real-time data from a soil sensor, provide a 2 sentence summary and immediate concise recommendation for the farmer in an encouraging tone. 
        Data: Temperature ${data.temp}°C, Humidity ${data.humidity}%, Soil Moisture ${data.moisture}%, Nitrogen ${data.n} mg/kg, Phosphorus ${data.p} mg/kg, Potassium ${data.k} mg/kg.`;

        const result = await model.generateContent(prompt);
        const response = await result.response.text();

        return NextResponse.json({ summary: response });

    } catch (error) {
        console.error("AI Error:", error);
        return NextResponse.json(
            { summary: "AI Summary is temporarily unavailable. The raw data remains stable." },
            { status: 500 }
        );
    }
}
