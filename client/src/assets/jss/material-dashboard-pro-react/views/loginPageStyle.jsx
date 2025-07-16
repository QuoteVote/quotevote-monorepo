import {
  container,
  cardTitle,
  whiteColor,
  grayColor,
} from 'assets/jss/material-dashboard-pro-react';

const loginPageStyle = (theme) => ({
  container: {
    ...container,
    zIndex: '4',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    margin: 0,
    padding: 0,
    [theme.breakpoints.down('sm')]: {
      paddingBottom: '0',
    },
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
})

export default loginPageStyle
