import Hero from '@/components/Hero/Hero';
import Manifesto from '@/components/Manifesto/Manifesto';
import WorkCarousel from '@/components/WorkCarousel/WorkCarousel'
export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <WorkCarousel />
      <div style={{ height: '100vh', background: '#111', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>بخش بعدی سایت (پس از پایان هیرو)</h2>
      </div>
    </main>
  );
}
