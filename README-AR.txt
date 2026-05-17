ملف سلايدر أمد باي الجاهز

المحتوى:
1) 5 بنرات Desktop بمقاس 1920x650 داخل:
public/assets/images/slider/banner-01.webp إلى banner-05.webp

2) 5 بنرات Mobile بمقاس 1080x1350 داخل:
public/assets/images/slider/mobile-banner-01.webp إلى mobile-banner-05.webp

3) ملف مكون السلايدر:
src/components/AutoBannerSlider.jsx

4) ملف CSS للسلايدر:
src/components/autoBannerSlider.css

طريقة الرفع إلى GitHub:
- افتح المستودع amd-pay-web
- اسحب مجلد public ومجلد src من داخل هذا الملف إلى GitHub
- وافق على الاستبدال/الإضافة إذا طلب GitHub ذلك
- Commit changes

التعديل المطلوب داخل main.jsx:
1) أعلى الملف مع الاستيرادات أضف:
import AutoBannerSlider from "./components/AutoBannerSlider";

2) ضع السطر التالي في المكان الذي تريد ظهور البنر فيه، ويفضل قبل قسم خدمات أمد باي الأساسية:
<AutoBannerSlider />

ملاحظة مهمة:
البنرات مصممة باستخدام لقطات واجهات أمد باي الحقيقية الموجودة لديك، وليست واجهات مزيفة.
