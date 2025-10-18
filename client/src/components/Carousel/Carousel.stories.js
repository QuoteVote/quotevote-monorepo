import React from 'react'
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import Carousel from './Carousel'

export default {
  component: Carousel,
  title: 'Carousel',
}
const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    alignItems: 'center',
  },
  img: {
    flexGrow: 1,
    height: 255,
    maxWidth: 400,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}))
const tutorialSteps = [
  {
    label: 'San Francisco – Oakland Bay Bridge, United States',
    imgPath:
      'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60',
  },
  {
    label: 'Bird',
    imgPath:
      'https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60',
  },
  {
    label: 'Bali, Indonesia',
    imgPath:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250&q=80',
  },
  {
    label: 'NeONBRAND Digital Marketing, Las Vegas, United States',
    imgPath:
      'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&w=400&h=250&q=60',
  },
  {
    label: 'Goč, Serbia',
    imgPath:
      'https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60',
  },
]

function CarouselWrapper(props) {
  const classes = useStyles()
  return (
    <Carousel {...props}>
      {tutorialSteps.map((step) => (
        <div key={step.label}>
          <img className={classes.img} src={step.imgPath} alt={step.label} />
        </div>
      ))}
    </Carousel>
  )
}

export const Base = () => <CarouselWrapper />

export const HiddenNavButtons = () => <CarouselWrapper navButtonsAlwaysVisible={false} />

export const NonAutoPlay = () => <CarouselWrapper navButtonsAlwaysVisible={false} autoplay={false} />

export const CustomActiveStepIndex = () => {
  const [activeStepProp, setActiveStepProp] = React.useState(0)
  const handleNext = () => {
    setActiveStepProp((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStepProp((prevActiveStep) => prevActiveStep - 1)
  }
  return (
    <div>
      <CarouselWrapper
        navButtonsAlwaysVisible={false}
        autoplay={false}
        activeStepProp={activeStepProp}
        setActiveStepProp={setActiveStepProp}
      />
      <Button size="small" onClick={handleNext}>
        Next
      </Button>
      <Button size="small" onClick={handleBack}>
        Back
      </Button>
    </div>
  )
}
