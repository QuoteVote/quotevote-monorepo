/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";

// @mui styles + components
import { makeStyles } from '@mui/styles'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// core components
import Heading from "mui-pro/Heading/Heading";
import GridContainer from "mui-pro/Grid/GridContainer";
import GridItem from "mui-pro/Grid/GridItem";
import Card from "mui-pro/Card/Card";
import CardBody from "mui-pro/Card/CardBody";

import styles from "assets/jss/material-dashboard-pro-react/views/iconsStyle";

const useStyles = makeStyles(styles);

export default function Icons() {
  const classes = useStyles();
  const theme = useTheme()
  const showDesktopIframe = useMediaQuery(theme.breakpoints.up('md'))
  const showMobileMessage = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Heading
          textAlign="center"
          title="Material Design Icons"
          category={
            <span>
              Handcrafted by our friends from{" "}
              <a
                target="_blank"
                href="https://design.google.com/icons/?ref=creativetim"
              >
                Google
              </a>
            </span>
          }
        />
        <Card plain>
          <CardBody plain>
            {showDesktopIframe && (
              <iframe
                className={classes.iframe}
                src="https://material.io/icons/"
                title="Icons iframe"
              >
                <p>Your browser does not support iframes.</p>
              </iframe>
            )}
            {showMobileMessage && (
              <GridItem xs={12} sm={12} md={6}>
                <h5>
                  The icons are visible on Desktop mode inside an iframe. Since
                  the iframe is not working on Mobile and Tablets please visit
                  the icons on their original page on Google. Check the
                  <a
                    href="https://design.google.com/icons/?ref=creativetim"
                    target="_blank"
                  >
                    Material Icons
                  </a>
                </h5>
              </GridItem>
            )}
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
