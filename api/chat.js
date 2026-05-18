export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        reply: "Method not allowed",
      });
    }

    const { message } = req.body;

    const apiKey = process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        reply: "Gemini API key missing",
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
أنت موظف خدمة عملاء لتطبيق أمد باي.
اسمك مساعد أمد باي.

تجاوب باختصار واحترافية وباللهجة العربية المفهومة.

رسالة العميل:
${message}
                  `,
                },
              ],
            },
          ],
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
