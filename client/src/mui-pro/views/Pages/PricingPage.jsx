import React from 'react'

// @material-ui/core components
import { makeStyles } from '@mui/styles'
import Icon from '@mui/material/Icon'

// @material-ui/icons
// import Weekend from '@mui/icons-material/Weekend';
import Home from '@mui/icons-material/Home'
import Business from '@mui/icons-material/Business'
import AccountBalance from '@mui/icons-material/AccountBalance'

// core components
import GridContainer from 'mui-pro/Grid/GridContainer'
import GridItem from 'mui-pro/Grid/GridItem'
import Button from 'mui-pro/CustomButtons/Button'
import Card from 'mui-pro/Card/Card'
import CardBody from 'mui-pro/Card/CardBody'

import styles from 'assets/jss/material-dashboard-pro-react/views/pricingPageStyle'

const useStyles = makeStyles(styles)

export default function PricingPage() {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={6}>
          <h2 className={classes.title}>Pick the best plan for you</h2>
          <h5 className={classes.description}>
            You have Free Unlimited Updates and Premium Support on each package.
          </h5>
        </GridItem>
      </GridContainer>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={3}>
          <Card pricing plain>
            <CardBody pricing plain>
              <h6 className={classes.cardCategory}>Freelancer</h6>
              <div className={classes.icon}>
                <Icon className={classes.iconWhite}>weekend</Icon>
              </div>
              <h3
                className={`${classes.cardTitleWhite} ${classes.marginTop30}`}
              >
                FREE
              </h3>
              <p className={classes.cardCategory}>
                This is good if your company size is between 2 and 10 Persons.
              </p>
              <Button round color="white">
                Choose plan
              </Button>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={3}>
          <Card pricing raised>
            <CardBody pricing>
              <h6 className={classes.cardCategory}>SMALL COMPANY</h6>
              <div className={classes.icon}>
                <Home className={classes.iconRose} />
              </div>
              <h3 className={`${classes.cardTitle} ${classes.marginTop30}`}>
                $29
              </h3>
              <p className={classes.cardDescription}>
                This is good if your company size is between 2 and 10 Persons.
              </p>
              <Button round color="rose">
                Choose plan
              </Button>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={3}>
          <Card pricing plain>
            <CardBody pricing plain>
              <h6 className={classes.cardCategory}>MEDIUM COMPANY</h6>
              <div className={classes.icon}>
                <Business className={classes.iconWhite} />
              </div>
              <h3
                className={`${classes.cardTitleWhite} ${classes.marginTop30}`}
              >
                $69
              </h3>
              <p className={classes.cardCategory}>
                This is good if your company size is between 11 and 99 Persons.
              </p>
              <Button round color="white">
                Choose plan
              </Button>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={3}>
          <Card pricing plain>
            <CardBody pricing plain>
              <h6 className={classes.cardCategory}>ENTERPRISE</h6>
              <div className={classes.icon}>
                <AccountBalance className={classes.iconWhite} />
              </div>
              <h3
                className={`${classes.cardTitleWhite} ${classes.marginTop30}`}
              >
                $159
              </h3>
              <p className={classes.cardCategory}>
                This is good if your company size is 99+ persons.
              </p>
              <Button round color="white">
                Choose plan
              </Button>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  )
}
