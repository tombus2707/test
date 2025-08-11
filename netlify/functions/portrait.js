
export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }
  if (!process.env.OPENAI_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: "Missing OPENAI_API_KEY on server." }) };
  }
  try {
    const resp = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: "8-bit pixel art portrait of a random D&D adventurer",
        size: "1024x1024"  // patched size
      })
    });
    const json = await resp.json();
    if (!resp.ok) {
      const code = json?.error?.code;
      return {
        statusCode: resp.status,
        body: JSON.stringify({ error: "OpenAI error", code, details: json })
      };
    }
    return { statusCode: 200, body: JSON.stringify({ url: json.data[0].url }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server error", details: err.message }) };
  }
}
