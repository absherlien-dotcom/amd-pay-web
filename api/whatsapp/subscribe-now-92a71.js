export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ ok: false });
  const token = process.env.WHATSAPP_TOKEN;
  const wabaId = "339989055863492";
  if (!token) return res.status(500).json({ ok: false, reason: "token_not_configured" });
  try {
    const r = await fetch(`https://graph.facebook.com/v26.0/${wabaId}/subscribed_apps`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ ok:false, code:data?.error?.code||null, type:data?.error?.type||null });
    return res.status(200).json({ ok:true, success:data?.success===true });
  } catch (e) {
    return res.status(500).json({ ok:false, reason:"request_failed" });
  }
}
