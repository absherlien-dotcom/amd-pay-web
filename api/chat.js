import { AMD_PAY_KNOWLEDGE } from "./amdPayKnowledge.js";
import { getRelevantServices } from "./services.js";

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

    if (!apiKey) {
      return res.status(200).json({
        reply: "المساعد غير مفعّل حالياً. يرجى التواصل مع خدمة العملاء.",
      });
    }

    const userMessage = String(message).trim();
    const servicesContext = getRelevantServices(userMessage);

    const systemPrompt = `
أنت مساعد أمد باي الذكي لخدمة العملاء داخل الموقع والتطبيق.

مهمتك:
افهم سؤال المستخدم، استخدم معلومات أمد باي والخدمات المتاحة، ثم أعطِ إجابة طبيعية ذكية ومختصرة.

شخصيتك:
موظف دعم ذكي، محترم، ودود، واضح، ومختصر.
تتكلم بالعربية فقط إلا إذا طلب المستخدم غير ذلك.

معلومات أمد باي:
${AMD_PAY_KNOWLEDGE}

معلومات خدمات قريبة من سؤال المستخدم:
${servicesContext || "لا توجد خدمة مطابقة بوضوح."}

قواعد مهمة:
- لا تعرض أي تحليل داخلي أو خطوات تفكير.
- لا تكتب Draft أو Context أو Persona أو User says أو Internal Monologue.
- أعطِ الرد النهائي فقط.
- لا تخلط بين الخدمات المتشابهة؛ افهم نية المستخدم من السؤال كاملًا.
- إذا ظهرت نتائج كثيرة، اختر الأقرب فقط ولا تسرد كل شيء.
- إذا كان السؤال عن توفر خدمة، أجب هل هي متوفرة بناءً على النتائج.
- إذا كان السؤال عن السعر، اذكر السعر فقط إذا ظهر في معلومات الخدمات.
- إذا لم يظهر السعر، قل إن السعر النهائي يظهر داخل التطبيق قبل التأكيد.
- لا تنفذ عمليات ولا تعدل حسابات ولا تطلب كلمة مرور أو كود تحقق.
- إذا كان الطلب يحتاج مراجعة، وجّه المستخدم لخدمة العملاء.
`;

    const cleanHistory = history
      .slice(-2)
      .filter((msg) => {
        const t = msg.text || "";
        return !(
          t.includes("User says") ||
          t.includes("Context:") ||
          t.includes("Persona:") ||
          t.includes("Draft") ||
          t.includes("Internal Monologue") ||
          t.includes("Final Polish")
        );
      })
      .map((msg) => ({
        role: msg.from === "bot" ? "model" : "user",
        parts: [{ text: msg.text || "" }],
      }));

    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      ...cleanHistory,
      { role: "user", parts: [{ text: userMessage }] },
    ];

    const modelsResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    const modelsData = await modelsResponse.json();

    const availableModels =
      modelsData?.models
        ?.filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
        ?.map((m) => m.name) || [];

    const preferredModels = [
      "models/gemini-1.5-flash",
      "models/gemini-1.5-flash-8b",
      "models/gemini-2.0-flash-lite",
      "models/gemini-pro",
      ...availableModels,
    ];

    const uniqueModels = [...new Set(preferredModels)].filter((m) =>
      availableModels.includes(m)
    );

    for (const model of uniqueModels) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.25,
              topP: 0.8,
              maxOutputTokens: 500,
            },
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        let reply =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "لم أفهم سؤالك جيدًا، ممكن توضحه أكثر؟";

        const quotedArabic = reply.match(/"([^"]*[\u0600-\u06FF][^"]*)"$/);
        if (
          quotedArabic &&
          (reply.includes("User says") ||
            reply.includes("Context:") ||
            reply.includes("Draft") ||
            reply.includes("Persona:"))
        ) {
          reply = quotedArabic[1];
        }

        return res.status(200).json({ reply: reply.trim() });
      }
    }

    return res.status(200).json({
      reply: "المساعد مشغول حاليًا. جرّب بعد لحظات.",
    });
  } catch (error) {
    return res.status(200).json({
      reply: "حدث ضغط مؤقت على المساعد. حاول مرة أخرى بعد لحظات.",
    });
  }
}
