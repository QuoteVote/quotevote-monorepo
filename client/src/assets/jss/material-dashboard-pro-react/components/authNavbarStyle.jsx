
import {
    container,
    defaultFont,
    primaryColor,
    defaultBoxShadow,
    infoColor,
    successColor,
    warningColor,
    dangerColor,
    boxShadow,
    drawerWidth,
    transition,
    whiteColor,
    grayColor,
    blackColor,
    hexToRgb,
} from 'assets/jss/material-dashboard-pro-react';

const pagesHeaderStyle = (theme) => ({
  voxPop: {
    height: '25px',
  },
  appBar: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    borderBottom: '0',
    marginBottom: '0',
    position: 'absolute',
    width: '100%',
    paddingTop: '10px',
    zIndex: '1029',
    color: grayColor[6],
    border: '0',
    borderRadius: '3px',
    padding: '10px 0',
    transition: 'all 150ms ease 0s',
    minHeight: '50px',
    display: 'flex',
  },
  buttonDisplay: {
    display: 'flex',
    direction: 'column',
  },
  display: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonSpacing: {
    '& > *': {
      margin: ((props) => props.isMobile ? theme.spacing(1) : theme.spacing(2)),
    },
  },
  container: {
    ...container,
    minHeight: '50px',
  },
  flex: {
    [theme.breakpoints.down('sm')]: {
      flex: 1,
    },
  },
  title: {
    ...defaultFont,
    lineHeight: '30px',
    fontSize: '18px',
    borderRadius: '3px',
    textTransform: 'none',
    color: whiteColor,
    letterSpacing: 'unset',
    '&:hover,&:focus': {
      background: 'transparent',
      color: whiteColor,
    },
  },
  appResponsive: {
    top: '8px',
  },
  primary: {
    backgroundColor: primaryColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  info: {
    backgroundColor: infoColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  success: {
    backgroundColor: successColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  warning: {
    backgroundColor: warningColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  danger: {
    backgroundColor: dangerColor[0],
    color: whiteColor,
    ...defaultBoxShadow,
  },
  list: {
    ...defaultFont,
    fontSize: '14px',
    margin: 0,
    marginRight: '-15px',
    paddingLeft: '0',
    listStyle: 'none',
    color: whiteColor,
    paddingTop: '0',
    paddingBottom: '0',
  },
  listItem: {
    float: 'left',
    position: 'relative',
    display: 'block',
    width: 'auto',
    marginLeft: 5,
    padding: '0',
    [theme.breakpoints.down('sm')]: {
      zIndex: '999',
      width: '100%',
      paddingRight: '15px',
      marginLeft: 0,
    },
  },
  listItemTextRequestInvite: {
    backgroundColor: '#52b274',
    color: 'white',
    '&:hover': {
      backgroundColor: '#52b274',
    },
    [theme.breakpoints.down('sm')]: {
      height: '35px',
      width: 100,
      fontSize: 10,
    },
  },
  navLink: {
    color: whiteColor,
    margin: '0 5px',
    fontWeight: '500',
    fontSize: '12px',
    // textTransform: 'uppercase',
    borderRadius: '3px',
    width: 80,
    lineHeight: '20px',
    position: 'relative',
    display: 'block',
    textAlign: 'center',
    padding: '10px 15px',
    textDecoration: 'none',
    '&:hover,&:focus': {
      color: whiteColor,
      background: `rgba(${hexToRgb(grayColor[17])}, 0.2)`,
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },
  navLinkAccess: {
    color: whiteColor,
    margin: '0 5px',
    fontWeight: '500',
    fontSize: '12px',
    borderRadius: '3px',
    lineHeight: '20px',
    position: 'relative',
    display: 'block',
    padding: '10px 15px',
    textDecoration: 'none',
    '&:hover,&:focus': {
      color: whiteColor,
    },
  },
  navLinkInvestNow: {
    color: whiteColor,
    margin: '0 5px',
    fontWeight: '500',
    fontSize: '12px',
    borderRadius: '3px',
    lineHeight: '20px',
    position: 'relative',
    display: 'block',
    padding: '10px 15px',
    textDecoration: 'none',
    '&:hover,&:focus': {
      color: whiteColor,
    },
  },
  listItemIcon: {
    marginTop: '-3px',
    top: '0px',
    position: 'relative',
    marginRight: '3px',
    width: '20px',
    height: '20px',
    verticalAlign: 'middle',
    color: 'inherit',
    display: 'inline-block',
  },
  listItemText: {
    flex: 'none',
    padding: '0',
    minWidth: '0',
    marginTop: 5,
    width: 45,
    display: 'inline-block',
    position: 'relative',
    whiteSpace: 'nowrap',
  },
  listItemTextAccess: {
    flex: 'none',
    padding: '0',
    minWidth: '0',
    margin: 0,
    display: 'inline-block',
    position: 'relative',
    whiteSpace: 'nowrap',
  },
  navLinkActive: {
    backgroundColor: `rgba(${hexToRgb(whiteColor)}, 0.1)`,
  },
  navLinkActiveAccess: {
    borderRadius: '5px',
    backgroundColor: '#52b274',
  },
  drawerPaper: {
    border: 'none',
    bottom: '0',
    transitionProperty: 'top, bottom, width',
    transitionDuration: '.2s, .2s, .35s',
    transitionTimingFunction: 'linear, linear, ease',
    ...boxShadow,
    width: drawerWidth,
    ...boxShadow,
    position: 'fixed',
    display: 'block',
    top: '0',
    height: '100vh',
    right: '0',
    left: 'auto',
    visibility: 'visible',
    overflowY: 'visible',
    borderTop: 'none',
    textAlign: 'left',
    paddingRight: '0px',
    paddingLeft: '0',
    ...transition,
    '&:before,&:after': {
      position: 'absolute',
      zIndex: '3',
      width: '100%',
      height: '100%',
      content: '""',
      display: 'block',
      top: '0',
    },
    '&:after': {
      background: blackColor,
      opacity: '.8',
    },
  },
  sidebarButton: {
    '&,&:hover,&:focus': {
      color: whiteColor,
    },
    top: '-2px',
  },
})

export default pagesHeaderStyle
