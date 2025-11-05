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
    position: 'sticky',
    top: 0,
    zIndex: 10,
    [theme.breakpoints.down('sm')]: {
      fontSize: '11px',
      padding: '8px 4px',
      whiteSpace: 'nowrap',
      minHeight: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
      minWidth: '48px',
      height: '24px',
      margin: '0px',
      padding: '2px 4px',
      fontSize: '9px',
      borderRadius: '3px',
      fontWeight: 500,
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
    padding: '6px 12px',
    fontWeight: 600,
    fontSize: '12px',
    cursor: 'default',
    boxShadow: '0 2px 4px rgba(255,152,0,0.3)',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#fb8c00',
      boxShadow: '0 4px 8px rgba(255,152,0,0.4)',
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: '60px',
      height: '24px',
      fontSize: '10px',
      padding: '3px 6px',
      margin: '2px',
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
      fontSize: '12px',
      maxWidth: '120px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      lineHeight: '1.3',
      minHeight: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '6px 2px',
      fontSize: '11px',
      maxWidth: '100px',
    },
  },

  // Email cell specific styling for mobile
  emailCell: {
    [theme.breakpoints.down('sm')]: {
      maxWidth: '140px',
      fontSize: '13px',
      padding: '8px 6px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      textAlign: 'left',
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: '110px',
      fontSize: '12px',
    },
  },

  // Date cell styling for mobile
  dateCell: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '11px',
      padding: '8px 4px',
      whiteSpace: 'nowrap',
    },
  },

  // Status cell styling for mobile
  statusCell: {
    [theme.breakpoints.down('sm')]: {
      padding: '8px 4px',
    },
  },

  // Actions cell styling for mobile
  actionsCell: {
    [theme.breakpoints.down('sm')]: {
      padding: '6px 2px',
      minWidth: '100px',
    },
  },

  // Mobile-specific table styles
  mobileTableWrapper: {
    [theme.breakpoints.down('sm')]: {
      overflowX: 'auto',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      transform: 'translateZ(0)',
      WebkitTransform: 'translateZ(0)',
      '&::-webkit-scrollbar': {
        height: '4px',
      },
      '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#52b274',
        borderRadius: '2px',
      },
    },
  },

  // iOS safe area handling
  safeAreaContainer: {
    [theme.breakpoints.down('sm')]: {
      paddingBottom: 'env(safe-area-inset-bottom)',
      minHeight: 'calc(100vh - env(safe-area-inset-bottom))',
    },
  },

  // Mobile action buttons container
  mobileActionsContainer: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0px',
      minWidth: '100px',
    },
  },

  stickyHeader: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 10,
  },

  // Statistics Chart Styling
  statisticsCard: {
    background: 'linear-gradient(135deg, #52b274 0%, #449a5f 100%)',
    color: 'white',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    marginBottom: 16,
    '& .ct-chart': {
      color: 'white',
    },
    '& .ct-line': {
      stroke: 'white',
      strokeWidth: 3,
    },
    '& .ct-point': {
      stroke: 'white',
      fill: 'white',
    },
  },

  statisticsFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 16,
    fontSize: '16px',
    fontWeight: 500,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      gap: 8,
      fontSize: '14px',
    },
  },

  // User Management Styling
  userManagementSwitch: {
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#52b274',
      '&:hover': {
        backgroundColor: 'rgba(82, 178, 116, 0.08)',
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#52b274',
    },
  },

  // Featured Posts specific styling
  featuredPostTitle: {
    maxWidth: 200,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('sm')]: {
      maxWidth: 120,
    },
  },

  featuredPostSummary: {
    maxWidth: 150,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: '#666',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },

  postIdCell: {
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#888',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
})

export default requestAccessStyles
