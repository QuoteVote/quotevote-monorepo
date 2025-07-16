import {
  cardTitle, container, grayColor, whiteColor,
} from 'assets/jss/material-dashboard-pro-react';
import { green } from '@material-ui/core/colors';

const landingPageStyle = (theme) => ({
  logoImage: {
    width: '100%',
    maxWidth: 500,
    height: 'auto',
  },
  container: {
    ...container,
    zIndex: '4',
    minWidth: '100%',
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cardTitle: {
    ...cardTitle,
    color: whiteColor,
  },
  textCenter: {
    textAlign: 'center',
  },
  justifyContentCenter: {
    justifyContent: 'center !important',
  },
  customButtonClass: {
    '&,&:focus,&:hover': {
      color: whiteColor,
    },
    marginLeft: '5px',
    marginRight: '5px',
  },
  voxPop: {
    width: 300,
    [theme.breakpoints.down('sm')]: {
      width: '80%',
      maxWidth: 300,
    },
  },
  listContainer: {
    marginTop: 0,
    display: 'flex',
    gap: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      marginTop: -60,
      gap: 20,
    },
  },
  listItem: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    padding: '0',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  listItemTextRequestInvite: {
    backgroundColor: '#00cf6e',
    color: 'white',
    '&:hover': {
      backgroundColor: '#00cf6e',
    },
    width: 200,
    fontSize: 15,
    whiteSpace: 'nowrap',
    textTransform: 'none',
    marginLeft: 5,
    marginRight: 5,
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
  },
  listItemTextLogin: {
    backgroundColor: 'transparent',
    border: '1px solid white',
    color: 'white',
    '&:hover': {
      backgroundColor: 'white',
      color: 'black',
    },
    width: 200,
    fontSize: 15,
    whiteSpace: 'nowrap',
    textTransform: 'none',
    marginLeft: 5,
    marginRight: 5,
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
  },
  card: {
    padding: '20px',
    width: '70%',
    margin: '10px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  listItemHeaderText: {
    textAlign: 'center',
    color: 'black',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: '10px',
  },
  listItemText: {
    marginBottom: 10,
    fontSize: '.75rem',
    fontWeight: 'bold',
  },
  listItemTextDonate: {
    backgroundColor: 'white',
    color: '#00cf6e',
    '&:hover': {
      backgroundColor: 'white',
      color: '#00cf6e',
      boxShadow: '-3px 2px 0 #00cf6e',
    },
    boxShadow: '-3px 2px 0 #00cf6e',
    width: 200,
    fontSize: 15,
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    textTransform: 'none',
    marginLeft: 5,
    marginRight: 5,
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
  },
  contact: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    color: 'white',
    fontSize: '.75rem',
    fontWeight: 'bold',
    margin: '10px',
    // style for the link
    '& a': {
      color: 'white',
      textDecoration: 'underline',
    },
  },
  listItemMakeWithLove: {
    marginTop: -20,
    textAlign: 'center',
    fontSize: '.75rem',
    '& span': {
      fontFamily: 'Montserrat',
      fontWeight: 'bold',
      // fontSize: '.8rem',
    },
  },
  inputAdornment: {
    marginRight: '18px',
  },
  inputAdornmentIcon: {
    color: grayColor[6],
  },
  cardHidden: {
    opacity: '0',
    transform: 'translate3d(0, -60px, 0)',
  },
  cardHeader: {
    marginBottom: '20px',
  },
  socialLine: {
    padding: '0.9375rem 0',
  },
  share: {
    objectFit: 'contain',
    font: 'Montserrat',
    fontSize: '34px',
    marginTop: 30,
    fontWeight: 'bold',
    letterspacing: '0.25px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '34px',
    },
  },
  greenTitleText: {
    objectFit: 'contain',
    font: 'Montserrat',
    fontSize: '34px',
    fontWeight: 'bold',
    letterspacing: '0.25px',
    color: '#00cf6e',
  },
  fits: {
    height: '28px',
    font: 'Roboto',
    fontSize: '22px',
    letterspacing: '0.25px',
    lineHeight: 1.27,
    margin: theme.spacing(2),
  },
  buttonSpacing: {
    '& > *': {
      margin: ((props) => props.isMobile ? theme.spacing(1) : theme.spacing(2)),
    },
  },
  opinionsText: {
    maxWidth: '400px',
    [theme.breakpoints.down('sm')]: {
      margin: 10,
    },
  },
  greenText: {
    color: '#00cf6e',
  },
  inactiveIndicator: {
    fontSize: '25px',
  },
  activeIndicator: {
    fontSize: '25px',
    color: '#00cf6e',
  },
  bottomText: {
    fontSize: '18px',
    fontWeight: 'bold',
    [theme.breakpoints.down('sm')]: {
      marginLeft: ((props) => props.isMobile ? 0 : 100),
      marginTop: 10,
    },
  },
  sendEmail: {
    background: 'white',
    backgroundColor: 'white',
    color: 'white',
    borderRadius: '8px',
  },
  sendEmailButton: {
    backgroundColor: green[500],
    color: 'white',
    '&:hover': {
      backgroundColor: green[700],
      color: 'white',
    },
  },
  requestInvite: {
    textTransform: 'none',
    backgroundColor: '#00cf6e',
    color: 'white',
    '&:hover': {
      backgroundColor: '#00cf6e',
    },
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('xs')]: {
      marginTop: ((props) => props.isMobile ? 10 : 20),
      marginLeft: ((props) => props.isMobile ? 25 : 100),
      width: 200,
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: ((props) => props.isMobile ? 20 : 10),
      marginLeft: ((props) => props.isMobile ? 25 : 200),
      width: 200,
    },
  },
  investButton: {
    textTransform: 'none',
    color: '#00cf6e',
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: 'white',
    },
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('xs')]: {
      marginTop: 20,
      marginLeft: ((props) => props.isMobile ? 25 : 100),
      width: ((props) => props.isMobile ? 100 : 200),
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 20,
      marginLeft: ((props) => props.isMobile ? 25 : 200),
      width: ((props) => props.isMobile ? 100 : 200),
    },
  },
  select: {
    fontSize: 25,
    [theme.breakpoints.up('sm')]: {
      marginBottom: 60,
    },
  },
  plans: {
    paddingLeft: 50,

  },
  planAvatar: {
    height: 300,
    marginBottom: 20,
  },
  planButton: {
    color: '#FFF',
    borderColor: '#FFF',
    width: 100,
    [theme.breakpoints.down('xs')]: {
      marginTop: 20,
      width: '80%',
    },
  },
  inputContainer: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    height: 45,
    width: 250,
    marginRight: 20,
    paddingLeft: 20,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 20,
      marginRight: 0,
      width: '100%',
    },
  },
  requestAccessBtn: {
    textTransform: 'none',
    backgroundColor: '#00cf6e',
    color: 'white',
    width: 200,
    height: 45,
    fontSize: 16,
    marginRight: 5,
    '&:hover': {
      backgroundColor: '#00cf6e',
    },
    [theme.breakpoints.down('sm')]: {
      width: "100%",
    },
  },
  overlayContainer: {
    position: 'relative',
    width: '70%',
    padding: '16px',
    [theme.breakpoints.down('lg')]: {
      width: '100%',
      padding: '2px',
    },
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.45)',
    zIndex: 1,
    borderRadius: 8,
  },
  overlayContent: {
    position: 'relative',
    zIndex: 2,
    padding: '16px',
    [theme.breakpoints.down('md')]: {
      padding: '8px',
    },
  },
})

export default landingPageStyle
