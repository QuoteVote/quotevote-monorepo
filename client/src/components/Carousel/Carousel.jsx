import React from 'react'
import { createTheme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import { ThemeProvider, useTheme } from '@mui/material'
import MobileStepper from '@mui/material/MobileStepper'
import Button from '@mui/material/Button'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import SwipeableViews from 'react-swipeable-views'
import { autoPlay } from 'react-swipeable-views-utils'
import PropTypes from 'prop-types'

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#52b274',
    },
  },
  typography: {
    useNextVariants: true,
  },
})
const AutoPlaySwipeableViews = autoPlay(SwipeableViews)

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
    overflowX: 'hidden',
    flexGrow: 1,
    alignContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: 0,
    margin: 0,
  },
  content: {
    alignContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  navigationButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 10,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  backButton: {
    left: 10,
  },
  nextButton: {
    right: 10,
  },
  stepperContainer: {
    position: 'absolute',
    bottom: 10,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
  },
}))

function SwipeableTextMobileStepper({
  navButtonsAlwaysVisible, children, autoplay, activeStepProp, setActiveStepProp,
}) {
  const classes = useStyles()
  const theme = useTheme()
  const [activeStep, setActiveStep] = React.useState(activeStepProp)
  const maxSteps = children.length

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleStepChange = (step) => {
    setActiveStep(step)
    if (step !== activeStepProp) {
      setActiveStepProp?.(step)
    }
  }

  React.useEffect(() => {
    setActiveStep(activeStepProp)
  }, [activeStepProp])

  const navButtonsVisibility = navButtonsAlwaysVisible ? 'visible' : 'hidden'
  
  return (
    <div className={classes.root}>
      {/* Side Navigation Buttons */}
      <Button 
        size="small" 
        onClick={handleBack} 
        disabled={activeStep === 0} 
        style={{ visibility: navButtonsVisibility }}
        className={`${classes.navigationButton} ${classes.backButton}`}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </Button>
      
      <Button 
        size="small" 
        onClick={handleNext} 
        disabled={activeStep === maxSteps - 1} 
        style={{ visibility: navButtonsVisibility }}
        className={`${classes.navigationButton} ${classes.nextButton}`}
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </Button>

      {/* Carousel Content */}
      {autoplay && (
        <AutoPlaySwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {children.map((child, index) => (
            <div key={index} className={classes.content}>
              {child}
            </div>
          ))}
        </AutoPlaySwipeableViews>
      )}

      {!autoplay && (
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {children.map((child, index) => (
            <div key={index} className={classes.content}>
              {child}
            </div>
          ))}
        </SwipeableViews>
      )}

      {/* Dots Indicator */}
      <div className={classes.stepperContainer}>
        <MuiThemeProvider theme={customTheme}>
          <MobileStepper
            steps={maxSteps}
            position="static"
            variant="dots"
            activeStep={activeStep}
            style={{
              backgroundColor: 'transparent',
              boxShadow: 'none',
            }}
            nextButton={null}
            backButton={null}
          />
        </MuiThemeProvider>
      </div>
    </div>
  )
}
SwipeableTextMobileStepper.defaultProps = {
  navButtonsAlwaysVisible: true,
  autoplay: true,
  activeStepProp: 0,
}
SwipeableTextMobileStepper.propTypes = {
  navButtonsAlwaysVisible: PropTypes.bool,
  children: PropTypes.any,
  autoplay: PropTypes.bool,
  activeStepProp: PropTypes.number,
  setActiveStepProp: PropTypes.func,
}

export default SwipeableTextMobileStepper
