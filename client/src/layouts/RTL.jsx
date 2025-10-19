/* eslint-disable */
import React from 'react'
import cx from 'classnames'

// images
// import sidebar2 from '/assets/sidebar-2.jpg'

import { Switch, Route, Redirect } from 'react-router-dom'
// creates a beautiful scrollbar
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

// @material-ui/core components
import { makeStyles, ThemeProvider } from '@mui/material/styles'
import theme from '../themes/MainTheme'

// core components
import AdminNavbar from 'mui-pro/Navbars/AdminNavbar'
import Footer from 'mui-pro/Footer/Footer'
import Sidebar from 'mui-pro/Sidebar/Sidebar'
import FixedPlugin from 'mui-pro/FixedPlugin/FixedPlugin'

import routes from 'mui-pro/mui-routes'

import styles from 'assets/jss/material-dashboard-pro-react/layouts/rtlStyle'

let ps

const useStyles = makeStyles(styles)

export default function RTL(props) {
  const { ...rest } = props
  // states and functions
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [miniActive, setMiniActive] = React.useState(false)
  const [image, setImage] = React.useState('/assets/sidebar-2.jpg')
  const [color, setColor] = React.useState('blue')
  const [bgColor, setBgColor] = React.useState('black')
  // const [hasImage, setHasImage] = React.useState(true);
  const [fixedClasses, setFixedClasses] = React.useState('dropdown')
  const [logo, setLogo] = React.useState('/assets/logo-white.svg')
  // styles
  const classes = useStyles()
  const mainPanelClasses =
    `${classes.mainPanel
    } ${
      cx({
        [classes.mainPanelSidebarMini]: miniActive,
      })}`
  // ref for main panel div
  const mainPanel = React.createRef()
  // effect instead of componentDidMount, componentDidUpdate and componentWillUnmount
  React.useEffect(() => {
    if (navigator.platform.indexOf('Win') > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      })
      document.body.style.overflow = 'hidden'
    }
    window.addEventListener('resize', resizeFunction)

    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf('Win') > -1) {
        ps.destroy()
      }
      window.removeEventListener('resize', resizeFunction)
    }
  })
  // functions for changeing the states from components
  const handleImageClick = (image) => {
    setImage(image)
  }
  const handleColorClick = (color) => {
    setColor(color)
  }
  const handleBgColorClick = (bgColor) => {
    switch (bgColor) {
      case 'white':
        setLogo('/assets/logo.svg')
        break
      default:
        setLogo('/assets/logo-white.svg')
        break
    }
    setBgColor(bgColor)
  }
  const handleFixedClick = () => {
    if (fixedClasses === 'dropdown') {
      setFixedClasses('dropdown show')
    } else {
      setFixedClasses('dropdown')
    }
  }
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }
  const getActiveRoute = (routes) => {
    const activeRoute = 'Default Brand Text'
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        const collapseActiveRoute = getActiveRoute(routes[i].views)
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute
        }
      } else if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].name
      }
    }
    return activeRoute
  }
  const getRoutes = (routes) => routes.map((prop, key) => {
    if (prop.collapse) {
      return getRoutes(prop.views)
    }
    if (prop.layout === '/rtl') {
      return (
        <Route
          path={prop.layout + prop.path}
          component={prop.component}
          key={key}
        />
      )
    }
    return null
  })
  const sidebarMinimize = () => {
    setMiniActive(!miniActive)
  }
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false)
        <ThemeProvider theme={theme}>
          <div className={classes.wrapper}>
  }
  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText="توقيت الإبداعية"
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        bgColor={bgColor}
        miniActive={miniActive}
        rtlActive
        {...rest}
      />
      <div className={mainPanelClasses} ref={mainPanel}>
        <AdminNavbar
          rtlActive
          sidebarMinimize={sidebarMinimize.bind(this)}
          miniActive={miniActive}
          handleDrawerToggle={handleDrawerToggle}
          brandText={getActiveRoute(routes)}
          {...rest}
        />
        <div className={classes.content}>
          <div className={classes.container}>
            <Switch>
              {getRoutes(routes)}
              <Redirect from="/rtl" to="/rtl/rtl-support-page" />
            </Switch>
          </div>
        </div>
        <Footer fluid rtlActive />
        <FixedPlugin
          handleImageClick={handleImageClick}
          handleColorClick={handleColorClick}
          handleBgColorClick={handleBgColorClick}
          color={color}
          bgColor={bgColor}
          bgImage={image}
          handleFixedClick={handleFixedClick}
          fixedClasses={fixedClasses}
          sidebarMinimize={sidebarMinimize.bind(this)}
          miniActive={miniActive}
          rtlActive
        </ThemeProvider>
      </div>
    </div>
  )
}
