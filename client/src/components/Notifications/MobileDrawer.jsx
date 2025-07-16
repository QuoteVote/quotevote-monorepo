import { makeStyles } from '@material-ui/core/styles'
import { Drawer, AppBar, Toolbar, Typography, IconButton } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: '100%',
    maxWidth: 400,
    height: '100vh',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      width: 400,
    },
    overflow: 'hidden',
  },
  drawerPaper: {
    width: '100%',
    maxWidth: 400,
    height: '100vh',
    minHeight: 0,
    [theme.breakpoints.up('sm')]: {
      width: 400,
    },
  },
  drawerContent: {
    flex: 1,
    minHeight: 0,
    height: '100%',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  appBar: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
  },
  toolbar: {
    minHeight: 56,
    [theme.breakpoints.up('sm')]: {
      minHeight: 64,
    },
  },
  title: {
    marginLeft: theme.spacing(1),
    flexGrow: 1,
    textTransform: 'none',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
}))

function MobileDrawer({
  open,
  onClose,
  title,
  children,
  anchor = 'right',
  drawerPaperStyle,
  appBarStyle,
  titleStyle,
  backButtonStyle,
  ...drawerProps
}) {
  const classes = useStyles()

  const mergedAppBarStyle = {
    ...classes.appBar,
    ...appBarStyle,
  }

  const mergedBackButtonStyle = {
    ...classes.backButton,
    ...backButtonStyle,
  }

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      classes={{
        paper: drawerPaperStyle ? drawerPaperStyle : classes.drawerPaper,
      }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      {...drawerProps}
    >
      <div className={classes.drawer}>
        <AppBar 
          position="static" 
          className={mergedAppBarStyle} 
          elevation={1}
          style={appBarStyle}
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="back"
              className={mergedBackButtonStyle}
              style={backButtonStyle}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              className={titleStyle ? titleStyle : classes.title}
            >
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.drawerContent}>
          {children}
        </div>
      </div>
    </Drawer>
  )
}

MobileDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  anchor: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  drawerPaperStyle: PropTypes.object,
  appBarStyle: PropTypes.object,
  titleStyle: PropTypes.object,
  backButtonStyle: PropTypes.object,
}

export default MobileDrawer 