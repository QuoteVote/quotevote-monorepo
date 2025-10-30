const requestAccessStyles = (theme) => ({
  greenBtn: {
    textTransform: 'none',
    backgroundColor: '#52b274',
    color: 'white',
    float: 'right',
    '&:hover': {
      backgroundColor: '#52b274',
    },
  },
  header: {
    height: 'auto',
    objectFit: 'contain',
    font: 'Montserrat',
    fontSize: 'clamp(18px, 5vw, 34px)',
    fontWeight: 700,
    letterSpacing: '0.25px',
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(2),
      textAlign: 'center',
      lineHeight: 1.05,
    },
  },
  subHeader: {
    height: '28px',
    font: 'Roboto',
    fontSize: '22px',
    letterspacing: '0.25px',
    lineHeight: 1.27,
    [theme.breakpoints.down('sm')]: {
      fontSize: '17px',
    },
  },
  stepNumber: {
    width: '22px',
    height: '28px',
    borderRadius: '6px',
    backgroundColor: '#52b274',
    opacity: 0.85,
    font: 'Roboto',
    fontsize: '18px',
    lineHeight: 1.56,
    color: '#ffffff',
    padding: '3px 6px',
  },
  stepName: {
    font: 'Roboto',
    fontsize: '18px',
    lineHeight: 1.56,
  },
  note: {
    font: 'Roboto',
    fontsize: '16px',
    lineHeight: 1.56,
    color: '#424556',
  },
  message: {
    font: 'Roboto',
    fontSize: 24,
    lineHeight: 1.25,
    [theme.breakpoints.down('sm')]: {
      fontSize: 20,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
    },
  },
  plansHeader: {
    height: '41px',
    objectFit: 'contain',
    font: 'Montserrat',
    fontSize: '34px',
    fontWeight: 'bold',
    letterspacing: '0.25px',
    [theme.breakpoints.down('sm')]: {
      marginTop: 100,
    },
  },
  plansCardImage: {
    width: '200.6px',
    height: '140px',
    marginLeft: '10%',
  },
  plansCardHeader: {
    font: 'Montserrat',
    fontsize: 37,
    lineHeight: 1.56,
    fontWeight: 600,
    color: '#333333',
    textAlign: 'center',
  },
  plansCardText: {
    font: 'Roboto',
    fontsize: 20,
    lineHeight: 0.75,
    fontWeight: 500,
    color: '#333333',
    textAlign: 'center',
  },
  checkIconPersonal: {
    color: '#157ffb',
    marginRight: 5,
    [theme.breakpoints.down('sm')]: {
      fontSize: '28px',
    },
  },
  checkIconBusiness: {
    color: '#791e89',
    marginRight: 5,
  },
  link: {
    opacity: 0.8,
    font: 'Roboto',
    fontSize: 16,
    letterSpacing: 0.25,
    color: '#424556',
  },
  requestBtn: {
    textTransform: 'none',
    backgroundColor: '#52b274',
    color: 'white',
    position: 'absolute',
    bottom: '-5%',
    left: '27%',
    '&:hover': {
      backgroundColor: '#52b274',
    },
  },
  error: {
    marginTop: '10px',
    font: 'Roboto',
    color: 'red',
  },
  loadingProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  gridContent: {
    marginRight: '15%',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      marginTop: 25,
    },
  },
  inputContainer: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  opaqueBackground: {
    background: 'rgba(0,0,0,0.5)', // black with 50% opacity
    padding: theme.spacing(4),
    borderRadius: 12,
    color: '#fff',
    textAlign: 'center',
    maxWidth: '60%',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '400px',
      padding: theme.spacing(3),
    },
  },
  '@media (max-width: 960px)': {
    header: {
      fontSize: 'clamp(18px, 6vw, 28px)',
    },
  },
  '@media (max-width: 520px)': {
    image: {
      maxWidth: '92%',
      maxHeight: '30vh',
    },
    opaqueBackground: {
      maxWidth: '50px',
      minWidth: '80%',
    },
  },
})

export default requestAccessStyles
