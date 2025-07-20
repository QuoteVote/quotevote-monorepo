/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-shadow */
import React from 'react'
import cx from 'classnames'
import { Switch, Route, Redirect } from 'react-router-dom'
// creates a beautiful scrollbar
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

// Images
// import sidebar2 from '/assets/sidebar-2.jpg'

// @mui/material components
import { makeStyles } from '@mui/material/styles'

// core components
import AdminNavbar from 'mui-pro/Navbars/AdminNavbar'
import Footer from 'mui-pro/Footer/Footer'
import Sidebar from 'mui-pro/Sidebar/Sidebar'
import FixedPlugin from 'mui-pro/FixedPlugin/FixedPlugin'

import routes from 'mui-pro/mui-routes'
import styles from 'assets/jss/material-dashboard-pro-react/layouts/adminStyle'

let ps

const useStyles = makeStyles(styles)

export default function Dashboard(props) {
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
        [classes.mainPanelWithPerfectScrollbar]:
        navigator.platform.indexOf('Win') > -1,
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
  const getRoute = () => window.location.pathname !== '/admin/full-screen-maps'
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
    if (prop.layout === '/admin') {
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
    }
  }

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText="Creative Tim"
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        bgColor={bgColor}
        miniActive={miniActive}
        {...rest}
      />
      <div className={mainPanelClasses} ref={mainPanel}>
        <AdminNavbar
          sidebarMinimize={sidebarMinimize.bind(this)}
          miniActive={miniActive}
          brandText={getActiveRoute(routes)}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        {/* On the /maps/full-screen-maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
        {getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>
              <Switch>
                {getRoutes(routes)}
                <Redirect from="/admin" to="/admin/dashboard" />
              </Switch>
            </div>
          </div>
        ) : (
          <div className={classes.map}>
            <Switch>
              {getRoutes(routes)}
              <Redirect from="/admin" to="/admin/dashboard" />
            </Switch>
          </div>
        )}
        {getRoute() ? <Footer fluid /> : null}
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
        />
      </div>
    </div>
  )
}
