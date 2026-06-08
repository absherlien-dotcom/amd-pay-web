import { AMD_PAY_KNOWLEDGE } from "./amdPayKnowledge.js";
import { getRelevantServices } from "./services.js";

function isServiceQuestion(text) {
  return /(سعر|اسعار|أسعار|فئات|فئه|فئة|متوفر|موجود|ببجي|pubg|سوا|stc|بطاقات|شدات|باقة|باقات|يمن موبايل|سبافون|واي|mtn|يو|فورجي|عدن نت|يمن نت)/i.test(text);
}

function cleanServiceReply(servicesContext) {
  if (!servicesContext || !servicesContext.trim()) return "";
  const lines = servicesContext
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 25);

  return `نعم، هذه المعلومات المتوفرة داخل أمد باي:\n\n${lines.join("\n")}\n\nملاحظة: السعر النهائي يظهر داخل التطبيق قبل تأكيد الطلب.`;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ reply: "Method not allowed" });
    }

    const { message, history = [] } = req.body || {};
    const apiKey = process.env.VITE_GEMINI_API_KEY;

    if (!message || !String(message).trim()) {
      return res.status(200).json({ reply: "اكتب سؤالك وسأساعدك." });
    }

    const userMessage = String(message).trim();
    const servicesContext = getRelevantServices(userMessage);

    if (isServiceQuestion(userMessage) && servicesContext && servicesContext.trim()) {
      return res.status(200).json({
        reply: cleanServiceReply(servicesContext),
      });
    }

    if (!apiKey) {
      return res.status(200).json({
        reply: "المساعد غير مفعّل حالياً. يرجى التواصل مع خدمة العملاء.",
      });
    }

    const systemPrompt = `
أنت مساعد أمد باي لخدمة العملاء.
اكتب الرد النهائي فقط، بدون تحليل داخلي، بدون Draft، بدون Context، بدون شرح القواعد.
تحدث بالعربية فقط وبأسلوب مختصر وواضح.

${AMD_PAY_KNOWLEDGE}

${servicesContext}

قواعد:
- لا تخترع أسعار.
- إذا السعر موجود في معلومات الخدمات اذكره.
- إذا غير موجود قل إن السعر النهائي يظهر داخل التطبيق قبل تأكيد الطلب.
- لا تنفذ عمليات ولا تعدل حسابات ولا تطلب كلمات مرور أو أكواد.
`;

    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      ...history.slice(-3).map((msg) => ({
        role: msg.from === "bot" ? "model" : "user",
        parts: [{ text: msg.text || "" }],
      })),
      { role: "user", parts: [{ text: userMessage }] },
    ];

    const models = [
      "models/gemini-1.5-flash",
      "models/gemini-1.5-flash-8b",
      "models/gemini-2.0-flash-lite",
    ];

    for (const model of models) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.1,
              topP: 0.6,
              maxOutputTokens: 350,
            },
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const reply =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "لم أفهم سؤالك جيدًا، ممكن توضحه أكثر؟";

        return res.status(200).json({ reply });
      }
    }

    return res.status(200).json({
      reply: "المساعد مشغول حاليًا. جرّب بعد لحظات أو تواصل مع خدمة العملاء.",
    });
  } catch (error) {
    return res.status(200).json({
      reply: "حدث ضغط مؤقت على المساعد. حاول مرة أخرى بعد لحظات.",
    });
  }
}
