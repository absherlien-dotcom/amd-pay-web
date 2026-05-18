export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      reply: "Method not allowed",
    });
  }

  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "الرسالة فارغة",
      });
    }

    const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;

    const systemPrompt = `
أنت مساعد أمد باي الذكي لخدمة العملاء.

تتحدث بأسلوب بشري ذكي واحترافي ولطيف.
لا ترد كروبوت آلي.
افهم معنى السؤال حتى لو كان غير مرتب.
حلل الرسالة كاملة وليس بالكلمات فقط.

معلومات أمد باي:

- التطبيق يقدم شحن ألعاب وبطاقات وخدمات رقمية وتسديدات.
- يوجد استعادة كلمة مرور.
- يوجد توثيق جهاز.
- يوجد تغذية حساب عبر المحافظ اليمنية.
- يوجد تحويل رصيد ضمن نفس المجموعة.
- يوجد بطاقات أمد باي للتحويل بين العملاء.
- الدعم عبر واتساب عند الحاجة.
- العملات: ريال شمال / جنوب / سعودي / دولار.
- الأسعار النهائية تظهر داخل التطبيق.

إذا لم تفهم السؤال اسأل المستخدم بتوضيح ذكي.
إذا كان السؤال عام مثل "كيف حالك" رد بشكل طبيعي كبشر.
إذا احتاج دعم مباشر وجهه للدعم.
`;

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: systemPrompt,
          },
        ],
      },
      ...history.slice(-6).map((msg) => ({
        role: msg.from === "bot" ? "model" : "user",
        parts: [
          {
            text: msg.text,
          },
        ],
      })),
      {
        role: "user",
        parts: [
          {
            text: message,
          },
        ],
      },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.8,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "عذراً، حدث خطأ أثناء الرد.";

    return res.status(200).json({
      reply,
    });
  } catch (error) {
    return res.status(500).json({
      reply: "حدث خطأ مؤقت، حاول مرة أخرى.",
    });
  }
}
