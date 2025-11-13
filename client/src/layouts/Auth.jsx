/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable consistent-return */
import React, { useMemo } from 'react'
import { Switch, Route } from 'react-router-dom'

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'

// core components
import AuthNavbar from 'mui-pro/Navbars/AuthNavbar'
import Footer from 'mui-pro/Footer/Footer'

import routes from 'mui-pro/mui-routes'

import styles from 'assets/jss/material-dashboard-pro-react/layouts/authStyle'

import InfoSections from 'components/RequestAccess/InfoSections'
import { useAuthModal } from '../Context/AuthModalContext'
import RequestInviteDialog from '../components/RequestInviteDialog'

const useStyles = makeStyles(styles)

// Available background images
const backgroundImages = [
  'viviana-rishe-UC8fvOyG5pU-unsplash.jpg',
  'steph-smith-3jYcQf9oiJ8-unsplash.jpg',
  'sergio-rodriguez-rrlEOXRmMAA-unsplash.jpg',
  'sergio-otoya-gCNh426vB30-unsplash.jpg',
  'rondell-chaz-mabunga-EHLKkMDxe3M-unsplash.jpg',
  'rommel-paras-wrHnE3kMplg-unsplash.jpg',
  'peter-thomas-efLcMHXtrg0-unsplash.jpg',
  'julia-caesar-jeXkw2HR1SU-unsplash.jpg',
  'ehmir-bautista-JjDqyWuWZyU-unsplash.jpg',
  'adam-navarro-qXcl3z7_AOc-unsplash.jpg',
  'actionvance-guy5aS3GvgA-unsplash.jpg',
]

export default function Pages(props) {
  // const isRequestAccess = window.location.pathname.indexOf('/auth/request-access') !== -1
  const { ...rest } = props
  // ref for the wrapper div
  const wrapper = React.createRef()
  // styles
  const classes = useStyles()
  const { isModalOpen, closeAuthModal } = useAuthModal()

  // State to store the selected background image
  const [selectedBackground, setSelectedBackground] = React.useState(null)

  React.useEffect(() => {
    document.body.style.overflow = 'unset'

    // Select a random background image on first load
    if (!selectedBackground) {
      const randomIndex = Math.floor(Math.random() * backgroundImages.length)
      setSelectedBackground(backgroundImages[randomIndex])
    }

    // Specify how to clean up after this effect:
    return function cleanup() {}
  }, [selectedBackground])

  const getRoutes = (routesParameter) =>
    routesParameter.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views)
      }
      if (prop.layout === '/auth') {
        // console.log('Creating route:', prop.layout + prop.path, 'for component:', prop.component.name)
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

  const getActiveRoute = (routesParameter) => {
    const activeRoute = { name: 'Default Brand Text' }
    for (let i = 0; i < routesParameter.length; i++) {
      if (routesParameter[i].collapse) {
        const collapseActiveRoute = getActiveRoute(routesParameter[i].views)
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute
        }
      } else if (
        window.location.href.indexOf(
          routesParameter[i].layout + routesParameter[i].path,
        ) !== -1
      ) {
        return routesParameter[i]
      }
    }
    return activeRoute
  }

  const showRequestAccessFooter = useMemo(
    () => window.location.pathname.includes('request-access'),
    [window.location.pathname],
  )

  return (
    <div
      className={classes.content}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      {/* Header */}
      {getActiveRoute(routes)?.hideNavbar ? null : (
        <div>
          <AuthNavbar brandText={getActiveRoute(routes)?.name} {...rest} />
        </div>
      )}
      {/* Body - takes full remaining height */}
      <div
        style={{
          flex: '1 1 auto',
          minHeight: 0,
          overflow: 'auto',
          width: '100%',
          backgroundImage: selectedBackground
            ? `url('/assets/bg/${selectedBackground}')`
            : `url('/assets/Mountain.png')`,
          backgroundPosition: 'left',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className={classes.wrapper} ref={wrapper} style={{}}>
          <div
            className={classes.cardContainer}
            style={{ position: 'relative', zIndex: 3 }}
          >
            <div className={classes.fullPage}>
              <Switch>{getRoutes(routes)}</Switch>
            </div>
          </div>
        </div>
      </div>
      {/* Footer - always at bottom */}
      {showRequestAccessFooter || getActiveRoute(routes)?.hideNavbar ? null : (
        <div>
          <Footer white />
        </div>
      )}
      {/* InfoSections - only on request-access page */}
      {window.location.pathname === '/auth/request-access' && (
        <div>
          <InfoSections />
        </div>
      )}
      <RequestInviteDialog open={isModalOpen} onClose={closeAuthModal} />
    </div>
  )
}
