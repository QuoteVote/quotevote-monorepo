const requestAccessStyles = (theme) => ({
  tableContainer: {
    maxHeight: 500,
    overflowX: 'auto',
    borderRadius: 8,
    [theme.breakpoints.down('sm')]: {
      maxHeight: 'none',
    },
  },
  panelContainer: {
    width: '100%',
    margin: '0 auto',
    [theme.breakpoints.up('lg')]: {
      padding: 20,
      paddingTop: 30,
    },
    [theme.breakpoints.down('md')]: {
      padding: 10,
    },
    [theme.breakpoints.down('xs')]: {
      padding: 0,
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
      textAlign: 'center',
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
    },
  },
  columnHeader: {
    font: 'Roboto',
    fontSize: '17px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      whiteSpace: 'nowrap',
    },
  },
  button: {
    minWidth: 100,
    height: 36,
    borderRadius: 8,
    textTransform: 'none',
    color: 'white',
    margin: theme.spacing(0.5),
    padding: theme.spacing(1, 2),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: theme.spacing(0.5, 0),
    },
  },
  actionButtonGroup: {
    display: 'flex',
    gap: theme.spacing(1),
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    maxWidth: 260,
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      width: '100%',
      justifyContent: 'flex-start',
    },
  },
  singleActionButton: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'flex-start',
      width: '100%',
    },
  },
  pendingStatus: {
    backgroundColor: '#d8d8d8',
    '&:hover': {
      backgroundColor: '#d8d8d8',
    },
    color: 'black',
    cursor: 'default',
  },
  acceptedStatus: {
    backgroundColor: '#4caf50',
    '&:hover': {
      backgroundColor: '#4caf50',
    },
    color: 'white',
    cursor: 'default',
  },
  declinedStatus: {
    backgroundColor: '#ff6060',
    '&:hover': {
      backgroundColor: '#ff6060',
    },
    color: 'white',
    cursor: 'default',
  },
  statusButton: {
    borderRadius: 10,
    textTransform: 'none',
    margin: theme.spacing(0.5),
    minWidth: 120,
    fontWeight: 600,
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: theme.spacing(0.5, 0),
      justifyContent: 'flex-start',
    },
  },
  graphText: {
    font: 'Roboto',
    fontSize: '18px',
    fontWeight: 300,
    lineHeight: 1.39,
    color: '#333333',
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px',
    },
  },
  featuredRow: {
    backgroundColor: '#fff8e1',
  },
  slotSelect: {
    minWidth: 80,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  filterInput: {
    marginBottom: 15,
    maxWidth: 360,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
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
  tabsWrapper: {
    width: '100%',
    overflowX: 'auto',
    [theme.breakpoints.down('sm')]: {
      paddingBottom: theme.spacing(1),
    },
    '& .MuiTabs-root': {
      minHeight: 48,
    },
    '& .MuiTabs-flexContainer': {
      flexWrap: 'nowrap',
    },
  },
  tabRoot: {
    minWidth: 160,
    fontWeight: 600,
    [theme.breakpoints.down('md')]: {
      minWidth: 140,
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: 120,
      fontSize: '0.85rem',
      padding: theme.spacing(0, 1),
    },
    [theme.breakpoints.down('xs')]: {
      minWidth: 100,
    },
  },
  mobileTabSelect: {
    width: '100%',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.divider,
    },
  },
  tabPanel: {
    paddingTop: 20,
    [theme.breakpoints.down('sm')]: {
      paddingTop: 12,
    },
  },
  responsiveList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  responsiveCard: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[0],
  },
  responsiveCardRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '&:last-child': {
      marginBottom: 0,
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: theme.spacing(0.5),
    },
  },
  responsiveCardLabel: {
    fontWeight: 600,
    color: theme.palette.text.secondary,
  },
  responsiveCardValue: {
    flex: 1,
    textAlign: 'right',
    color: theme.palette.text.primary,
    wordBreak: 'break-word',
    [theme.breakpoints.down('xs')]: {
      textAlign: 'left',
      width: '100%',
    },
  },
  responsiveCardActions: {
    marginTop: theme.spacing(2),
  },
  statusWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'flex-start',
    },
  },
  pagination: {
    [theme.breakpoints.down('sm')]: {
      '& .MuiTablePagination-toolbar': {
        paddingLeft: 0,
        paddingRight: 0,
      },
      '& .MuiTablePagination-selectRoot': {
        marginLeft: theme.spacing(1),
      },
    },
  },
  emptyState: {
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  statsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  statsFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  searchIcon: {
    fontSize: 16,
  },
  table: {
    minWidth: 650,
  },
  responsiveSelect: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  switchWrapper: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'flex-start',
    },
  },
})

export default requestAccessStyles
