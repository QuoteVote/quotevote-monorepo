import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'
import { tokenValidator } from 'store/user'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styles from 'assets/jss/material-dashboard-pro-react/views/landingPageStyle'
import { Typography } from '@mui/material'
import { isMobile } from 'react-device-detect'
import GridContainer from '../../mui-pro/Grid/GridContainer'
import GridItem from '../../mui-pro/Grid/GridItem'
import PersonalPlanCarousel from '../../components/Carousel/PersonalPlan/PersonalPlanCarousel'
import PersonalPlanHeaderText from '../../components/Carousel/PersonalPlan/PersonalPlanHeaderText'
import BusinessPlanCarousel from '../../components/Carousel/BusinessPlan/BusinessPlanCarousel'
import BusinessHeaderText from '../../components/Carousel/BusinessPlan/BusinessHeaderText'
import InvestorPlanCarousel from '../../components/Carousel/InvestorsPlan/InvestorPlanCarousel'
import InvestorHeaderText from '../../components/Carousel/InvestorsPlan/InvestorHeaderText'

const useStyles = makeStyles(styles)

export const MOBILE_IMAGE_WIDTH = 250

export default function PlanCarouselPage() {
  const classes = useStyles({ isMobile })
  const dispatch = useDispatch()
  const history = useHistory()
  const selectedPlan = useSelector((state) => state.ui.selectedPlan)
  const [carouselCurrentIndex, setCarouselCurrentIndex] = useState(0)

  React.useEffect(() => {
    if (tokenValidator(dispatch)) history.push('/search')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isPersonal = selectedPlan === 'personal'
  const isBusiness = selectedPlan === 'business'
  const isInvestors = selectedPlan === 'investors'

  return (
    <div className={classes.container}>
      <GridContainer justify="center" style={{ marginRight: 24 }}>
        <GridItem xs={12}>
          <Typography
            align="center"
            className={classes.share}
          >
            {isPersonal && <PersonalPlanHeaderText classes={classes} index={carouselCurrentIndex} />}
            {isBusiness && <BusinessHeaderText classes={classes} index={carouselCurrentIndex} />}
            {isInvestors && <InvestorHeaderText classes={classes} index={carouselCurrentIndex} />}
          </Typography>
        </GridItem>
        { isPersonal && <PersonalPlanCarousel classes={classes} setCarouselCurrentIndex={setCarouselCurrentIndex} />}
        { isBusiness && <BusinessPlanCarousel classes={classes} setCarouselCurrentIndex={setCarouselCurrentIndex} />}
        { isInvestors && <InvestorPlanCarousel classes={classes} setCarouselCurrentIndex={setCarouselCurrentIndex} />}
      </GridContainer>
    </div>
  )
}
