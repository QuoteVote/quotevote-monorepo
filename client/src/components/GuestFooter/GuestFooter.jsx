import { Grid, Typography, useTheme, useMediaQuery } from '@material-ui/core'
import { GitHub } from '@material-ui/icons'

const GuestFooter = ({ isRequestAccess = false }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const currentYear = new Date().getFullYear()
  const isDark = theme.palette.mode === 'dark'

  // Brand colors from logo - adapted for dark mode
  const BRAND_COLORS = {
    teal: isDark ? '#66BB6A' : '#2AE6B2',
    aqua: isDark ? '#29B6F6' : '#27C4E1',
    cyan: isDark ? '#64B5F6' : '#178BE1',
    navy: isDark ? '#EDEDED' : '#0A2342', // Pure white/off-white for dark mode text
    overlay: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(14, 17, 22, 0.06)'
  }

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      style={{
        width: '100%',
        margin: 0,
        marginTop: 60,
        marginBottom: 20,
        minHeight: 48,
        padding: isMobile ? '20px 16px' : '24px 16px',
        borderTop: `1px solid ${theme.palette.divider}`,
        // Use a subtle background in dark mode to distinguish the footer
        backgroundColor: isRequestAccess ? theme.palette.background.default : (isDark ? 'rgba(255, 255, 255, 0.02)' : 'transparent'),
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 20 : 0,
        textAlign: isMobile ? 'center' : 'left'
      }}
      className="guest-footer"
    >
      {/* Left Section - Brand & Copyright */}
      <Grid item style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Typography
          variant="body1"
          style={{
            fontSize: 'clamp(14px, 4vw, 18px)',
            fontWeight: 400,
            lineHeight: 1.4,
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 4,
            color: BRAND_COLORS.navy
          }}
        >
          Quote.Vote made with
          <span style={{
            color: '#e25555',
            fontSize: 'clamp(16px, 4.5vw, 20px)',
            margin: '0 4px'
          }}>❤️</span>
          on Earth
        </Typography>

        {/* Copyright */}
        <Typography
          variant="caption"
          style={{
            color: BRAND_COLORS.navy,
            fontSize: '12px',
            fontWeight: 400,
            opacity: 0.8,
            marginLeft: 0,
            textAlign: isMobile ? 'center' : 'left'
          }}
        >
          © {currentYear} Quote.Vote. All rights reserved.
        </Typography>
      </Grid>

      {/* Right Section - Links */}
      <Grid
        item
        style={{
          display: 'flex',
          gap: isMobile ? 'clamp(12px, 3vw, 24px)' : 'clamp(16px, 4vw, 36px)',
          justifyContent: 'center',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
      >
        {/* Request Invite Button*/}
        <a
          href="/auth/request-access"
          style={{
            color: BRAND_COLORS.navy,
            fontWeight: 500,
            fontSize: 'clamp(14px, 3.5vw, 16px)',
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            transition: 'all 0.2s ease',
            border: `1px solid ${BRAND_COLORS.overlay}`,
            background: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = BRAND_COLORS.teal;
            e.target.style.color = BRAND_COLORS.teal;
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = BRAND_COLORS.overlay;
            e.target.style.color = BRAND_COLORS.navy;
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Request Invite
        </a>

        {/* Donate Button */}
        <a
          href="mailto:admin@quote.vote"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: BRAND_COLORS.navy,
            fontWeight: 500,
            fontSize: 'clamp(14px, 3.5vw, 16px)',
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            transition: 'all 0.2s ease',
            border: `1px solid ${BRAND_COLORS.overlay}`,
            background: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = BRAND_COLORS.aqua;
            e.target.style.color = BRAND_COLORS.aqua;
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = BRAND_COLORS.overlay;
            e.target.style.color = BRAND_COLORS.navy;
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Donate
        </a>

        {/* GitHub Button */}
        <a
          href="https://github.com/QuoteVote/quotevote-monorepo"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: BRAND_COLORS.navy,
            fontWeight: 500,
            fontSize: 'clamp(14px, 3.5vw, 16px)',
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            transition: 'all 0.2s ease',
            border: `1px solid ${BRAND_COLORS.overlay}`,
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = BRAND_COLORS.cyan;
            e.target.style.color = BRAND_COLORS.cyan;
            e.target.style.transform = 'translateY(-1px)';
            // Change GitHub icon color on hover
            const icon = e.target.querySelector('svg');
            if (icon) {
              icon.style.color = BRAND_COLORS.cyan;
              icon.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = BRAND_COLORS.overlay;
            e.target.style.color = BRAND_COLORS.navy;
            e.target.style.transform = 'translateY(0)';
            // Reset GitHub icon
            const icon = e.target.querySelector('svg');
            if (icon) {
              icon.style.color = BRAND_COLORS.navy;
              icon.style.transform = 'scale(1)';
            }
          }}
        >
          <GitHub
            style={{
              fontSize: '16px',
              color: BRAND_COLORS.navy,
              transition: 'all 0.2s ease'
            }}
          />
          <span>GitHub</span>
        </a>
      </Grid>
    </Grid>
  )
}

export default GuestFooter