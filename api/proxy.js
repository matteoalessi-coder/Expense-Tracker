// api/proxy.js - Vercel serverless proxy to forward requests to Google Apps Script
export default async function handler(req, res) {
  // CORS preflight handling
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  try {
    // Replace this with your Apps Script URL
    const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzmP0M9FDkyRPMveJ6j4H260vhkxcTR3cfe3mmuVY0qvwNVPjE53L7ZeNzwTPn9ySX7/exec";

    // Forward request as JSON to Apps Script (server-to-server)
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    };

    const resp = await fetch(APPS_SCRIPT_URL, fetchOptions);
    const text = await resp.text();

    // Try to parse Apps Script response as JSON; fallback to raw text
    let parsed;
    try { parsed = JSON.parse(text); } catch (e) { parsed = { raw: text }; }

    // Return the Apps Script response to the browser and add CORS header
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    return res.status(resp.status).json(parsed);
  } catch (err) {
    console.error("Proxy error:", err);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({ success: false, error: err.message });
  }
}
