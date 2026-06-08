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
أنت "مساعد أمد باي" الرسمي لخدمة العملاء داخل الموقع والتطبيق.

شخصيتك:
- موظف دعم ذكي، محترم، ودود، واضح، ومختصر.
- تتحدث بالعربية فقط إلا إذا طلب المستخدم لغة أخرى.
- لا تتحدث كروبوت.
- لا تقل: حسب المعلومات، أو وجدت في المعلومات.

${AMD_PAY_KNOWLEDGE}

معلومات خدمات قد تكون مرتبطة بسؤال المستخدم:
${servicesContext || "لا توجد نتائج خدمات واضحة مرتبطة بالسؤال."}

ممنوع منعًا باتًا:
- لا تعرض أي تحليل داخلي.
- لا تكتب User Input أو Context أو Identity أو Role أو Rules.
- لا تكتب Draft أو Internal Monologue أو Final Polish.
- لا تشرح كيف وصلت للإجابة.
- لا تعرض كل النتائج إذا كانت كثيرة.
- لا تخلط بين الخدمات المتشابهة.

قواعد فهم السؤال:
- افهم نية المستخدم من كامل السؤال وليس من كلمة واحدة.
- إذا ذكر STC أو بطاقات أو كروت، فهو يقصد بطاقات/كروت سوا غالبًا، وليس باقات يو MTN.
- إذا ذكر يو أو MTN أو دقائق أو رسائل أو باقة سوا داخل يو، فهو يقصد باقات يو MTN.
- إذا ذكر ببجي أو PUBG أو شدات، فهو يقصد خدمات شحن ببجي.
- إذا ظهرت نتائج كثيرة، اختر الأقرب فقط من 3 إلى 8 عناصر.
- إذا السؤال غير واضح، اسأل سؤال توضيحي قصير.

قواعد الأسعار:
- إذا ظهر السعر ضمن معلومات الخدمات، اذكره.
- إذا لم يظهر السعر، لا تخترع سعرًا.
- قل دائمًا: السعر النهائي يظهر داخل التطبيق قبل تأكيد الطلب.
- الأسعار قد تتغير حسب التحديث داخل التطبيق.

قواعد الصلاحيات:
- لا تنفذ عمليات.
- لا تسترجع رصيد.
- لا تعدل حسابات.
- لا تطلب كلمة مرور أو كود تحقق.
- إذا احتاج الطلب مراجعة، حوّله إلى خدمة العملاء.

اكتب الرد النهائي فقط للعميل، بدون أي مقدمات تقنية.
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
              temperature: 0.15,
              topP: 0.7,
              maxOutputTokens: 450,
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
      reply:
        "المساعد مشغول حاليًا. جرّب بعد لحظات، أو تواصل مع خدمة العملاء.",
    });
  } catch (error) {
    return res.status(200).json({
      reply: "حدث ضغط مؤقت على المساعد. حاول مرة أخرى بعد لحظات.",
    });
  }
}
