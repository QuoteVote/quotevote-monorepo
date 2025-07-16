import {
  whiteColor,
  blackColor,
  hexToRgb,
} from 'assets/jss/material-dashboard-pro-react';

const pagesStyle = (theme) => ({
  content: {
    backgroundSize: 'cover',
    '-webkit-background-size': 'cover',
    '-moz-background-size': 'cover',
    '-o-background-size': 'cover',
    backgroundPosition: 'center center',
    padding: '0',
    width: '100vw',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  wrapper: {
    position: 'relative',
    top: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  fullPage: {
    position: 'relative',
    display: 'flex!important',
    margin: '0',
    border: '0',
    color: whiteColor,
    top: 0,
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      minHeight: 'fit-content!important',
    },
  },
  requestAccessFullPage: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex!important',
    margin: '0',
    border: '0',
    color: whiteColor,
    alignItems: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      minHeight: 'fit-content!important',
    },
    '& footer': {
      position: 'absolute',
      bottom: '0',
      width: '100%',
      border: 'none !important',
    },
    '&:before': {
      backgroundColor: `rgba(${hexToRgb(blackColor)}, 0.65)`,
    },
    '&:before,&:after': {
      display: 'block',
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: '0',
      left: '0',
      zIndex: '2',
    },
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    paddingTop: '40px',
    paddingBottom: '40px',
    marginTop: '80px',
    [theme.breakpoints.down('sm')]: {
      minHeight: 'unset',
      width: '100%',
      padding: '0 8px',
    },
  },
})

export default pagesStyle
