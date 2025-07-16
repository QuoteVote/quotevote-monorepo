
import {
  containerFluid, drawerMiniWidth, drawerWidth, transition,
} from 'assets/jss/material-dashboard-pro-react';

const appStyle = (theme) => ({
  root: {
    flexGrow: 1,
    height: '100%',
    width: '100%',
    minHeight: '100%',
  },
  toolbar: {
    marginRight: theme.spacing(1),
  },
  grow: {
    flexGrow: 1,
  },
  menuIcons: {
    color: 'secondary',
  },
  fab: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
    backgroundColor: 'white',
  },
  profileRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    height: '100%',
  },
  profileBlockImage: {
    width: '100px',
  },
  profileBlockName: {
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 'bold',
    lineHeight: '24px',
    color: '#424556',
    marginLeft: 5,
  },
  avatarRoundedButton: {
    borderRadius: '25px',
  },
  rightMenuButton: {
    marginLeft: theme.spacing(1),
  },
  appBar: {
    color: 'light',
    zIndex: theme.zIndex.drawer + 1,
    paddingRight: 20,
  },
  title: {
    flexGrow: 1,
  },
  mainPanel: {
    transitionProperty: 'top, bottom, width',
    transitionDuration: '.2s, .2s, .35s',
    transitionTimingFunction: 'linear, linear, ease',
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerMiniWidth}px)`,
    },
    overflow: 'auto',
    position: 'relative',
    float: 'right',
    ...transition,
    maxHeight: '100%',
    width: '100%',
    overflowScrolling: 'touch',
  },
  mainPanelResize: {
    transitionProperty: 'top, bottom, width',
    transitionDuration: '.2s, .2s, .35s',
    transitionTimingFunction: 'linear, linear, ease',
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
    overflow: 'auto',
    position: 'relative',
    float: 'right',
    ...transition,
    maxHeight: '100%',
    width: '100%',
    overflowScrolling: 'touch',
  },
  content: {
    flexGrow: 1,
    height: '100%',
    marginTop: theme.spacing(10),
    overflow: 'hidden',
    width: '70%',
    marginLeft: 'auto',
    marginRight: 'auto',
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(7),
      width: '100%',
    },
  },
  contentChat: {
    flexGrow: 1,
    height: '100%',
    marginTop: theme.spacing(10),
    [theme.breakpoints.up('md')]: {
      marginRight: drawerWidth,
    },
    [theme.breakpoints.down('sm')]: {
      marginRight: drawerWidth,
      marginTop: theme.spacing(1),
      marginLeft: drawerMiniWidth,
    },
    overflow: 'hidden',
  },
  container: { ...containerFluid },
  map: {
    marginTop: '70px',
  },
  mainPanelSidebarMini: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerMiniWidth}px)`,
    },
  },
  mainPanelWithPerfectScrollbar: {
    overflow: 'hidden !important',
  },
})

export default appStyle
