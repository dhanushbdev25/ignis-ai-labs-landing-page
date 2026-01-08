import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Capabilities } from './components/Capabilities';
import { Solutions } from './components/Solutions';
import { Process } from './components/Process';
import { Metrics } from './components/Metrics';
import { CaseStudies } from './components/CaseStudies';
import { Testimonials } from './components/Testimonials';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Capabilities />
        <Solutions />
        <Process />
        <Metrics />
        {/* <CaseStudies /> */}
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
