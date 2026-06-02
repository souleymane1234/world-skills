import { useEffect, useRef, useState } from 'react'
import './HeroVideo.css'

const DEFAULT_SRC = '/video.mp4'
const DEFAULT_SUBTITLE = 'Olympiades des métiers'
const DEFAULT_TITLE = 'WorldSkills Côte d\'Ivoire'

type HeroVideoProps = {
  src?: string
  poster?: string
  subtitle?: string
  title?: string
  /** Lecture avec controles (video de presentation d'edition) */
  controls?: boolean
  /** Active le son en haut de page, puis le coupe au scroll */
  soundOnTopMuteOnScroll?: boolean
}

export function HeroVideo({
  src = DEFAULT_SRC,
  poster,
  subtitle = DEFAULT_SUBTITLE,
  title = DEFAULT_TITLE,
  controls = false,
  soundOnTopMuteOnScroll = false,
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const shouldMute =
    controls
      ? false
      : soundOnTopMuteOnScroll
        ? isScrolled || !hasUserInteracted
        : true

  useEffect(() => {
    if (!soundOnTopMuteOnScroll || controls) return

    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [soundOnTopMuteOnScroll, controls])

  useEffect(() => {
    if (!soundOnTopMuteOnScroll || controls) return

    const markInteracted = () => setHasUserInteracted(true)
    window.addEventListener('pointerdown', markInteracted, { once: true })
    window.addEventListener('keydown', markInteracted, { once: true })
    window.addEventListener('touchstart', markInteracted, { once: true })
    return () => {
      window.removeEventListener('pointerdown', markInteracted)
      window.removeEventListener('keydown', markInteracted)
      window.removeEventListener('touchstart', markInteracted)
    }
  }, [soundOnTopMuteOnScroll, controls])

  useEffect(() => {
    const video = videoRef.current
    if (!video || controls) return
    const tryPlay = async () => {
      try {
        await video.play()
      } catch {
        // Ignore autoplay rejection; muted fallback will keep a stable UI.
      }
    }
    void tryPlay()
  }, [shouldMute, controls, src])

  return (
    <div className={`site-hero-video${controls ? ' site-hero-video--controls' : ''}`}>
      <video
        ref={videoRef}
        className="site-hero-video__media"
        src={src}
        poster={poster}
        autoPlay={!controls}
        muted={shouldMute}
        loop={!controls}
        controls={controls}
        playsInline
        preload="metadata"
        aria-label="Vidéo de présentation WorldSkills Côte d'Ivoire"
      />
      <div className="site-hero-video__overlay">
        <p className="site-hero-video__subtitle">{subtitle}</p>
        <h1 className="site-hero-video__title">{title}</h1>
      </div>
    </div>
  )
}
