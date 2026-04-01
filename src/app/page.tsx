import Hero from '@/components/Hero/Hero';
import Manifesto from '@/components/Manifesto/Manifesto';
export default function Home() {
  return (
    <main>
      {/* کامپوننت هیرو در اینجا رندر می‌شود */}
      <Hero />

      {/* 
        فضای خالی برای اسکرول کردن 
        چون انیمیشن شما به اسکرول وابسته است (۴۰۰ ارتفاع دید یا 400vh)،
        برای تست کردن می‌توانید محتوای تستی زیر را اضافه کنید تا صفحه اسکرول بخورد
      */}
      <Manifesto />
      <div style={{ height: '100vh', background: '#111', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>بخش بعدی سایت (پس از پایان هیرو)</h2>
      </div>
    </main>
  );
}
