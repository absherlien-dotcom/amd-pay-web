import { AMD_PAY_KNOWLEDGE } from "./amdPayKnowledge.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ reply: "Method not allowed" });
    }

    const { message, history = [] } = req.body || {};
    const apiKey = process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        reply: "المساعد غير مفعّل حالياً. يرجى التواصل مع خدمة العملاء.",
      });
    }

    if (!message || !String(message).trim()) {
      return res.status(200).json({ reply: "اكتب سؤالك وسأساعدك." });
    }

    const systemPrompt = `
أنت "مساعد أمد باي" لخدمة العملاء داخل الموقع والتطبيق.
تحدث كموظف دعم يمني ذكي، محترم، ودود، واضح، ومختصر.
لا تتحدث كروبوت، ولا تقل: "حسب المعلومات" أو "وجدت في المعلومات".

${AMD_PAY_KNOWLEDGE}

قواعد الرد النهائية:
- أجب على رسالة المستخدم بناءً على معلومات أمد باي فقط.
- إذا كانت الرسالة تحية، رد بتحية لطيفة واسأل كيف يمكنك مساعدته.
- إذا كان السؤال غير واضح، اطلب توضيحًا بسيطًا.
- إذا سأل عن سعر خدمة، أخبره أن السعر النهائي يظهر داخل التطبيق قبل تأكيد الطلب.
- إذا طلب تنفيذ عملية أو استرجاع أو تعديل حساب، وضّح أن ذلك يحتاج خدمة العملاء.
- إذا كانت المشكلة تحتاج إدارة، حوّل المستخدم إلى واتساب الدعم.
- لا تطلب كلمة المرور أو رمز التحقق أو أي بيانات حساسة.
`;

    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      ...history.slice(-6).map((msg) => ({
        role: msg.from === "bot" ? "model" : "user",
        parts: [{ text: msg.text || "" }],
      })),
      { role: "user", parts: [{ text: String(message).trim() }] },
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
      "models/gemini-2.0-flash-lite",
      "models/gemini-1.5-flash-8b",
      "models/gemini-1.5-flash",
      "models/gemini-pro",
      ...availableModels,
    ];

    const uniqueModels = [...new Set(preferredModels)].filter((m) =>
      availableModels.includes(m)
    );

    if (!uniqueModels.length) {
      return res.status(200).json({
        reply: "المساعد الذكي غير متاح مؤقتًا. يرجى المحاولة بعد قليل.",
      });
    }

    let lastError = "";

    for (const model of uniqueModels) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents,
              generationConfig: {
                temperature: 0.35,
                topP: 0.85,
                maxOutputTokens: 650,
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

        lastError = data?.error?.message || JSON.stringify(data);

        if (!lastError.includes("high demand") && !lastError.includes("overloaded")) {
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 800));
      }
    }

    return res.status(200).json({
      reply:
        "المساعد مشغول حاليًا بسبب ضغط مؤقت. جرّب بعد لحظات، أو اكتب سؤالك مرة أخرى وسأحاول مساعدتك.",
    });
  } catch (error) {
    return res.status(200).json({
      reply: "حدث ضغط مؤقت على المساعد. حاول مرة أخرى بعد لحظات.",
    });
  }
}
