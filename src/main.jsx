import React from "react";
import { createRoot } from "react-dom/client";
import { motion } from "framer-motion";
import {
  Smartphone,
  Gamepad2,
  CreditCard,
  Wifi,
  Wallet,
  Headphones,
  CheckCircle2,
  ArrowDownToLine,
  Star,
  MessageCircle,
  Phone,
  BadgeCheck,
  Layers3,
  Search,
} from "lucide-react";
import { BRAND } from "./siteConfig";
import "./index.css";

const services = [
  { icon: Wifi, title: "تسديدات محلية", text: "خدمات سداد واتصالات وإنترنت تناسب احتياج المستخدم اليمني." },
  { icon: Gamepad2, title: "شحن الألعاب", text: "PUBG، Free Fire، Mobile Legends، EA FC Mobile، Roblox والمزيد." },
  { icon: CreditCard, title: "البطاقات الرقمية", text: "بطاقات إنترنت، كروت رقمية، واشتراكات متعددة في مكان واحد." },
  { icon: Wallet, title: "تغذية الحساب", text: "خيارات تغذية مرنة عبر المحافظ والحوالات وبطاقة أمد باي." },
];

const trustPoints = [
  "واجهة سهلة وحديثة بنفس هوية أمد باي",
  "خدمات متنوعة للشباب وأصحاب المحلات",
  "انتقال مباشر من الإعلان إلى صفحة التحميل",
  "أزرار واضحة للتواصل والدعم",
  "تصميم متجاوب للجوال والحاسوب",
  "مناسب لحملات Meta Ads",
];

const appSections = ["كبينة السداد", "شحن التطبيقات", "البطاقات", "شحن الألعاب", "الشبكات", "سدد لي", "المسابقات", "الشرائح"];

const faqs = [
  { q: "ما هو تطبيق أمد باي؟", a: "أمد باي تطبيق خدمات رقمية للسوق اليمني، يجمع الشحن، السداد، البطاقات، والاشتراكات في تجربة واحدة سهلة." },
  { q: "هل يمكن تحميل التطبيق من Google Play؟", a: "نعم، يمكن تحميل التطبيق مباشرة من زر Google Play الموجود في أعلى الصفحة وفي نهاية الصفحة." },
  { q: "كيف أتواصل مع الدعم؟", a: "يمكن التواصل عبر واتساب من زر التواصل أو عبر أرقام التواصل الظاهرة في أسفل الصفحة." },
];

const smokeTests = [
  { name: "Google Play link exists", pass: Boolean(BRAND.links.googlePlay) },
  { name: "WhatsApp link exists", pass: Boolean(BRAND.links.whatsapp) },
  { name: "At least three phone numbers", pass: BRAND.phones.length >= 3 },
  { name: "Screenshots configured", pass: BRAND.assets.screenshots.length >= 6 },
];
smokeTests.forEach((test) => console.assert(test.pass, `Amd Pay landing test failed: ${test.name}`));

function SocialIcon({ label }) {
  return <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#ffb36a] text-[10px] font-black text-[#10274d]">{label}</span>;
}

function Logo({ compact = false, light = false }) {
  return (
    <div className="flex items-center gap-3">
      <img src={BRAND.assets.logo} alt="شعار أمد باي" className={compact ? "h-12 w-12 rounded-2xl bg-white object-contain p-1" : "h-16 w-16 rounded-2xl bg-white object-contain p-1 shadow-xl"} />
      <div>
        <div className={`text-xl font-black ${light ? "text-white" : "text-[#234b87]"}`}>{BRAND.nameAr}</div>
        <div className="text-xs font-extrabold tracking-[0.24em] text-[#ff861c]">{BRAND.nameEn}</div>
      </div>
    </div>
  );
}

function ButtonLink({ href, children, variant = "primary" }) {
  const base = "inline-flex items-center justify-center gap-3 rounded-2xl px-6 py-4 text-base font-black transition hover:-translate-y-1 hover:shadow-xl";
  const styles = variant === "primary" ? "bg-[#ff861c] text-white shadow-lg shadow-orange-500/30" : variant === "light" ? "bg-white text-[#234b87] shadow-lg shadow-blue-900/10" : "border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/15";
  return <a href={href} target="_blank" rel="noreferrer" className={`${base} ${styles}`}>{children}</a>;
}

function PhoneShowcase() {
  return (
    <motion.div initial={{ opacity: 0, y: 40, rotate: -3 }} animate={{ opacity: 1, y: 0, rotate: -2 }} transition={{ duration: 0.8 }} className="relative mx-auto h-[620px] w-[315px] rounded-[3.2rem] border-[10px] border-[#12264a] bg-[#12264a] shadow-[0_45px_120px_rgba(35,75,135,.35)]">
      <div className="absolute -left-8 top-16 h-32 w-32 rounded-full bg-[#ff861c]/25 blur-3xl" />
      <div className="absolute -right-8 bottom-16 h-32 w-32 rounded-full bg-[#234b87]/25 blur-3xl" />
      <div className="relative h-full overflow-hidden rounded-[2.45rem] bg-white">
        <img src={BRAND.assets.screenshots[0].src} alt="واجهة تطبيق أمد باي الرئيسية" className="h-full w-full object-cover" />
      </div>
    </motion.div>
  );
}

