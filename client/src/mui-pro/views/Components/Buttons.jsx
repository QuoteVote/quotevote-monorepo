import React from 'react'

// @material-ui/core components
import { makeStyles } from '@mui/styles'

// @material-ui/icons
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import PriorityHigh from '@mui/icons-material/PriorityHigh'
import Check from '@mui/icons-material/Check'
import Warning from '@mui/icons-material/Warning'
import Close from '@mui/icons-material/Close'
import Favorite from '@mui/icons-material/Favorite'

// core components
import GridContainer from 'mui-pro/Grid/GridContainer'
import GridItem from 'mui-pro/Grid/GridItem'
import Pagination from 'mui-pro/Pagination/Pagination'
import Button from 'mui-pro/CustomButtons/Button'
import Card from 'mui-pro/Card/Card'
import CardBody from 'mui-pro/Card/CardBody'

import styles from 'assets/jss/material-dashboard-pro-react/views/buttonsStyle'

const useStyles = makeStyles(styles)

export default function Buttons() {
  const classes = useStyles()
  return (
    <Card>
      <CardBody>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <div className={classes.cardHeader}>
              <h4 className={classes.cardTitle}>Pick your Color</h4>
            </div>
            <div className={classes.cardContentLeft}>
              <Button className={classes.marginRight}>Default</Button>
              <Button color="primary" className={classes.marginRight}>
                Primary
              </Button>
              <Button color="info" className={classes.marginRight}>
                Info
              </Button>
              <Button color="success" className={classes.marginRight}>
                Success
              </Button>
              <Button color="warning" className={classes.marginRight}>
                Warning
              </Button>
              <Button color="danger" className={classes.marginRight}>
                Danger
              </Button>
              <Button color="rose" className={classes.marginRight}>
                Rose
              </Button>
            </div>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <div className={classes.cardHeader}>
              <h4 className={classes.cardTitle}>Buttons with Label</h4>
            </div>
            <div className={classes.cardContentRight}>
              <Button className={classes.marginRight}>
                <KeyboardArrowLeft className={classes.icons} />
                {' '}
                Left
              </Button>
              <Button className={classes.marginRight}>
                Right
                {' '}
                <KeyboardArrowRight className={classes.icons} />
              </Button>
              <Button color="info" className={classes.marginRight}>
                <PriorityHigh className={classes.icons} />
                {' '}
                Info
              </Button>
              <Button color="success" className={classes.marginRight}>
                <Check className={classes.icons} />
                {' '}
                Success
              </Button>
              <Button color="warning" className={classes.marginRight}>
                <Warning className={classes.icons} />
                {' '}
                Warning
              </Button>
              <Button color="danger" className={classes.marginRight}>
                <Close className={classes.icons} />
                {' '}
                Danger
              </Button>
            </div>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <div className={classes.cardHeader}>
              <h4 className={classes.cardTitle}>Pick your Size</h4>
            </div>
            <div className={classes.cardContentLeft}>
              <Button color="primary" size="sm" className={classes.marginRight}>
                Small
              </Button>
              <Button color="primary" className={classes.marginRight}>
                Regular
              </Button>
              <Button color="primary" size="lg" className={classes.marginRight}>
                Large
              </Button>
            </div>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <div className={classes.cardHeader}>
              <h4 className={classes.cardTitle}>Pick your Style</h4>
            </div>
            <div className={classes.cardContentRight}>
              <Button color="primary" className={classes.marginRight}>
                Default
              </Button>
              <Button color="primary" round className={classes.marginRight}>
                round
              </Button>
              <Button color="primary" round className={classes.marginRight}>
                <Favorite className={classes.icons} />
                {' '}
                with icon
              </Button>
              <Button
                justIcon
                round
                color="primary"
                className={classes.marginRight}
              >
                <Favorite className={classes.icons} />
              </Button>
              <Button color="primary" simple className={classes.marginRight}>
                simple
              </Button>
            </div>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <div className={classes.cardHeader}>
              <h4 className={classes.cardTitle}>Pagination</h4>
            </div>
            <div className={classes.cardContentLeft}>
              <Pagination
                pages={[
                  { text: 1 },
                  { text: '...' },
                  { text: 5 },
                  { text: 6 },
                  { active: true, text: 7 },
                  { text: 8 },
                  { text: 9 },
                  { text: '...' },
                  { text: 12 },
                ]}
              />
              <Pagination
                pages={[
                  { text: 'PREV' },
                  { text: 1 },
                  { text: 2 },
                  { active: true, text: 3 },
                  { text: 4 },
                  { text: 5 },
                  { text: 'NEXT' },
                ]}
                color="info"
              />
            </div>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <div className={classes.cardHeader}>
              <h4 className={classes.cardTitle}>Button Group</h4>
            </div>
            <div className={classes.cardContentRight}>
              <div className={classes.buttonGroup}>
                <Button color="info" className={classes.firstButton}>
                  Left
                </Button>
                <Button color="info" className={classes.middleButton}>
                  Middle
                </Button>
                <Button color="info" className={classes.lastButton}>
                  Right
                </Button>
              </div>
              <br />
              <br />
              <div className={classes.buttonGroup}>
                <Button color="info" round className={classes.firstButton}>
                  1
                </Button>
                <Button color="info" round className={classes.middleButton}>
                  2
                </Button>
                <Button color="info" round className={classes.middleButton}>
                  3
                </Button>
                <Button color="info" round className={classes.lastButton}>
                  4
                </Button>
              </div>
              {' '}
              <div className={classes.buttonGroup}>
                <Button color="info" round className={classes.firstButton}>
                  5
                </Button>
                <Button color="info" round className={classes.middleButton}>
                  6
                </Button>
                <Button color="info" round className={classes.lastButton}>
                  7
                </Button>
              </div>
            </div>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12}>
            <div className={classes.cardHeader}>
              <h4 className={classes.cardTitle}>Social buttons</h4>
            </div>
            <div className={classes.cardContentBottom}>
              <GridContainer>
                <GridItem xs={12} sm={4} md={4}>
                  <Button color="twitter">
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-twitter`
                      }
                    />
                    {' '}
                    Connect with Twitter
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon color="twitter">
                    <i className="fab fa-twitter" />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon round color="twitter">
                    <i
                      className={`${classes.socialButtonsIcons} fab fa-twitter`}
                    />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon color="twitter" simple>
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-twitter`
                      }
                    />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={4} md={3}>
                  <Button color="twitter" simple>
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-twitter`
                      }
                    />
                    {' '}
                    Connect with Twitter
                  </Button>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={4} md={4}>
                  <Button color="facebook">
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-facebook-square`
                      }
                    />
                    {' '}
                    Share · 2.2k
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon color="facebook">
                    <i className="fab fa-facebook" />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon round color="facebook">
                    <i
                      className={
                        `${classes.socialButtonsIcons} fab fa-facebook`
                      }
                    />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon color="facebook" simple>
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-facebook-square`
                      }
                    />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={4} md={3}>
                  <Button color="facebook" simple>
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-facebook-square`
                      }
                    />
                    {' '}
                    Share · 2.2k
                  </Button>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={4} md={4}>
                  <Button color="google">
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-google-plus-g`
                      }
                    />
                    {' '}
                    Share on Google+
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon color="google">
                    <i className="fab fa-google" />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon round color="google">
                    <i
                      className={`${classes.socialButtonsIcons} fab fa-google`}
                    />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon color="google" simple>
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-google`
                      }
                    />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={4} md={3}>
                  <Button color="google" simple>
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-google-plus-g`
                      }
                    />
                    {' '}
                    Share on Google+
                  </Button>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={4} md={4}>
                  <Button color="linkedin">
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-linkedin`
                      }
                    />
                    {' '}
                    Connect with Linkedin
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon color="linkedin">
                    <i className="fab fa-linkedin" />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon round color="linkedin">
                    <i
                      className={
                        `${classes.socialButtonsIcons} fab fa-linkedin`
                      }
                    />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon color="linkedin" simple>
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-linkedin`
                      }
                    />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={4} md={3}>
                  <Button color="linkedin" simple>
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-linkedin`
                      }
                    />
                    {' '}
                    Connect with Linkedin
                  </Button>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={4} md={4}>
                  <Button color="pinterest">
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-pinterest`
                      }
                    />
                    {' '}
                    Pint it · 212
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon color="pinterest">
                    <i className="fab fa-pinterest" />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon round color="pinterest">
                    <i
                      className={
                        `${classes.socialButtonsIcons} fab fa-pinterest`
                      }
                    />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon color="pinterest" simple>
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-pinterest`
                      }
                    />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={4} md={3}>
                  <Button color="pinterest" simple>
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-pinterest`
                      }
                    />
                    {' '}
                    Pint it · 212
                  </Button>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={4} md={4}>
                  <Button color="youtube">
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-youtube`
                      }
                    />
                    {' '}
                    View on Youtube
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon color="youtube">
                    <i className="fab fa-youtube-square" />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon round color="youtube">
                    <i
                      className={
                        `${classes.socialButtonsIcons} fab fa-youtube-square`
                      }
                    />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon color="youtube" simple>
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-youtube-square`
                      }
                    />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={4} md={3}>
                  <Button color="youtube" simple>
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-youtube`
                      }
                    />
                    {' '}
                    View on Youtube
                  </Button>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={4} md={4}>
                  <Button color="tumblr">
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-tumblr-square`
                      }
                    />
                    {' '}
                    Repost
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon color="tumblr">
                    <i className="fab fa-tumblr-square" />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon round color="tumblr">
                    <i
                      className={
                        `${classes.socialButtonsIcons} fab fa-tumblr-square`
                      }
                    />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon color="tumblr" simple>
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-tumblr-square`
                      }
                    />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={4} md={3}>
                  <Button color="tumblr" simple>
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-tumblr-square`
                      }
                    />
                    {' '}
                    Repost
                  </Button>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={4} md={4}>
                  <Button color="github">
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-github`
                      }
                    />
                    {' '}
                    Connect with Github
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon color="github">
                    <i className="fab fa-github" />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon round color="github">
                    <i
                      className={`${classes.socialButtonsIcons} fab fa-github`}
                    />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon color="github" simple>
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-github`
                      }
                    />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={4} md={3}>
                  <Button color="github" simple>
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-github`
                      }
                    />
                    {' '}
                    Connect with Github
                  </Button>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={4} md={4}>
                  <Button color="behance">
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-behance-square`
                      }
                    />
                    {' '}
                    Follow us
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon color="behance">
                    <i className="fab fa-behance" />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon round color="behance">
                    <i
                      className={
                        `${classes.socialButtonsIcons} fab fa-behance-square`
                      }
                    />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon color="behance" simple>
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-behance`
                      }
                    />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={4} md={3}>
                  <Button color="behance" simple>
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-behance-square`
                      }
                    />
                    {' '}
                    Follow us
                  </Button>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={4} md={4}>
                  <Button color="dribbble">
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-dribbble`
                      }
                    />
                    {' '}
                    Find us on Dribble
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon color="dribbble">
                    <i className="fab fa-dribbble" />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon round color="dribbble">
                    <i
                      className={
                        `${classes.socialButtonsIcons} fab fa-dribbble`
                      }
                    />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon color="dribbble" simple>
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-dribbble`
                      }
                    />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={4} md={3}>
                  <Button color="dribbble" simple>
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-dribbble`
                      }
                    />
                    {' '}
                    Find us on Dribble
                  </Button>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={4} md={4}>
                  <Button color="reddit">
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-reddit`
                      }
                    />
                    {' '}
                    Repost · 232
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon color="reddit">
                    <i className="fab fa-reddit" />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon round color="reddit">
                    <i
                      className={`${classes.socialButtonsIcons} fab fa-reddit`}
                    />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={1} md={1}>
                  <Button justIcon color="reddit" simple>
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-reddit`
                      }
                    />
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={4} md={3}>
                  <Button color="reddit" simple>
                    <i
                      className={
                        `${classes.socialButtonsIcons
                        } ${
                          classes.marginRight
                        } fab fa-reddit`
                      }
                    />
                    {' '}
                    Repost · 232
                  </Button>
                </GridItem>
              </GridContainer>
            </div>
          </GridItem>
        </GridContainer>
      </CardBody>
    </Card>
  )
}
