export async function handler(event, context) {
  const baseHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: baseHeaders, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: baseHeaders, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }
  try {
    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt) {
      return { statusCode: 400, headers: baseHeaders, body: JSON.stringify({ error: "Missing prompt from client." }) };
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, headers: baseHeaders, body: JSON.stringify({ error: "Missing OPENAI_API_KEY on server." }) };
    }

    const resp = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ model: "gpt-image-1", prompt, size: "1024x1024", n: 1 })
    });
    const text = await resp.text();
    let json;
    try { json = JSON.parse(text); } catch {
      return { statusCode: 502, headers: baseHeaders, body: JSON.stringify({ error: "Non-JSON from OpenAI", raw: text.slice(0, 300) }) };
    }
    if (!resp.ok) {
      return { statusCode: resp.status, headers: baseHeaders, body: JSON.stringify({ error: "OpenAI error", details: json }) };
    }
    const url = json?.data?.[0]?.url;
    if (!url) {
      return { statusCode: 502, headers: baseHeaders, body: JSON.stringify({ error: "No image URL returned", json }) };
    }
    return { statusCode: 200, headers: baseHeaders, body: JSON.stringify({ url }) };
  } catch (e) {
    return { statusCode: 500, headers: baseHeaders, body: JSON.stringify({ error: "Server error", details: String(e) }) };
  }
}
