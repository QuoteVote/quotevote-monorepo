const requestAccessStyles = (theme) => ({
  // Main container with gradient background
  panelContainer: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    padding: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(3),
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },

  // Glassmorphism breadcrumb
  breadcrumb: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    borderRadius: 12,
    padding: theme.spacing(1.5, 2),
    marginBottom: theme.spacing(3),
    border: '1px solid rgba(255, 255, 255, 0.2)',
    '& a': {
      color: 'white',
      transition: 'all 0.3s ease',
      '&:hover': {
        color: '#ffd700',
      },
    },
    '& .MuiTypography-root': {
      color: 'white',
      fontWeight: 600,
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1, 1.5),
      marginBottom: theme.spacing(2),
    },
  },

  // Modern header with gradient text
  panelHeader: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '2.5rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: theme.spacing(4),
    textShadow: '0 2px 10px rgba(0,0,0,0.1)',
    letterSpacing: '-0.5px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.75rem',
      marginBottom: theme.spacing(2),
    },
  },

  // Enhanced tabs with glassmorphism
  tabsContainer: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 16,
    padding: theme.spacing(1),
    marginBottom: theme.spacing(3),
    border: '1px solid rgba(255, 255, 255, 0.2)',
    '& .MuiTabs-indicator': {
      backgroundColor: '#ffd700',
      height: 3,
      borderRadius: 3,
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(2),
      borderRadius: 12,
    },
  },

  tab: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: 600,
    fontSize: '0.95rem',
    textTransform: 'none',
    transition: 'all 0.3s ease',
    '&.Mui-selected': {
      color: 'white',
    },
    '&:hover': {
      color: 'white',
      background: 'rgba(255, 255, 255, 0.1)',
    },
  },

  tabPanel: {
    paddingTop: theme.spacing(3),
    animation: '$fadeIn 0.5s ease-in',
    [theme.breakpoints.down('sm')]: {
      paddingTop: theme.spacing(2),
    },
  },

  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(10px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },

  // Premium card design
  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: 20,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: 16,
    },
  },

  cardHeader: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '1.5rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: theme.spacing(2),
    letterSpacing: '-0.3px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.25rem',
      marginBottom: theme.spacing(1.5),
    },
  },

  // Modern search input
  filterInput: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 12,
      background: 'rgba(103, 126, 234, 0.05)',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: 'rgba(103, 126, 234, 0.1)',
      },
      '&.Mui-focused': {
        background: 'white',
        boxShadow: '0 4px 12px rgba(103, 126, 234, 0.2)',
      },
    },
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: theme.spacing(1.5),
    },
  },

  // Enhanced table
  tableContainer: {
    maxHeight: 600,
    overflowX: 'auto',
    overflowY: 'auto',
    borderRadius: 12,
    '&::-webkit-scrollbar': {
      width: 8,
      height: 8,
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: 10,
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: 10,
      '&:hover': {
        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
      },
    },
    [theme.breakpoints.down('sm')]: {
      maxHeight: 'calc(100vh - 350px)',
    },
  },

  columnHeader: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#667eea',
    background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%)',
    borderBottom: '2px solid #667eea',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem',
      padding: theme.spacing(1, 0.5),
    },
  },

  mobileTableCell: {
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1, 0.5),
      fontSize: '0.85rem',
      maxWidth: 150,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },

  // Premium status badges
  pendingStatus: {
    background: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)',
    color: 'white',
    padding: '6px 16px',
    borderRadius: 20,
    fontWeight: 600,
    fontSize: '0.85rem',
    textTransform: 'capitalize',
    boxShadow: '0 4px 12px rgba(255, 216, 155, 0.3)',
    cursor: 'default',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 16px rgba(255, 216, 155, 0.4)',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '4px 12px',
      fontSize: '0.75rem',
    },
  },

  acceptedStatus: {
    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    color: 'white',
    padding: '6px 16px',
    borderRadius: 20,
    fontWeight: 600,
    fontSize: '0.85rem',
    textTransform: 'capitalize',
    boxShadow: '0 4px 12px rgba(56, 239, 125, 0.3)',
    cursor: 'default',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 16px rgba(56, 239, 125, 0.4)',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '4px 12px',
      fontSize: '0.75rem',
    },
  },

  declinedStatus: {
    background: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
    color: 'white',
    padding: '6px 16px',
    borderRadius: 20,
    fontWeight: 600,
    fontSize: '0.85rem',
    textTransform: 'capitalize',
    boxShadow: '0 4px 12px rgba(235, 51, 73, 0.3)',
    cursor: 'default',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 16px rgba(235, 51, 73, 0.4)',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '4px 12px',
      fontSize: '0.75rem',
    },
  },

  // Modern action buttons
  button: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '8px 20px',
    borderRadius: 12,
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    transition: 'all 0.3s ease',
    border: 'none',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '6px 14px',
      fontSize: '0.8rem',
      borderRadius: 10,
    },
  },

  // Featured row highlight
  featuredRow: {
    background: 'linear-gradient(90deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)',
    borderLeft: '4px solid #ffd700',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(90deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.08) 100%)',
    },
  },

  // Select dropdown
  slotSelect: {
    minWidth: 100,
    '& .MuiOutlinedInput-root': {
      borderRadius: 10,
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
      },
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: 70,
    },
  },

  // Chart styling
  graphText: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 500,
    color: '#333',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.95rem',
    },
  },

  stickyHeader: {
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
})

export default requestAccessStyles
