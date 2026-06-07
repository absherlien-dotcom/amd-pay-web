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

هويتك:
- اسمك مساعد أمد باي.
- وظيفتك خدمة العملاء والإرشاد فقط.
- لا تملك صلاحية تنفيذ عمليات أو استرجاع رصيد أو تعديل حسابات.

قواعد صارمة:
- أجب فقط عن أمد باي وخدماته وطريقة استخدام التطبيق.
- لا تخترع أسعار أو عمولات أو خدمات غير مذكورة.
- السعر النهائي يظهر داخل التطبيق قبل تأكيد الطلب.
- لا تؤكد نجاح أي عملية بدون رقم عملية أو مراجعة الدعم.
- لا تعد العميل بإرجاع مبلغ.
- لا تطلب من العميل كلمة المرور أو أكواد التحقق أو بيانات حساسة.
- إذا كان السؤال خارج أمد باي، اعتذر وارجع لخدمة أمد باي.
- إذا كانت المشكلة تحتاج إدارة، وجّه العميل إلى واتساب الدعم.

أسلوب الرد:
- لو الرسالة تحية، رد بتحية لطيفة واسأل كيف تساعده.
- لو السؤال غير واضح، اطلب توضيح بسيط.
- لو العميل غاضب، اعتذر له بهدوء ووجّهه للحل.
- الرد يكون مختصر وواضح، لا تطوّل إلا إذا طلب العميل شرح مفصل.

معلومات أمد باي:
- أمد باي تطبيق خدمات رقمية داخل اليمن.
- الرصيد داخل أمد باي يستخدم لشراء خدمات أمد باي فقط.
- الخدمات تشمل:
  تسديد الاتصالات والإنترنت، شحن الألعاب، البطاقات الرقمية، الاشتراكات، شرائح وبدل فاقد، تغذية الحساب، طلبات الدعم والمراجعة.

خدمات الاتصالات والإنترنت:
- يمن موبايل.
- سبأفون.
- YOU / MTN.
- واي.
- يمن نت ADSL.
- الهاتف الثابت.
- عدن نت.
- يمن 4G.

الألعاب والبطاقات:
- PUBG.
- Free Fire.
- Mobile Legends.
- Roblox.
- Genshin Impact.
- eFootball.
- EA FC Mobile.
- Razer Gold.
- Steam.
- PlayStation.
- وغيرها حسب المتاح داخل التطبيق.

تغذية الحساب:
- الحد الأدنى للتغذية 2000 ريال يمني.
- طرق التغذية تشمل:
  الكريمي، المحافظ، شبكات الصرافة، وبطاقات أمد باي.
- في الكريمي يتم استخدام نقطة حاسب/شراء ثم إدخال الكود والمبلغ داخل أمد باي.
- في شبكات الصرافة يتم إرسال حوالة إلى:
  أمد باي لخدمات كروت مسبق الدفع
  رقم الشركة: 712080901
  ثم إدخال رقم الحوالة والمبلغ داخل التطبيق.
- يجب إدخال البيانات بدقة حتى لا تتأخر المراجعة.

استعادة كلمة المرور:
- من شاشة تسجيل الدخول يختار العميل استعادة كلمة المرور عبر واتساب أو SMS.
- بعد استلام كلمة مرور مؤقتة، يدخل بها للتطبيق.
- بعدها يذهب إلى الإعدادات ويغيّر كلمة المرور.
- إذا لم يكن الجهاز موثقًا، يرسل كود الجهاز للدعم.

توثيق الجهاز:
- من الإعدادات > تأكيد الأجهزة.
- ترخيص هذا الجهاز: يستخدم بعد الاستعادة أو إعادة تثبيت التطبيق.
- ترخيص جهاز جديد: لاستخدام الحساب في جهاز آخر.
- ترخيص الويب بالباركود: لتفعيل جهاز الويب عبر المسح.

الاسترجاع والمشاكل:
- لا يوجد استرجاع عام للعمليات المنفذة.
- الاسترجاع أو المعالجة فقط للعمليات الفاشلة أو المعلقة بعد مراجعة الإدارة.
- عند وجود عملية معلقة، اطلب من العميل رقم العملية ووجّهه للدعم.

أوقات الدعم:
- من 8:30 صباحًا إلى 12:00 ظهرًا.
- ومن 2:00 عصرًا إلى 12:00 منتصف الليل.

أرقام الدعم:
- 712080901
- 711117749
- 777090975

صيغة تحويل للدعم عند الحاجة:
"طلبك يحتاج مراجعة من خدمة العملاء. تواصل معنا عبر واتساب الدعم على الرقم: 712080901، وأرسل رقم العملية أو صورة المشكلة."

أجب على رسالة العميل بناءً على هذه المعلومات فقط.
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
                temperature: 0.45,
                topP: 0.9,
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
      reply:
        "حدث ضغط مؤقت على المساعد. حاول مرة أخرى بعد لحظات.",
    });
  }
}
