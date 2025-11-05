const requestAccessStyles = (theme) => ({
  // Clean, professional admin panel styles
  tableContainer: {
    maxHeight: 600,
    overflowX: 'auto',
    overflowY: 'auto',
    borderRadius: 8,
    border: '1px solid #e0e0e0',
    backgroundColor: 'white',
    [theme.breakpoints.down('sm')]: {
      maxHeight: 'calc(100vh - 280px)',
      borderRadius: 4,
    },
  },
  panelContainer: {
    backgroundColor: '#fafafa',
    minHeight: '100vh',
    [theme.breakpoints.up('lg')]: {
      padding: 24,
      paddingTop: 32,
    },
    [theme.breakpoints.down('md')]: {
      padding: 16,
    },
    [theme.breakpoints.down('sm')]: {
      padding: 12,
      paddingTop: 16,
    },
  },
  panelHeader: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '28px',
    fontWeight: 700,
    color: '#333',
    marginBottom: 24,
    textAlign: 'left',
    [theme.breakpoints.down('sm')]: {
      fontSize: '24px',
      marginBottom: 16,
    },
  },
  cardHeader: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '20px',
    fontWeight: 600,
    letterSpacing: '0.1px',
    color: '#52b274',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: '18px',
      marginBottom: 12,
    },
  },
  columnHeader: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '14px',
    fontWeight: 600,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    padding: '16px 12px',
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #e9ecef',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px',
      padding: '12px 8px',
      whiteSpace: 'nowrap',
    },
  },
  button: {
    minWidth: '90px',
    height: '36px',
    borderRadius: '6px',
    textTransform: 'none',
    color: 'white',
    margin: '0 4px',
    padding: '8px 16px',
    fontWeight: 600,
    fontSize: '13px',
    backgroundColor: '#52b274',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#449a5f',
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
      transform: 'translateY(-1px)',
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: '70px',
      height: '32px',
      margin: '2px',
      padding: '6px 12px',
      fontSize: '12px',
    },
  },
  pendingStatus: {
    borderRadius: '16px',
    backgroundColor: '#ff9800',
    color: 'white',
    minWidth: '80px',
    height: '32px',
    textTransform: 'capitalize',
    margin: '4px',
    fontWeight: 600,
    fontSize: '12px',
    cursor: 'default',
    padding: '6px 12px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(255,152,0,0.3)',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#fb8c00',
      boxShadow: '0 4px 8px rgba(255,152,0,0.4)',
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: '65px',
      height: '28px',
      fontSize: '11px',
      padding: '4px 8px',
    },
  },
  acceptedStatus: {
    borderRadius: '16px',
    backgroundColor: '#4caf50',
    color: 'white',
    minWidth: '80px',
    height: '32px',
    textTransform: 'capitalize',
    margin: '4px',
    fontWeight: 600,
    fontSize: '12px',
    cursor: 'default',
    padding: '6px 12px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(76,175,80,0.3)',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#66bb6a',
      boxShadow: '0 4px 8px rgba(76,175,80,0.4)',
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: '65px',
      height: '28px',
      fontSize: '11px',
      padding: '4px 8px',
    },
  },
  declinedStatus: {
    borderRadius: '16px',
    backgroundColor: '#f44336',
    color: 'white',
    minWidth: '80px',
    height: '32px',
    textTransform: 'capitalize',
    margin: '4px',
    fontWeight: 600,
    fontSize: '12px',
    cursor: 'default',
    padding: '6px 12px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(244,67,54,0.3)',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#ef5350',
      boxShadow: '0 4px 8px rgba(244,67,54,0.4)',
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: '65px',
      height: '28px',
      fontSize: '11px',
      padding: '4px 8px',
    },
  },
  
  // Enhanced styling for all admin components
  graphText: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: 1.5,
    color: '#555',
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
    },
  },
  
  featuredRow: {
    backgroundColor: 'rgba(82, 178, 116, 0.08)',
    borderLeft: '4px solid #52b274',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(82, 178, 116, 0.12)',
    },
  },
  
  slotSelect: {
    minWidth: 100,
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
      backgroundColor: 'white',
      '&:hover': {
        borderColor: '#52b274',
      },
      '&.Mui-focused': {
        borderColor: '#52b274',
      },
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: 80,
    },
  },
  
  filterInput: {
    marginBottom: 20,
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
      backgroundColor: 'white',
      '&:hover': {
        borderColor: '#52b274',
      },
      '&.Mui-focused': {
        borderColor: '#52b274',
        boxShadow: '0 0 0 2px rgba(82, 178, 116, 0.1)',
      },
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: 16,
      width: '100%',
    },
  },
  
  tabsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 24,
    padding: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    '& .MuiTabs-indicator': {
      backgroundColor: '#52b274',
      height: 3,
      borderRadius: '2px',
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: 16,
      padding: '4px',
    },
  },
  
  tabPanel: {
    paddingTop: 24,
    [theme.breakpoints.down('sm')]: {
      paddingTop: 16,
    },
  },
  
  // Card styling
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '1px solid #f0f0f0',
    [theme.breakpoints.down('sm')]: {
      borderRadius: 8,
      padding: 16,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
  },
  
  // Breadcrumb styling
  breadcrumb: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
    '& a': {
      color: '#52b274',
      textDecoration: 'none',
      '&:hover': {
        color: '#449a5f',
      },
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: 16,
      padding: 8,
    },
  },
  mobileTableCell: {
    [theme.breakpoints.down('sm')]: {
      padding: '8px 4px',
      fontSize: '13px',
      maxWidth: '150px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
  card: {
    [theme.breakpoints.down('sm')]: {
      boxShadow: theme.shadows[2],
    },
  },
  breadcrumb: {
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(1),
    },
  },
  stickyHeader: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 10,
  },
})

export default requestAccessStyles
