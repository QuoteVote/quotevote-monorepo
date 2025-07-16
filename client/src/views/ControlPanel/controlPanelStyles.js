const requestAccessStyles = (theme) => ({
  tableContainer: {
    maxHeight: 500,
  },
  panelContainer: {
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
  },
  cardHeader: {
    font: 'Montserrat',
    fontSize: '18px',
    fontWeight: 'bold',
    letterSpacing: '0.2px',
    color: '#52b274',
    marginBottom: 10,
  },
  columnHeader: {
    font: 'Roboto',
    fontSize: '17px',
  },
  button: {
    width: '83.1px',
    height: '20.8px',
    borderRadius: '3px',
    textTransform: 'none',
    color: 'white',
    margin: 5,
  },
  pendingStatus: {
    borderRadius: '10px',
    backgroundColor: '#d8d8d8',
    '&:hover': {
      backgroundColor: '#d8d8d8',
    },
    width: '83.1px',
    height: '20.8px',
    textTransform: 'none',
    margin: 5,
    color: 'black',
    cursor: 'default',
  },
  acceptedStatus: {
    borderRadius: '10px',
    backgroundColor: '#4caf50',
    '&:hover': {
      backgroundColor: '#4caf50',
    },
    width: '83.1px',
    height: '20.8px',
    textTransform: 'none',
    margin: 5,
    color: 'white',
    cursor: 'default',
  },
  declinedStatus: {
    borderRadius: '10px',
    backgroundColor: '#ff6060',
    '&:hover': {
      backgroundColor: '#ff6060',
    },
    width: '83.1px',
    height: '20.8px',
    textTransform: 'none',
    margin: 5,
    color: 'white',
    cursor: 'default',
  },
  graphText: {
    font: 'Roboto',
    fontSize: '18px',
    fontWeight: 300,
    lineHeight: 1.39,
    color: '#333333',
  },
  featuredRow: {
    backgroundColor: '#fff8e1',
  },
  slotSelect: {
    minWidth: 80,
  },
  filterInput: {
    marginBottom: 15,
  },
  tabsContainer: {
    borderBottom: 1,
    borderColor: 'divider',
    marginBottom: 20,
  },
  tabPanel: {
    paddingTop: 20,
  },
})

export default requestAccessStyles
