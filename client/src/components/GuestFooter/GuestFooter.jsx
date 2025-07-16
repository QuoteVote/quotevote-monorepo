import { Grid, Typography, useTheme } from '@material-ui/core'

const GuestFooter = ({isRequestAccess = false}) => {

  const theme = useTheme()
  
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      style={{
        width: '100%',
        margin: 0,
        marginTop: 40,
        minHeight: 48,
        padding: '0 16px',
      }}
      className="guest-footer"
    >
      <Grid item className="footer-text">
        <Typography 
          variant="body1" 
          style={{ 
            fontSize: 'clamp(14px, 4vw, 18px)', 
            fontWeight: 400,
            lineHeight: 1.4
          }}
          color={isRequestAccess ? 'primary' : 'secondary'} 
        >
          Quote.Vote&nbsp; made with <span style={{ color: 'red', fontSize: 'clamp(16px, 4.5vw, 20px)' }}>❤️</span> on Earth
        </Typography>
      </Grid>
      <Grid 
        item 
        className="footer-links"
        style={{ 
          display: 'flex', 
          gap: 'clamp(16px, 4vw, 36px)', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}
      >
        <a
          href="/auth/request-access"
          style={{ 
            color: isRequestAccess ? theme.palette.primary.main : theme.palette.secondary.main, 
            fontWeight: 400, 
            fontSize: 'clamp(14px, 3.5vw, 18px)', 
            textDecoration: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          Request Invite
        </a>
        <a 
                          href="mailto:volunteer@quote.vote" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ 
            color: isRequestAccess ? theme.palette.primary.main : theme.palette.secondary.main, 
            fontWeight: 400, 
            fontSize: 'clamp(14px, 3.5vw, 18px)', 
            textDecoration: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          Donate
        </a>
        <a 
          href="https://github.com/QuoteVote/quotevote-monorepo" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ 
            color: isRequestAccess ? theme.palette.primary.main : theme.palette.secondary.main, 
            fontWeight: 400, 
            fontSize: 'clamp(14px, 3.5vw, 18px)', 
            textDecoration: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          GitHub
        </a>
      </Grid>
    </Grid>
  )
}

export default GuestFooter 