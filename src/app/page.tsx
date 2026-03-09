import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { WebinarSection } from "@/components/webinar-section";
import { WorkshopsSection } from "@/components/workshops-section";
import { ConsultingSection } from "@/components/consulting-section";
import { ContentSection } from "@/components/content-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <WebinarSection />
      <WorkshopsSection />
      <ConsultingSection />
      <ContentSection />
      <Footer />
    </>
  );
}