function ScreenshotCard({ item, index }) {
  return (
    <motion.div whileHover={{ y: -8 }} className="min-w-[255px] snap-center rounded-[2.1rem] border border-[#dfe5ef] bg-white p-3 shadow-xl shadow-blue-900/10">
      <div className="overflow-hidden rounded-[1.7rem] bg-[#f4f6fb]">
        <img src={item.src} alt={item.title} className="h-[460px] w-full object-cover object-top" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-black text-[#234b87]">{item.title}</h3>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff861c]/10 text-sm font-black text-[#ff861c]">{index + 1}</span>
        </div>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{item.note}</p>
      </div>
    </motion.div>
  );
}

function App() {
  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-[#f4f6fb] text-slate-900">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,#ffffff_0,#f4f6fb_30%,#eaf0f8_65%,#ffffff_100%)]">
        <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-[#234b87]/15 blur-3xl" />
        <div className="absolute -left-24 bottom-12 h-72 w-72 rounded-full bg-[#ff861c]/20 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(135deg,#234b87 10%,transparent 10%,transparent 50%,#234b87 50%,#234b87 60%,transparent 60%,transparent)", backgroundSize: "28px 28px" }} />

        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 md:px-8">
          <Logo />
          <nav className="hidden items-center gap-3 md:flex">
            <a href="#features" className="rounded-full px-4 py-2 text-sm font-bold text-[#234b87] hover:bg-white">المميزات</a>
            <a href="#screens" className="rounded-full px-4 py-2 text-sm font-bold text-[#234b87] hover:bg-white">الواجهات</a>
            <a href="#contact" className="rounded-full px-4 py-2 text-sm font-bold text-[#234b87] hover:bg-white">التواصل</a>
          </nav>
          <a href={BRAND.links.googlePlay} target="_blank" rel="noreferrer" className="rounded-full bg-[#234b87] px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-900/20">تحميل الآن</a>
        </header>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-6 md:grid-cols-2 md:px-8 md:pb-28 md:pt-12">
          <div>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#234b87]/10 bg-white px-4 py-2 text-sm font-black text-[#234b87] shadow-lg shadow-blue-900/5">
              <Star className="h-4 w-4 fill-[#ff861c] text-[#ff861c]" /> صفحة تحميل رسمية لحملات ميتا
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="max-w-2xl text-5xl font-black leading-tight text-[#234b87] md:text-7xl">
              حمّل أمد باي
              <span className="block text-[#ff861c]">وخدماتك الرقمية تصير أسهل</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="mt-6 max-w-2xl text-lg font-semibold leading-9 text-slate-600">{BRAND.description}</motion.p>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="mt-8 flex flex-col gap-4 sm:flex-row">
              <ButtonLink href={BRAND.links.googlePlay}><ArrowDownToLine className="h-5 w-5" /> تحميل من Google Play</ButtonLink>
              <ButtonLink href={BRAND.links.whatsapp} variant="light"><MessageCircle className="h-5 w-5" /> تواصل واتساب</ButtonLink>
            </motion.div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["سريع", "يمني", "متعدد الخدمات"].map((x) => <div key={x} className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 font-black text-[#234b87] shadow-lg shadow-blue-900/5"><BadgeCheck className="h-5 w-5 text-[#ff861c]" /> {x}</div>)}
            </div>
          </div>
          <PhoneShowcase />
        </div>
      </section>

      <section id="features" className="relative mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="mb-10 text-center">
          <p className="font-black text-[#ff861c]">كل ما يحتاجه العميل في مكان واحد</p>
          <h2 className="mt-3 text-4xl font-black text-[#234b87] md:text-5xl">خدمات أمد باي الأساسية</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;
            return <motion.div whileHover={{ y: -6 }} key={service.title} className="rounded-[2rem] bg-white p-6 shadow-xl shadow-blue-900/10 ring-1 ring-slate-200/80"><div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#234b87] text-white shadow-lg shadow-blue-900/20"><Icon className="h-8 w-8" /></div><h3 className="text-xl font-black text-[#234b87]">{service.title}</h3><p className="mt-3 font-semibold leading-7 text-slate-500">{service.text}</p></motion.div>;
          })}
        </div>
      </section>

      <section className="bg-[#234b87] px-5 py-20 text-white md:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">
          <div><p className="mb-3 font-black text-[#ffb36a]">مصمم للتحويل من إعلانات ميتا</p><h2 className="text-4xl font-black leading-tight md:text-5xl">صفحة واضحة تجعل العميل يضغط تحميل بدون تردد</h2><p className="mt-5 max-w-xl font-semibold leading-9 text-blue-100">الصفحة تعرض الشعار، الهوية، مزايا التطبيق، الواجهات الحقيقية، وروابط التواصل والتحميل بشكل مباشر وسريع.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">{trustPoints.map((point) => <div key={point} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#ffb36a]" /><span className="font-bold leading-7">{point}</span></div>)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="grid items-center gap-10 rounded-[2.5rem] bg-white p-6 shadow-2xl shadow-blue-900/10 ring-1 ring-slate-200 md:grid-cols-[0.9fr_1.1fr] md:p-10">
          <div className="rounded-[2rem] bg-[#f4f6fb] p-4"><img src={BRAND.assets.screenshots[2].src} alt="خدمات أمد باي" className="mx-auto max-h-[620px] rounded-[1.7rem] object-contain" /></div>
          <div><p className="mb-3 font-black text-[#ff861c]">تصفح سهل للخدمات</p><h2 className="text-4xl font-black leading-tight text-[#234b87] md:text-5xl">أقسام واضحة داخل التطبيق</h2><p className="mt-5 font-semibold leading-9 text-slate-600">أمد باي يجمع الخدمات داخل تصنيفات سهلة تساعد العميل على الوصول للخدمة بسرعة، سواء كان يريد شحن لعبة، شراء بطاقة، أو تغذية حسابه.</p><div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">{appSections.map((section) => <div key={section} className="rounded-2xl bg-[#f4f6fb] px-4 py-3 text-center font-black text-[#234b87] ring-1 ring-slate-200">{section}</div>)}</div></div>
        </div>
      </section>

      <section id="screens" className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
        <div className="mb-10 text-center"><p className="font-black text-[#ff861c]">صور من التطبيق</p><h2 className="mt-3 text-4xl font-black text-[#234b87] md:text-5xl">واجهات حقيقية من أمد باي</h2></div>
        <div className="scrollbar-hide flex snap-x gap-5 overflow-x-auto pb-6">{BRAND.assets.screenshots.map((item, index) => <ScreenshotCard key={item.title} item={item} index={index} />)}</div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[{ icon: Search, title: "بحث سريع", text: "العميل يجد الخدمة المطلوبة بسرعة من خلال البحث والتصنيفات." }, { icon: Layers3, title: "خدمات كثيرة", text: "ألعاب، بطاقات، برامج، اتصالات، اشتراكات، وأكثر." }, { icon: Headphones, title: "دعم مباشر", text: "روابط تواصل واضحة عبر واتساب ومنصات التواصل." }].map((item) => { const Icon = item.icon; return <div key={item.title} className="rounded-[2rem] bg-white p-7 shadow-xl shadow-blue-900/10 ring-1 ring-slate-200"><Icon className="h-10 w-10 text-[#ff861c]" /><h3 className="mt-5 text-2xl font-black text-[#234b87]">{item.title}</h3><p className="mt-3 font-semibold leading-8 text-slate-500">{item.text}</p></div>; })}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#10274d] px-5 py-20 text-white md:px-8">
        <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-[#ff861c]/20 blur-3xl" /><div className="absolute -left-20 bottom-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.1fr_.9fr]">
          <div><Logo light /><h2 className="mt-8 text-4xl font-black leading-tight md:text-5xl">ابدأ الآن مع أمد باي</h2><p className="mt-5 max-w-2xl font-semibold leading-9 text-blue-100">حمّل التطبيق من Google Play أو تواصل معنا عبر واتساب لمعرفة المزيد عن خدمات أمد باي.</p><div className="mt-8 flex flex-col gap-4 sm:flex-row"><ButtonLink href={BRAND.links.googlePlay}><Smartphone className="h-5 w-5" /> تحميل التطبيق</ButtonLink><ButtonLink href={BRAND.links.whatsapp} variant="ghost"><MessageCircle className="h-5 w-5" /> واتساب الدعم</ButtonLink></div></div>
          <div id="contact" className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur"><h3 className="text-2xl font-black">التواصل الرسمي</h3><div className="mt-6 grid gap-3">{BRAND.phones.map((phone) => <a key={phone} href={`tel:${phone}`} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 font-bold hover:bg-white/15"><Phone className="h-5 w-5 text-[#ffb36a]" /> {phone}</a>)}<a href={BRAND.links.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 font-bold hover:bg-white/15"><SocialIcon label="f" /> Facebook</a><a href={BRAND.links.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 font-bold hover:bg-white/15"><SocialIcon label="ig" /> Instagram</a><a href={BRAND.links.whatsapp} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 font-bold hover:bg-white/15"><MessageCircle className="h-5 w-5 text-[#ffb36a]" /> رابط واتساب</a></div></div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-20 md:px-8"><div className="mb-8 text-center"><h2 className="text-4xl font-black text-[#234b87]">أسئلة شائعة</h2></div><div className="space-y-4">{faqs.map((faq) => <details key={faq.q} className="rounded-2xl bg-white p-6 shadow-lg shadow-blue-900/5 ring-1 ring-slate-200"><summary className="cursor-pointer list-none text-lg font-black text-[#234b87]">{faq.q}</summary><p className="mt-4 font-semibold leading-8 text-slate-500">{faq.a}</p></details>)}</div></section>
      <footer className="border-t border-slate-200 bg-white px-5 py-8 md:px-8"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row"><Logo compact /><p className="text-sm font-bold text-slate-500">© 2026 أمد باي — جميع الحقوق محفوظة</p></div></footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
