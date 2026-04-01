import Hero from '@/components/Hero/Hero';
import Manifesto from '@/components/Manifesto/Manifesto';
import WorkMinimal from '@/components/workminimal/WorkMinimal'
import CapabilitiesSection from "@/components/Capability/CapabilitiesSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <WorkMinimal />
      <CapabilitiesSection />

      <div style={{ height: '100vh', background: '#111', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>بخش بعدی سایت (پس از پایان هیرو)</h2>
      </div>
    </main>
  );
}
