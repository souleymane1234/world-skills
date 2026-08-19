import { useEffect, type ReactNode } from 'react'
import { HeroVideo } from './components/HeroVideo'
import { AboutSection } from './components/AboutSection'
import { InscriptionsSection } from './components/InscriptionsSection'
import { StatsBanner } from './components/StatsBanner'
import { SkillsPreview } from './components/SkillsPreview'
import { AgendaSection } from './components/AgendaSection'
import { Navbar } from './components/Navbar'
import { ActualitesAccess } from './components/ActualitesAccess'
import { ActualiteDetailPage } from './components/ActualiteDetailPage'
import { ActualitesPage } from './components/ActualitesPage'
import { ConcoursPage } from './components/ConcoursPage'
import { CandidateShowroomPage } from './components/CandidateShowroomPage'
import { VotePage } from './components/VotePage'
import { PartenariatPage } from './components/PartenariatPage'
import { PartnersTrustCarousel } from './components/PartnersTrustCarousel'
import { SponsoringSection } from './components/SponsoringSection'
// import { AcademyPromo } from './components/AcademyPromo'
import { SectionBridge } from './components/SectionBridge'
import { ConnexionPage } from './components/ConnexionPage'
import { CandidaturePage } from './components/CandidaturePage'
import { ExpertPage } from './components/ExpertPage'
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

  useEffect(() => {
    if (pathname === '/' && window.location.hash === '') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }
  }, [pathname])

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

  if (pathname.startsWith('/showroom/')) {
    return (
      <PageShell>
        <CandidateShowroomPage />
      </PageShell>
    )
  }

  if (pathname.startsWith('/vote/')) {
    return (
      <PageShell>
        <VotePage />
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
    window.location.replace('/competition')
    return null
  }

  if (pathname.startsWith('/contact')) {
    window.location.replace('/partenariat#contact')
    return null
  }

  if (pathname.startsWith('/partenariat')) {
    return (
      <PageShell>
        <PartenariatPage />
      </PageShell>
    )
  }

  if (
    pathname.startsWith('/inscription-candidat') ||
    pathname.startsWith('/candidature')
  ) {
    return (
      <PageShell>
        <CandidaturePage />
      </PageShell>
    )
  }

  if (pathname.startsWith('/inscription-expert')) {
    return (
      <PageShell>
        <ExpertPage />
      </PageShell>
    )
  }

  if (pathname.startsWith('/connexion') || pathname.startsWith('/inscription')) {
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
        <AboutSection />
        <InscriptionsSection />
        <SectionBridge variant="ribbon" />
        <StatsBanner />
        <SectionBridge variant="wave" />
        <SkillsPreview />
        <SectionBridge variant="wave" />
        <AgendaSection />
        <SectionBridge variant="wave" />
      </section>

      <SectionBridge variant="wave" />
      <ActualitesAccess />
      <SectionBridge variant="ribbon" />
      <SponsoringSection />
      <SectionBridge variant="wave" />
      <PartnersTrustCarousel />
      <SectionBridge variant="wave" />
      {/* <AcademyPromo /> */}
      <SectionBridge variant="wave" />

      <div className="ticks" />
      <Footer />
    </>
  )
}

export default App
