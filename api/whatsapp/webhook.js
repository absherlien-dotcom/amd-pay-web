const VERIFY_TOKEN = "AMD_PAY_WA_VERIFY_2026";

function extractIncomingText(body) {
  try {
    const value = body?.entry?.[0]?.changes?.[0]?.value;
    const msg = value?.messages?.[0];
    if (!msg || msg.type !== "text") return null;
    return {
      from: msg.from,
      text: msg.text?.body?.trim() || "",
      phoneNumberId: value?.metadata?.phone_number_id,
      messageId: msg.id,
    };
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send("Forbidden");
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).send("Method Not Allowed");
  }

  const incoming = extractIncomingText(req.body);

  if (!incoming?.from || !incoming?.text) {
    return res.status(200).send("EVENT_RECEIVED");
  }

  try {
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const proto = req.headers["x-forwarded-proto"] || "https";

    const aiResponse = await fetch(`${proto}://${host}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: incoming.text, history: [] }),
    });

    const aiData = await aiResponse.json().catch(() => ({}));
    const reply = aiData?.reply || "خدمة أمد باي مشغولة حالياً. حاول مرة أخرى بعد قليل.";

    const accessToken = process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || incoming.phoneNumberId;

    if (accessToken && phoneNumberId) {
      const sendResponse = await fetch(`https://graph.facebook.com/v26.0/${phoneNumberId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: incoming.from,
          type: "text",
          text: { body: String(reply).slice(0, 4096) },
        }),
      });

      if (!sendResponse.ok) {
        const errorText = await sendResponse.text();
        console.error("WhatsApp send failed", sendResponse.status, errorText);
      }
    } else {
      console.error("Missing WhatsApp credentials", {
        hasToken: Boolean(accessToken),
        hasPhoneNumberId: Boolean(phoneNumberId),
      });
    }
  } catch (error) {
    console.error("WhatsApp webhook processing error", error);
  }

  return res.status(200).send("EVENT_RECEIVED");
}
