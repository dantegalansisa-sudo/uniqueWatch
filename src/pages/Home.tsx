import { useIsDesktop } from '../lib/hooks';
import { HeroDesktop, HeroMobile } from '../sections/Hero';
import Edit from '../sections/Edit';
import { Concierge, Editorial, Faq, HowItWorks, Marquee, SellCta, Standard } from '../sections/HomeSections';

export default function Home() {
  const desktop = useIsDesktop();
  return (
    <>
      {desktop ? <HeroDesktop /> : <HeroMobile />}
      <Marquee />
      <Edit />
      <Editorial />
      <Standard />
      <HowItWorks />
      <SellCta />
      <Faq />
      <Concierge />
    </>
  );
}
