export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        reply: "Method not allowed",
      });
    }

    const { message, history = [] } = req.body || {};
    const apiKey = process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        reply: "مفتاح Gemini غير موجود في إعدادات Vercel.",
      });
    }

    if (!message || !String(message).trim()) {
      return res.status(400).json({
        reply: "اكتب سؤالك وسأساعدك.",
      });
    }

    const systemPrompt = `
أنت "مساعد أمد باي" لخدمة العملاء.
تحدث كموظف دعم ذكي، محترم، ودود، واضح، وليس كروبوت.

قواعد مهمة:
- افهم السؤال كاملًا ولا تعتمد على كلمة واحدة.
- إذا كانت الرسالة تحية مثل مرحبا أو كيف حالك، رد طبيعيًا.
- لا تقل "وجدت في المعلومات".
- لا تخترع أسعار غير موجودة.
- لا تنفذ عمليات ولا تعد برد مبالغ.
- عند وجود مشكلة حساسة، وجّه العميل لخدمة العملاء.

معلومات أمد باي:
- أمد باي تطبيق خدمات رقمية في اليمن.
- يقدم شحن ألعاب، بطاقات رقمية، اشتراكات، تسديدات، خدمات اتصالات وإنترنت، وتغذية حساب.
- استعادة كلمة المرور تتم من واجهة تسجيل الدخول عبر واتساب أو الرسائل النصية.
- بعد استلام كلمة المرور المؤقتة، يدخل العميل للتطبيق ثم يغيرها من الإعدادات.
- توثيق الجهاز من الإعدادات > تأكيد الأجهزة > ترخيص هذا الجهاز.
- يمكن ترخيص جهاز جديد أو ترخيص الويب بالباركود.
- تغذية الحساب عبر الكريمي، المحافظ، شبكات الصرافة، وبطائق أمد باي.
- الحد الأدنى للتغذية 2000 ريال يمني.
- الاسترجاع متاح فقط للعمليات الفاشلة أو المعلقة.
- أوقات الدعم: 8:30 صباحًا إلى 12 ظهرًا، ومن 2 عصرًا إلى 12 منتصف الليل.
- أرقام الدعم: 712080901 - 711117749 - 777090975.
- السعر النهائي يظهر داخل التطبيق قبل تأكيد الطلب.
`;

    const contents = [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      ...history.slice(-6).map((msg) => ({
        role: msg.from === "bot" ? "model" : "user",
        parts: [{ text: msg.text || "" }],
      })),
      {
        role: "user",
        parts: [{ text: String(message).trim() }],
      },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.45,
            topP: 0.9,
            maxOutputTokens: 650,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(200).json({
        reply:
          "خطأ من Gemini: " +
          (data?.error?.message || JSON.stringify(data)),
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "لم يصل رد من Gemini. التفاصيل: " + JSON.stringify(data);

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({
      reply:
        "حدث خطأ مؤقت في الاتصال بالمساعد الذكي. حاول مرة أخرى بعد لحظات.",
    });
  }
}
