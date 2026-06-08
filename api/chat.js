import { AMD_PAY_KNOWLEDGE } from "./amdPayKnowledge.js";
import { getRelevantServices } from "./services.js";

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

    const userMessage = String(message).trim();
    const servicesContext = getRelevantServices(userMessage);

    const systemPrompt = `
أنت "مساعد أمد باي" لخدمة العملاء داخل الموقع والتطبيق.
تحدث كموظف دعم يمني ذكي، محترم، ودود، واضح، ومختصر.
لا تتحدث كروبوت، ولا تقل: "حسب المعلومات" أو "وجدت في المعلومات".

${AMD_PAY_KNOWLEDGE}

${servicesContext}

ممنوع منعًا باتًا:
- لا تعرض للمستخدم أي تحليل داخلي.
- لا تكتب User Input أو Context أو Identity أو Role أو Rules.
- لا تكتب Draft أو Internal Monologue أو Final Polish.
- لا تشرح كيف وصلت للإجابة.
- لا تكتب باللغة الإنجليزية إلا إذا طلب المستخدم ذلك.
- اكتب الرد النهائي فقط للعميل.

قواعد الرد النهائية:
- أجب على رسالة المستخدم بناءً على معلومات أمد باي والخدمات المطابقة فقط.
- إذا كانت الرسالة تحية، رد بتحية لطيفة واسأل كيف يمكنك مساعدته.
- إذا كان السؤال غير واضح، اطلب توضيحًا بسيطًا.
- إذا سأل عن توفر خدمة وظهرت ضمن معلومات الخدمات، أخبره أنها متوفرة داخل أمد باي.
- إذا سأل عن سعر خدمة وظهر السعر ضمن معلومات الخدمات، اذكر السعر مع التنبيه أن السعر النهائي داخل التطبيق قبل تأكيد الطلب.
- إذا لم يظهر السعر ضمن معلومات الخدمات، لا تخترع سعرًا، وقل إن السعر النهائي يظهر داخل التطبيق قبل التأكيد.
- إذا طلب تنفيذ عملية أو استرجاع أو تعديل حساب، وضّح أن ذلك يحتاج خدمة العملاء.
- إذا كانت المشكلة تحتاج إدارة، حوّل المستخدم إلى واتساب الدعم.
- لا تطلب كلمة المرور أو رمز التحقق أو أي بيانات حساسة.
`;

    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      ...history.slice(-4).map((msg) => ({
        role: msg.from === "bot" ? "model" : "user",
        parts: [{ text: msg.text || "" }],
      })),
      { role: "user", parts: [{ text: userMessage }] },
    ];

    const model = "models/gemini-2.0-flash-lite";

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
            maxOutputTokens: 380,
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

    return res.status(200).json({
      reply:
        "المساعد مشغول حاليًا بسبب ضغط مؤقت. جرّب بعد لحظات، أو تواصل مع خدمة العملاء.",
    });
  } catch (error) {
    return res.status(200).json({
      reply: "حدث ضغط مؤقت على المساعد. حاول مرة أخرى بعد لحظات.",
    });
  }
}
