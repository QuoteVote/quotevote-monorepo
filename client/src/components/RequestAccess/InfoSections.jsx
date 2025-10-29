import {
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react'
import { KeyboardArrowUp } from '@material-ui/icons'
import {
  Grid,
  Box,
  Divider,
  Typography,
  Fade,
  Button,
  IconButton,
} from '@material-ui/core'
import GuestFooter from '../GuestFooter'
import { useMobileDetection } from '../../utils/display'
import { DONATE_URL } from '../SearchContainer/SearchGuestSections'

export default function InfoSections() {
  // Section references for scrolling and animations
  const missionRef = useRef(null)
  const missionSectionRef = useRef(null)
  const textOnlyRef = useRef(null)
  const votesRef = useRef(null)
  const inviteRef = useRef(null)
  const moderationRef = useRef(null)

  // State for UI visibility and animations
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [missionVisible, setMissionVisible] = useState(false)
  const [textOnlyVisible, setTextOnlyVisible] = useState(false)
  const [votesVisible, setVotesVisible] = useState(false)
  const [inviteVisible, setInviteVisible] = useState(false)
  const [moderationVisible, setModerationVisible] = useState(false)

  const isMobileDevice = useMobileDetection()

  // Color palette (memoized)
  const colors = useMemo(() => ({
    primary: '#52b274',
    dark: '#000000',
    secondary: '#2b5d3d',
    light: '#e8f5ed',
    white: '#ffffff',
  }), [])

  // Common styles (memoized)
  const styles = useMemo(() => ({
    containerMax: { maxWidth: '1400px', marginLeft: 'auto', marginRight: 'auto' },
    sectionPadding: (mobile) => (mobile ? '2rem 2.7rem 0' : '2.5rem 6rem 0'),
    sectionPaddingCompact: (mobile) => (mobile ? '2rem 2.7rem' : '2.5rem 6rem'),
    headingStyle: (mobile) => ({
      fontSize: mobile ? '2rem' : '2.3rem',
      fontWeight: 400,
      color: colors.dark,
      margin: mobile ? '0 0 1rem' : '0 6rem 0.5rem 0',
      textAlign: mobile ? 'center' : 'left',
    }),
    titleGrid: (mobile) => ({
      display: 'flex',
      alignItems: mobile ? 'center' : 'flex-start',
      justifyContent: mobile ? 'center' : 'flex-start',
    }),
    boxStyle: (mobile) => ({
      fontSize: mobile ? '0.875rem' : '0.9375rem',
      lineHeight: 1.65,
      color: colors.dark,
      textAlign: 'justify',
    }),
    divider: (mobile) => ({
      marginTop: mobile ? '1rem' : '1.5rem',
      backgroundColor: colors.secondary,
      height: '0.05rem',
      opacity: 0.2,
    }),
    blockquote: (mobile) => ({
      fontStyle: 'italic',
      fontSize: mobile ? '1rem' : '1.125rem',
      lineHeight: 1.6,
      margin: '0.275rem 0 1rem 0',
      padding: mobile ? '1rem' : '1.25rem',
      borderLeft: `5px solid ${colors.primary}`,
      backgroundColor: colors.light,
      borderRadius: '0 10px 10px 0',
      color: colors.secondary,
      fontWeight: 500,
    }),
    paragraphBase: (mobile) => ({ fontSize: mobile ? '0.875rem' : '1rem', marginBottom: '0.75rem' }),
    donateButtonText: (mobile) => ({ fontWeight: 900, fontSize: mobile ? 16 : 24 }),
  }), [colors])

  // Animation for reveal effect
  const getAnimationStyle = (isVisible) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
    transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
  })

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#mission') {
      missionRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined') return () => { }

    // Show back-to-top after scrolling
    const onScrollForTop = () => setShowBackToTop(window.scrollY > 300)
    window.addEventListener('scroll', onScrollForTop)

    // Fallback if IntersectionObserver not supported
    if (!('IntersectionObserver' in window)) {
      return () => window.removeEventListener('scroll', onScrollForTop)
    }

    // Observe each section for reveal animation
    const mapping = new Map()
    const observedItems = [
      { ref: missionSectionRef, setter: setMissionVisible },
      { ref: textOnlyRef, setter: setTextOnlyVisible },
      { ref: votesRef, setter: setVotesVisible },
      { ref: inviteRef, setter: setInviteVisible },
      { ref: moderationRef, setter: setModerationVisible },
    ]

    const ioOptions = {
      root: null, // viewport
      rootMargin: '0px 0px -1% 0px', // trigger slightly before element fully enters viewport
      threshold: 0.03, // ~3% visible to trigger
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const setter = mapping.get(entry.target)
          if (setter) {
            setter(true)
            observer.unobserve(entry.target)
          }
        }
      })
    }, ioOptions)

    // Start observing any mounted elements and record mapping
    observedItems.forEach(({ ref, setter }) => {
      if (ref.current) {
        mapping.set(ref.current, setter)
        observer.observe(ref.current)
      }
    })

    // Cleanup
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScrollForTop)
    }

    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Back-to-top behavior
  const scrollToTop = () => {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Accessibility: skip link (visually hidden) */}
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          left: '-10000px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        Skip to main content
      </a>

      <main id="main-content" role="main" aria-label="Mission and Information" style={{ minHeight: '100vh' }}>
        <Box
          id="mission"
          ref={missionRef}
          style={{ ...styles.containerMax, padding: isMobileDevice ? '1rem 0' : '2rem 0' }}
        >
          {/* Mission */}
          <Box
            ref={missionSectionRef}
            style={{ padding: styles.sectionPadding(isMobileDevice), ...getAnimationStyle(missionVisible) }}
          >
            <Grid container spacing={isMobileDevice ? 0 : 8} alignItems="center">
              <Grid item xs={12} md={4} style={styles.titleGrid(isMobileDevice)}>
                <Typography
                  variant="h1"
                  style={{
                    ...styles.headingStyle(isMobileDevice),
                  }}
                >
                  Mission
                </Typography>
              </Grid>

              <Grid item xs={12} md={8}>
                <Box
                  style={{ ...styles.boxStyle(isMobileDevice) }}
                >
                  <blockquote style={styles.blockquote(isMobileDevice)}>
                    &quot;Quote.Vote aspires to be a commons; a catalyst for consensus, not a contest for influence.&quot;
                  </blockquote>

                  <p style={styles.paragraphBase(isMobileDevice)}>
                    Quote.Vote is a platform for genuine, in-depth discussions.
                    It exists to protect and nurture civic discourse by creating a
                    digital space where quoting and voting can flourish—without
                    manipulation, algorithms, or advertising.
                  </p>
                  <p style={styles.paragraphBase(isMobileDevice)}>
                    In today&#39;s social media environment, quick posts, outrage cycles,
                    and engagement metrics dominate our attention.
                    This place offers a structural alternative, one that values writing
                    as a tool for reflection and conversation as a form of care.
                  </p>
                  <p style={styles.paragraphBase(isMobileDevice)}>
                    This is not a startup, but rather a public utility for collective
                    thought. It is designed to slow users down, not speed them up. It
                    invites people to read carefully, reflect together, and vote
                    deliberately.
                  </p>
                </Box>
              </Grid>
            </Grid>

            <Divider style={styles.divider(isMobileDevice)} />
          </Box>

          {/* Deliberately Text-Only */}
          <Box
            ref={textOnlyRef}
            style={{ padding: styles.sectionPadding(isMobileDevice), ...getAnimationStyle(textOnlyVisible) }}
          >
            <Grid
              container
              spacing={isMobileDevice ? 0 : 8}
              alignItems="center"
            >
              <Grid item xs={12} md={4} style={styles.titleGrid(isMobileDevice)}>
                <Typography
                  variant="h1"
                  style={{
                    ...styles.headingStyle(isMobileDevice),
                  }}
                >
                  Deliberately Text-Only
                </Typography>
              </Grid>

              <Grid item xs={12} md={8}>
                <Box
                  style={{ ...styles.boxStyle(isMobileDevice) }}
                >
                  <blockquote style={styles.blockquote(isMobileDevice)}>
                    &quot;Every aspect of the platform is intentional. Every constraint is a choice rooted in values.&quot;
                  </blockquote>

                  <p
                    style={{
                      ...styles.paragraphBase(isMobileDevice),
                      fontSize: isMobileDevice ? '1rem' : '1.125rem',
                      fontWeight: 500,
                      color: colors.primary,
                    }}
                  >
                    No videos. No images. No audio.
                  </p>
                  <p style={styles.paragraphBase(isMobileDevice)}>
                    Quotes are blocks of text that open public chatrooms called Quote
                    Rooms—structured conversations anchored in clarity, and precise
                    feedback.
                  </p>
                </Box>
              </Grid>
            </Grid>

            <Divider style={styles.divider(isMobileDevice)} />
          </Box>

          {/* Votes */}
          <Box
            ref={votesRef}
            style={{ padding: styles.sectionPadding(isMobileDevice), ...getAnimationStyle(votesVisible) }}
          >
            <Grid container spacing={isMobileDevice ? 0 : 8} alignItems="center">
              <Grid item xs={12} md={4} style={styles.titleGrid(isMobileDevice)}>
                <Typography
                  variant="h1"
                  style={{ ...styles.headingStyle(isMobileDevice) }}
                >
                  Votes, Not Likes
                </Typography>
              </Grid>

              <Grid item xs={12} md={8}>
                <Box
                  style={{ ...styles.boxStyle(isMobileDevice) }}
                >
                  <p style={styles.paragraphBase(isMobileDevice)}>
                    At any time, a quote can be put to a vote that an author can
                    activate after submitting. Visitors choose to approve or disagree
                    with ideas. No likes. A quote vote can not be undone after the
                    toggle is clicked.
                  </p>
                </Box>
              </Grid>
            </Grid>

            <Divider style={styles.divider(isMobileDevice)} />
          </Box>

          {/* Invite-only */}
          <Box
            ref={inviteRef}
            style={{ padding: styles.sectionPadding(isMobileDevice), ...getAnimationStyle(inviteVisible) }}
          >
            <Grid container spacing={isMobileDevice ? 0 : 8} alignItems="center">
              <Grid item xs={12} md={4} style={styles.titleGrid(isMobileDevice)}>
                <Typography
                  variant="h1"
                  style={{ ...styles.headingStyle(isMobileDevice) }}
                >
                  Invite-Only Growth
                </Typography>
              </Grid>

              <Grid item xs={12} md={8}>
                <Box
                  style={{ ...styles.boxStyle(isMobileDevice) }}
                >
                  <p style={styles.paragraphBase(isMobileDevice)}>
                    Posting and quoting are gated through a vouching system. Each
                    contributor takes responsibility for who they invite. The growth
                    rate is controlled to protect community culture and avoid the
                    pitfalls of viral scale.
                  </p>
                  <blockquote style={styles.blockquote(isMobileDevice)}>
                    &quot;Quoting and voting are available to all, but the power to publish
                    is earned through trust and intent.&quot;
                  </blockquote>
                </Box>
              </Grid>
            </Grid>

            <Divider style={styles.divider(isMobileDevice)} />
          </Box>
          {/* Moderation */}
          <Box
            ref={moderationRef}
            style={{ padding: styles.sectionPaddingCompact(isMobileDevice), ...getAnimationStyle(moderationVisible) }}
          >
            <Grid container spacing={isMobileDevice ? 0 : 8} alignItems="center">
              <Grid item xs={12} md={4} style={styles.titleGrid(isMobileDevice)}>
                <Typography
                  variant="h1"
                  style={{ ...styles.headingStyle(isMobileDevice) }}
                >
                  Civic Moderation by Reputation
                </Typography>
              </Grid>

              <Grid item xs={12} md={8}>
                <Box
                  style={{ ...styles.boxStyle(isMobileDevice) }}
                >
                  <p style={styles.paragraphBase(isMobileDevice)}>
                    Moderation isn&#39;t algorithmic or top-down. It&#39;s shared. Each use will
                    be a crucial part of the moderation system, and when invites are
                    shared with others, the referred user&#39;s behavior will impact
                    reputation weighting. A user&#39;s invite tree grows to define the type
                    of user they are following code of conducts and terms of service;
                    downstream behavior reflects upstream.
                  </p>
                  <p style={styles.paragraphBase(isMobileDevice)}>
                    Misconduct is a community responsibility. Every user is a moderator.
                    Officially appointed moderators are compensated by the non-for
                    profit entity that exchanges their time for monetary reward. All
                    community members are facilitators tasked with protecting clarity
                    about what is tolerated and what is not.
                  </p>
                </Box>
              </Grid>
            </Grid>

            <Divider style={styles.divider(isMobileDevice)} />
          </Box>
        </Box>

        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={isMobileDevice ? 2 : 4}
        >
          <section style={{ margin: '3rem 1rem 3rem 1rem' }}>
            <Grid container spacing={4} alignItems="center" justifyContent="center">
              <Grid item xs={12}>
                <Grid
                  container
                  spacing={0}
                  alignItems="center"
                  justifyContent="center"
                  direction="row"
                >
                  <Grid
                    item
                    xs={3}
                    style={{
                      display: 'flex',
                      justifyContent: 'right',
                      marginRight: -70,
                      marginLeft: 75,
                    }}
                  >
                    <img src="/assets/donate-emoji-1.svg" alt="Donate Emoji 1" />
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant="body1"
                      style={{
                        textAlign: 'center',
                        fontWeight: 500,
                        marginBottom: 16,
                      }}
                    >
                      Quote.Vote is non-profit, open source, and donation-supported.
                    </Typography>
                    <Typography
                      variant="body1"
                      style={{
                        textAlign: 'center',
                        fontWeight: 500,
                        marginBottom: 16,
                      }}
                    >
                      Our only funding comes from people like you.
                    </Typography>

                    <Button
                      variant="contained"
                      style={{
                        fontWeight: 500,
                        fontSize: 18,
                      }}
                      color="secondary"
                      onClick={() => {
                        window.location.href = DONATE_URL
                      }}
                      size={isMobileDevice ? 'small' : 'large'}
                    >
                      Please Donate
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    style={{
                      display: 'flex',
                      justifyContent: 'left',
                      marginLeft: -30,
                    }}
                  >
                    <img src="/assets/donate-emoji-2.svg" alt="Donate Emoji 1" />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </section>

          <Grid item xs={12}>
            <img
              src="/assets/group-image.svg"
              alt="Group"
              style={{ width: '100%', height: 'auto' }}
            />
          </Grid>
        </Grid>

        <div
          style={{
            marginTop: '2rem',
            maxWidth: '80%',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <GuestFooter />
        </div>
      </main>

      {/* Back to Top floating button */}
      <Fade in={showBackToTop}>
        <Box
          style={{
            position: 'fixed',
            bottom: isMobileDevice ? 20 : 40,
            right: isMobileDevice ? 20 : 40,
            zIndex: 1000,
          }}
        >
          <IconButton
            onClick={scrollToTop}
            style={{
              backgroundColor: colors.primary,
              color: colors.white,
              width: '56px',
              height: '56px',
              boxShadow: '0 6px 20px rgba(82, 178, 116, 0.4)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
            aria-label="Back to top"
          >
            <KeyboardArrowUp style={{ fontSize: '1.75rem' }} />
          </IconButton>
        </Box>
      </Fade>
    </>
  )
}
