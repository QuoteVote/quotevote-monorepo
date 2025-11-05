const requestAccessStyles = (theme) => ({
  // Main container - clean white background matching Quote.Vote
  panelContainer: {
    background: '#f5f5f5',
    minHeight: '100vh',
    padding: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(3),
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },

  // Clean breadcrumb matching Quote.Vote style
  breadcrumb: {
    background: 'white',
    borderRadius: 8,
    padding: theme.spacing(1.5, 2),
    marginBottom: theme.spacing(3),
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    '& a': {
      color: '#52b274',
      transition: 'all 0.3s ease',
      '&:hover': {
        color: '#3d8a59',
      },
    },
    '& .MuiTypography-root': {
      color: '#333',
      fontWeight: 600,
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1, 1.5),
      marginBottom: theme.spacing(2),
    },
  },

  // Clean header matching Quote.Vote typography
  panelHeader: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '2rem',
    fontWeight: 700,
    color: '#333',
    marginBottom: theme.spacing(3),
    letterSpacing: '-0.5px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.5rem',
      marginBottom: theme.spacing(2),
    },
  },

  // Clean tabs matching Quote.Vote
  tabsContainer: {
    background: 'white',
    borderRadius: 8,
    padding: theme.spacing(1),
    marginBottom: theme.spacing(3),
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    '& .MuiTabs-indicator': {
      backgroundColor: '#52b274',
      height: 3,
      borderRadius: 3,
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(2),
    },
  },

  tab: {
    color: '#666',
    fontWeight: 600,
    fontSize: '0.95rem',
    textTransform: 'none',
    transition: 'all 0.3s ease',
    '&.Mui-selected': {
      color: '#52b274',
    },
    '&:hover': {
      color: '#52b274',
      background: 'rgba(82, 178, 116, 0.05)',
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

  // Clean card design matching Quote.Vote
  card: {
    background: 'white',
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: 8,
      boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    },
  },

  cardHeader: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#52b274',
    marginBottom: theme.spacing(2),
    letterSpacing: '-0.2px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.1rem',
      marginBottom: theme.spacing(1.5),
    },
  },

  // Clean search input matching Quote.Vote
  filterInput: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: '#52b274',
      },
      '&.Mui-focused': {
        borderColor: '#52b274',
        boxShadow: '0 0 0 2px rgba(82, 178, 116, 0.1)',
      },
    },
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginBottom: theme.spacing(1.5),
    },
  },

  // Clean table matching Quote.Vote
  tableContainer: {
    maxHeight: 600,
    overflowX: 'auto',
    overflowY: 'auto',
    borderRadius: 8,
    '&::-webkit-scrollbar': {
      width: 8,
      height: 8,
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: 10,
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#52b274',
      borderRadius: 10,
      '&:hover': {
        background: '#3d8a59',
      },
    },
    [theme.breakpoints.down('sm')]: {
      maxHeight: 'calc(100vh - 350px)',
    },
  },

  columnHeader: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#333',
    background: '#f5f5f5',
    borderBottom: '2px solid #e0e0e0',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.75rem',
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

  // Clean status badges matching Quote.Vote
  pendingStatus: {
    background: '#ff9800',
    color: 'white',
    padding: '6px 14px',
    borderRadius: 16,
    fontWeight: 600,
    fontSize: '0.8rem',
    textTransform: 'capitalize',
    cursor: 'default',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: '#fb8c00',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '4px 10px',
      fontSize: '0.7rem',
    },
  },

  acceptedStatus: {
    background: '#4caf50',
    color: 'white',
    padding: '6px 14px',
    borderRadius: 16,
    fontWeight: 600,
    fontSize: '0.8rem',
    textTransform: 'capitalize',
    cursor: 'default',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: '#66bb6a',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '4px 10px',
      fontSize: '0.7rem',
    },
  },

  declinedStatus: {
    background: '#f44336',
    color: 'white',
    padding: '6px 14px',
    borderRadius: 16,
    fontWeight: 600,
    fontSize: '0.8rem',
    textTransform: 'capitalize',
    cursor: 'default',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: '#ef5350',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '4px 10px',
      fontSize: '0.7rem',
    },
  },

  // Clean action buttons matching Quote.Vote
  button: {
    background: '#52b274',
    color: 'white',
    padding: '8px 18px',
    borderRadius: 8,
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.875rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease',
    border: 'none',
    cursor: 'pointer',
    '&:hover': {
      background: '#3d8a59',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    },
    '&:active': {
      transform: 'scale(0.98)',
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '6px 12px',
      fontSize: '0.75rem',
      borderRadius: 6,
    },
  },

  // Featured row highlight matching Quote.Vote
  featuredRow: {
    background: 'rgba(82, 178, 116, 0.05)',
    borderLeft: '4px solid #52b274',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(82, 178, 116, 0.1)',
    },
  },

  // Clean select dropdown
  slotSelect: {
    minWidth: 100,
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
      transition: 'all 0.2s ease',
      '&:hover': {
        borderColor: '#52b274',
      },
      '&.Mui-focused': {
        borderColor: '#52b274',
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
