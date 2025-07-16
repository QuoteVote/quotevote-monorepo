import { Button, Grid, Typography } from '@material-ui/core'
import { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { REQUEST_USER_ACCESS_MUTATION } from '../../graphql/mutations'

export const DONATE_URL = 'mailto:volunteer@quote.vote'

export default function SearchGuestSections() {
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [requestUserAccess] = useMutation(REQUEST_USER_ACCESS_MUTATION)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')

    // Email validation pattern (same as RequestAccessPage)
    const pattern = new RegExp(
      /^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i,
    )
    const isValidEmail = pattern.test(email)

    if (!isValidEmail) {
      setErrorMessage('Please enter a valid email address')
      setIsSubmitting(false)
      return
    }

    try {
      const requestUserAccessInput = {
        email: email,
      }
      await requestUserAccess({ variables: { requestUserAccessInput } })
      setSuccessMessage(
        "Thank you for requesting access! We'll be in touch soon.",
      )
      setEmail('')
    } catch (error) {
      if (error.message.includes('Email already exists')) {
        setErrorMessage('This email is already registered.')
      } else {
        setErrorMessage('Failed to submit request. Please try again.')
      }
      console.error('Request access error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* See what others talking about */}
      <section
        style={{
          width: '100%',
        }}
      >
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12}>
            <Typography
              variant="h4"
              style={{
                fontWeight: 700,
                marginTop: '2rem',
              }}
            >
              <span style={{ color: '#2ecc71' }}>See what people </span>{' '}
              <span style={{ color: '#111' }}>are talking about</span>
            </Typography>
          </Grid>
          <Grid
            item
            style={{
              maxWidth: 400,
            }}
          >
            <Typography
              variant="caption"
              style={{
                color: '#222',
                fontSize: 16,
                margin: '0 0 24px 18px',
                padding: 0,
                lineHeight: 1.7,
              }}
            >
              For a project as small as your household, or around the world,
              Quote Vote can host the next conversation in your life, and knock
              it out of the park.
            </Typography>
          </Grid>
        </Grid>

        <Grid
          container
          direction={{ xs: 'column', lg: 'row' }}
          spacing={2}
          alignContent="center"
          justifyContent="center"
        >
          <Grid item xs={12} md={6}>
            <img
              src={process.env.PUBLIC_URL + '/assets/votingPopUp.svg'}
              alt="Voting Popup"
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <img
              src={process.env.PUBLIC_URL + '/assets/voting-popup-2.png'}
              alt="Voting Popup 2"
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </Grid>
        </Grid>
      </section>

      {/* At any time put your vote in */}
      <section
        style={{
          width: '100%',
          marginTop: '3rem',
        }}
      >
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12}>
            <Typography
              variant="h4"
              style={{
                fontWeight: 700,
                marginTop: '2rem',
              }}
            >
              <span style={{ color: '#2ecc71' }}>At any time</span>{' '}
              <span style={{ color: '#111' }}>put your Quote to Vote</span>
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <img
              src={process.env.PUBLIC_URL + '/assets/atAnyTime.svg'}
              alt="At Any Time"
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </Grid>
        </Grid>
      </section>

      {/* Track Conversations */}
      <section
        style={{
          width: '100%',
          marginTop: '3rem',
        }}
      >
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12}>
            <Typography
              variant="h4"
              style={{
                fontWeight: 700,
                marginTop: '2rem',
              }}
            >
              <span style={{ color: '#2ecc71' }}>Track </span>{' '}
              <span style={{ color: '#111' }}>Conversations</span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <img
              src={process.env.PUBLIC_URL + '/assets/TrackConversation.svg'}
              alt="Track Conversations"
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </Grid>
        </Grid>
      </section>

      {/* Request Invite */}
      <section
        style={{
          width: '100%',
          marginTop: '3rem',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            marginTop: 32,
          }}
        >
          <Button
            variant="contained"
            style={{
              background: '#52b274',
              color: '#fff',
              fontWeight: 600,
              fontSize: 16,
              borderRadius: 8,
              textTransform: 'none',
              boxShadow: '0 2px 8px rgba(46,204,113,0.08)',
            }}
            size="small"
            onClick={() => {
              window.location.href = '/auth/request-access'
            }}
          >
            Request Invite
          </Button>
          <a
            href="/auth/request-access#mission"
            style={{
              color: '#52b274',
              fontWeight: 500,
              fontSize: 18,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              marginLeft: 16,
            }}
          >
            Read our mission
            <span style={{ fontSize: 28, marginLeft: 6 }}>»</span>
          </a>
        </div>
      </section>

      {/* Discover without bias */}
      <section
        style={{
          width: '100%',
          marginTop: '3rem',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Grid
          container
          spacing={6}
          alignItems="flex-start"
          justifyContent="center"
        >
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              style={{
                fontWeight: 700,
                marginTop: '1.5rem',
                marginBottom: '1rem',
              }}
            >
              <span style={{ color: '#2ecc71' }}>Discover</span>{' '}
              <span style={{ color: '#111' }}>without bias</span>
            </Typography>
            <Typography
              variant="body2"
              style={{
                color: '#222',
                fontSize: 16,
                fontWeight: 700,
                marginBottom: '.5rem',
              }}
            >
              All conversations are searchable without ads, discovered through
              exploration, not algorithms.
            </Typography>
            <Typography
              variant="body2"
              style={{
                color: '#222',
                fontSize: 16,
              }}
            >
              Filter by keyword, only show from those you follow, sort by most
              interactions, or select a specific date range. Find what people
              are talking about now, or during a historical event in the past.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              style={{
                fontWeight: 700,
                marginTop: '1.5rem',
                marginBottom: '1rem',
              }}
            >
              <span style={{ color: '#2ecc71' }}>Share </span>{' '}
              <span style={{ color: '#111' }}>your ideas or plans</span>
            </Typography>
            <Typography
              variant="body2"
              style={{
                color: '#222',
                fontSize: 16,
                fontWeight: 700,
                marginBottom: '.5rem',
              }}
            >
              Post to your social circle and beyond.{' '}
            </Typography>
            <Typography
              variant="body2"
              style={{
                color: '#222',
                fontSize: 16,
              }}
            >
              Engage in meaningful, respectful discussions, that solve your
              problem, challenge your perspectives, or create a bit of whimsical
              fun..
            </Typography>
          </Grid>
        </Grid>
      </section>

      {/* Donate to the cause */}
      <section
        style={{
          width: '100%',
          marginTop: '3rem',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '3rem',
        }}
      >
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12}>
            <Typography
              variant="h4"
              style={{
                fontWeight: 700,
              }}
            >
              <span style={{ color: '#111' }}>Donate</span>{' '}
              <span style={{ color: '#2ecc71' }}>what you can</span>
            </Typography>
          </Grid>
        </Grid>

        <Grid container justifyContent="flex-start" direction="row">
          <Grid
            item
            xs={6}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Button
              style={{
                background: '#111',
                color: '#2ecc71',
                border: '2px solid #2ecc71',
                borderRadius: 8,
                fontWeight: 500,
                fontSize: 16,
                textTransform: 'none',
                boxShadow: '0 2px 0 #2ecc71',
                padding: '8px 24px 8px 20px',
                display: 'flex',
                alignItems: 'center',
              }}
              onClick={() => {
                window.location.href = '/auth/request-access'
              }}
            >
              Request Invite
              <span style={{ fontSize: 24, marginLeft: 12 }}>{'»'}</span>
            </Button>

            <Button
              style={{
                background: '#fff',
                color: '#2ecc71',
                border: '2px solid #2ecc71',
                borderRadius: 8,
                fontWeight: 500,
                fontSize: 16,
                textTransform: 'none',
                boxShadow: '3px 3px 0 #2ecc71',
                padding: '12px 36px',
                marginTop: 24,
                marginLeft: 0,
                marginRight: 0,
                display: 'block',
              }}
              onClick={() => {
                window.location.href = DONATE_URL
              }}
            >
              Donate Today
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant="body2"
              style={{
                color: '#222',
                fontSize: 16,
                fontWeight: 700,
                textAlign: 'left',
              }}
            >
              We have raised over $500 in donations.
            </Typography>
            <Typography
              variant="body2"
              style={{
                color: '#222',
                fontSize: 16,
                textAlign: 'left',
              }}
            >
              If you choose to use or fork our project, kindly consider making a
              contribute.
            </Typography>
            <Typography
              variant="body2"
              style={{
                color: '#222',
                fontSize: 16,
                textAlign: 'left',
              }}
            >
              Join us in creating a truly open and equal community where civil
              conversation is the main objective.
            </Typography>
          </Grid>
        </Grid>
      </section>

      <section style={{ marginTop: '3rem' }}>
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
                  marginRight: -20,
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
                    textAlign: 'left',
                    fontWeight: 500,
                    marginBottom: 16,
                  }}
                >
                  Quote.Vote is non-profit, open source, and donation-supported.
                </Typography>
                <Typography
                  variant="body1"
                  style={{
                    textAlign: 'left',
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
                    fontSize: 24,
                  }}
                  color="secondary"
                  onClick={() => {  
                    window.location.href = DONATE_URL
                  }}
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
                  marginLeft: -20,
                }}
              >
                <img src="/assets/donate-emoji-2.svg" alt="Donate Emoji 1" />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </section>

      <section
        style={{
          width: '100%',
          marginTop: '3rem',
          padding: '3rem 0',
        }}
      >
        <Typography
          variant="h4"
          style={{
            fontWeight: 700,
            marginTop: '1.5rem',
            marginBottom: '1rem',
          }}
        >
          Please Be <span style={{ color: '#16b86a' }}>in Touch!</span>
        </Typography>
        <Typography
          variant="body1"
          style={{
            textAlign: 'left',
            maxWidth: 500,
            margin: '0 auto 2.5rem auto',
            color: '#222',
          }}
        >
          Our team is made up of volunteer contributors from around the World.
          Sign up for email newsletter. We will send updates as we make updates.{' '}
          <span style={{ fontWeight: 700 }}>
            Your contributions, as simple as a subscribe or as great as a
            donation, everything is much appreciated.
          </span>
        </Typography>
        <form
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: 600,
            margin: '0 auto',
            background: '#fff',
            borderRadius: 20,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            padding: 0,
            border: '2px solid #1111',
          }}
          onSubmit={handleSubmit}
        >
          <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: 18,
                padding: '20px 24px',
                borderRadius: 20,
                background: 'transparent',
              }}
            />
            <Button
              type="submit"
              variant="contained"
              style={{
                background: '#16b86a',
                color: '#fff',
                fontWeight: 500,
                fontSize: 18,
                borderRadius: 16,
                padding: '8px 36px',
                margin: 8,
                textTransform: 'none',
                boxShadow: '0 2px 8px rgba(22,184,106,0.12)',
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Contact'}
            </Button>
          </div>
          {errorMessage && (
            <Typography
              variant="body2"
              style={{
                color: '#f44336',
                fontSize: 14,
                marginTop: 8,
                textAlign: 'center',
                padding: '0 24px 16px 24px',
              }}
            >
              {errorMessage}
            </Typography>
          )}
          {successMessage && (
            <Typography
              variant="body2"
              style={{
                color: '#4caf50',
                fontSize: 14,
                marginTop: 8,
                textAlign: 'center',
                padding: '0 24px 16px 24px',
              }}
            >
              {successMessage}
            </Typography>
          )}
        </form>
      </section>

      <Grid item xs={12}>
        <img
          src="/assets/group-image.svg"
          alt="Group Image"
          style={{ width: '100%', height: 'auto' }}
        />
      </Grid>
    </>
  )
}
