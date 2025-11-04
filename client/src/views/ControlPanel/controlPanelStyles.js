const requestAccessStyles = (theme) => ({
  tableContainer: {
    maxHeight: 500,
    overflowX: 'auto',
    overflowY: 'auto',
    [theme.breakpoints.down('sm')]: {
      maxHeight: 'calc(100vh - 300px)',
    },
  },
  panelContainer: {
    [theme.breakpoints.up('lg')]: {
      padding: 20,
      paddingTop: 30,
    },
    [theme.breakpoints.down('md')]: {
      padding: 10,
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      paddingTop: theme.spacing(2),
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1),
    },
  },
  panelHeader: {
    font: 'Montserrat',
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 25,
    [theme.breakpoints.down('sm')]: {
      fontSize: '20px',
      marginBottom: 16,
    },
  },
  cardHeader: {
    font: 'Montserrat',
    fontSize: '18px',
    fontWeight: 'bold',
    letterSpacing: '0.2px',
    color: '#52b274',
    marginBottom: 10,
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px',
      marginBottom: 8,
    },
  },
  columnHeader: {
    font: 'Roboto',
    fontSize: '17px',
    fontWeight: 500,
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      padding: '8px 4px',
      whiteSpace: 'nowrap',
    },
  },
  button: {
    minWidth: '83.1px',
    height: '32px',
    borderRadius: '3px',
    textTransform: 'none',
    color: 'white',
    margin: 5,
    padding: '6px 12px',
    [theme.breakpoints.down('sm')]: {
      minWidth: '70px',
      height: '28px',
      margin: 3,
      padding: '4px 8px',
      fontSize: '12px',
    },
  },
  pendingStatus: {
    borderRadius: '10px',
    backgroundColor: '#d8d8d8',
    '&:hover': {
      backgroundColor: '#d8d8d8',
    },
    minWidth: '83.1px',
    height: '28px',
    textTransform: 'none',
    margin: 5,
    color: 'black',
    cursor: 'default',
    [theme.breakpoints.down('sm')]: {
      minWidth: '70px',
      height: '24px',
      margin: 2,
      fontSize: '11px',
    },
  },
  acceptedStatus: {
    borderRadius: '10px',
    backgroundColor: '#4caf50',
    '&:hover': {
      backgroundColor: '#4caf50',
    },
    minWidth: '83.1px',
    height: '28px',
    textTransform: 'none',
    margin: 5,
    color: 'white',
    cursor: 'default',
    [theme.breakpoints.down('sm')]: {
      minWidth: '70px',
      height: '24px',
      margin: 2,
      fontSize: '11px',
    },
  },
  declinedStatus: {
    borderRadius: '10px',
    backgroundColor: '#ff6060',
    '&:hover': {
      backgroundColor: '#ff6060',
    },
    minWidth: '83.1px',
    height: '28px',
    textTransform: 'none',
    margin: 5,
    color: 'white',
    cursor: 'default',
    [theme.breakpoints.down('sm')]: {
      minWidth: '70px',
      height: '24px',
      margin: 2,
      fontSize: '11px',
    },
  },
  graphText: {
    font: 'Roboto',
    fontSize: '18px',
    fontWeight: 300,
    lineHeight: 1.39,
    color: '#333333',
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
    },
  },
  featuredRow: {
    backgroundColor: '#fff8e1',
  },
  slotSelect: {
    minWidth: 80,
    [theme.breakpoints.down('sm')]: {
      minWidth: 60,
    },
  },
  filterInput: {
    marginBottom: 15,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 10,
      width: '100%',
    },
  },
  tabsContainer: {
    borderBottom: 1,
    borderColor: 'divider',
    marginBottom: 20,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 12,
    },
  },
  tabPanel: {
    paddingTop: 20,
    [theme.breakpoints.down('sm')]: {
      paddingTop: 12,
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
