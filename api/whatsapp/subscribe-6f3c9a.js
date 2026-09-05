export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ ok: false });

  const token = process.env.WHATSAPP_TOKEN;
  const wabaId = "339989055863492";
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || "326926233843199";
  if (!token) return res.status(500).json({ ok: false, reason: "token_not_configured" });

  const call = async (url, options = {}) => {
    const r = await fetch(url, { ...options, headers: { Authorization: `Bearer ${token}`, ...(options.headers || {}) } });
    const data = await r.json();
    return { ok: r.ok, status: r.status, data };
  };

  try {
    const waba = await call(`https://graph.facebook.com/v26.0/${wabaId}?fields=id,name`);
    const phone = await call(`https://graph.facebook.com/v26.0/${phoneId}?fields=id,display_phone_number,verified_name`);
    if (!waba.ok) {
      return res.status(400).json({
        ok: false,
        stage: "waba_access",
        waba_error: { code: waba.data?.error?.code || null, type: waba.data?.error?.type || null },
        phone_access: phone.ok,
        phone: phone.ok ? { id: phone.data?.id || null, display_phone_number: phone.data?.display_phone_number || null, verified_name: phone.data?.verified_name || null } : null,
        phone_error: phone.ok ? null : { code: phone.data?.error?.code || null, type: phone.data?.error?.type || null }
      });
    }

    const sub = await call(`https://graph.facebook.com/v26.0/${wabaId}/subscribed_apps`, { method: "POST" });
    if (!sub.ok) {
      return res.status(sub.status).json({ ok: false, stage: "subscribe", code: sub.data?.error?.code || null, type: sub.data?.error?.type || null });
    }
    return res.status(200).json({ ok: true, waba: { id: waba.data?.id || null, name: waba.data?.name || null }, success: sub.data?.success === true });
  } catch (e) {
    return res.status(500).json({ ok: false, reason: "request_failed" });
  }
}
