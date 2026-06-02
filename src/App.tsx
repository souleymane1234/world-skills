import type { ReactNode } from 'react'
import { HeroVideo } from './components/HeroVideo'
import { AboutSection } from './components/AboutSection'
import { StatsBanner } from './components/StatsBanner'
import { SkillsPreview } from './components/SkillsPreview'
import { Navbar } from './components/Navbar'
import { ActualitesAccess } from './components/ActualitesAccess'
import { ActualiteDetailPage } from './components/ActualiteDetailPage'
import { ActualitesPage } from './components/ActualitesPage'
import { ConcoursPage } from './components/ConcoursPage'
import { MetiersPage } from './components/MetiersPage'
import { PartenariatPage } from './components/PartenariatPage'
import { PartnersTrustCarousel } from './components/PartnersTrustCarousel'
import { AcademyPromo } from './components/AcademyPromo'
import { PromoBanner } from './components/PromoBanner'
import { SectionBridge } from './components/SectionBridge'
import { ContactSection } from './components/ContactSection'
import { ConnexionPage } from './components/ConnexionPage'
import { ProfilPage } from './components/ProfilPage'
import { Footer } from './components/Footer'
import './App.css'

function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <div className="ticks" />
      <Footer />
    </>
  )
}

function App() {
  const pathname = window.location.pathname

  if (/^\/actualites\/[^/]+\/?$/.test(pathname)) {
    return (
      <PageShell>
        <ActualiteDetailPage />
      </PageShell>
    )
  }

  if (pathname === '/actualites' || pathname === '/actualites/') {
    return (
      <PageShell>
        <ActualitesPage />
      </PageShell>
    )
  }

  if (
    pathname.startsWith('/competition') ||
    pathname.startsWith('/concours')
  ) {
    return (
      <PageShell>
        <ConcoursPage />
      </PageShell>
    )
  }

  if (pathname.startsWith('/metiers')) {
    return (
      <PageShell>
        <MetiersPage />
      </PageShell>
    )
  }

  if (pathname.startsWith('/partenariat')) {
    return (
      <PageShell>
        <PartenariatPage />
      </PageShell>
    )
  }

  if (pathname.startsWith('/contact')) {
    return (
      <PageShell>
        <ContactSection />
      </PageShell>
    )
  }

  if (pathname.startsWith('/connexion')) {
    return <ConnexionPage />
  }

  if (pathname.startsWith('/profil')) {
    return (
      <PageShell>
        <ProfilPage />
      </PageShell>
    )
  }

  return (
    <>
      <Navbar />
      <section id="accueil">
        <HeroVideo soundOnTopMuteOnScroll />
        <PromoBanner />
        <SectionBridge variant="ribbon" />
        <AboutSection />
        <StatsBanner />
        <SectionBridge variant="wave" />
        <SkillsPreview />
        <SectionBridge variant="wave" />
      </section>

      <SectionBridge variant="wave" />
      <ActualitesAccess />
      <SectionBridge variant="ribbon" />
      <PartnersTrustCarousel />
      <SectionBridge variant="wave" />
      <AcademyPromo />
      <SectionBridge variant="wave" />

      <div className="ticks" />
      <Footer />
    </>
  )
}

export default App
