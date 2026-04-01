import Hero from '@/components/Hero/Hero';
import Manifesto from '@/components/Manifesto/Manifesto';
import WorkCarousel from '@/components/WorkCarousel/WorkCarousel'
import WorkMinimal from '@/components/workminimal/WorkMinimal'
export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <WorkMinimal />
      <div style={{ height: '100vh', background: '#111', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>بخش بعدی سایت (پس از پایان هیرو)</h2>
      </div>
    </main>
  );
}
