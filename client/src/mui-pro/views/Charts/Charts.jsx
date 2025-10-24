/*eslint-disable*/
// react plugin for creating charts
import ChartistGraph from "react-chartist";

// @mui styles / components
import { makeStyles } from '@mui/styles'

// @mui icons
import Timeline from '@mui/icons-material/Timeline'

// core components
import Heading from "mui-pro/Heading/Heading";
import GridContainer from "mui-pro/Grid/GridContainer";
import GridItem from "mui-pro/Grid/GridItem";

import Card from "mui-pro/Card/Card";
import CardHeader from "mui-pro/Card/CardHeader";
import CardIcon from "mui-pro/Card/CardIcon";
import CardBody from "mui-pro/Card/CardBody";
import CardFooter from "mui-pro/Card/CardFooter";

import {
  roundedLineChart,
  straightLinesChart,
  simpleBarChart,
  colouredLineChart,
  multipleBarsChart,
  colouredLinesChart,
  pieChart
} from "@/variables/charts";

import styles from "assets/jss/material-dashboard-pro-react/views/chartsStyle";

const useStyles = makeStyles(styles);

export default function Charts() {
  const classes = useStyles();
  return (
    <div>
      <Heading
        textAlign="center"
        title="React Chartist"
        category={
          <span>
            A react wrapper for{" "}
            <a
              target="_blank"
              href="https://gionkunz.github.io/chartist/?ref=creativetim"
            >
              Chartist
            </a>
            . Please checkout the{" "}
            <a
              href="https://gionkunz.github.io/chartist/getting-started.html?ref=creativetim"
              target="_blank"
            >
              full documentation of Chartist
            </a>{" "}
            and{" "}
            <a
              href="https://fraserxu.me/react-chartist/?ref=creativetim"
              target="_blank"
            >
              full documentation of react-chartist
            </a>
            .
          </span>
        }
      />
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="rose">
              <ChartistGraph
                className="ct-chart-white-colors"
                data={roundedLineChart.data}
                type="Line"
                options={roundedLineChart.options}
                listener={roundedLineChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Rounded Line Chart</h4>
              <p className={classes.cardCategory}>Line Chart</p>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="warning">
              <ChartistGraph
                className="ct-chart-white-colors"
                data={straightLinesChart.data}
                type="Line"
                options={straightLinesChart.options}
                listener={straightLinesChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Straight Lines Chart</h4>
              <p className={classes.cardCategory}>Line Chart with Points</p>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="info">
              <ChartistGraph
                className="ct-chart-white-colors"
                data={simpleBarChart.data}
                type="Bar"
                options={simpleBarChart.options}
                responsiveOptions={simpleBarChart.responsiveOptions}
                listener={simpleBarChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Simple Bar Chart</h4>
              <p className={classes.cardCategory}>Bar Chart</p>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="info" icon>
              <CardIcon color="info">
                <Timeline />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>
                Coloured Line Chart <small>- Rounded</small>
              </h4>
            </CardHeader>
            <CardBody>
              <ChartistGraph
                data={colouredLineChart.data}
                type="Line"
                options={colouredLineChart.options}
                listener={colouredLineChart.animation}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="rose" icon>
              <CardIcon color="rose">
                <Timeline />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>
                Multiple Bars Chart <small>- Bar Chart</small>
              </h4>
            </CardHeader>
            <CardBody>
              <ChartistGraph
                data={multipleBarsChart.data}
                type="Bar"
                options={multipleBarsChart.options}
                listener={multipleBarsChart.animation}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={7}>
          <Card>
            <CardHeader color="warning" icon>
              <CardIcon color="warning">
                <Timeline />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>
                Coloured Lines Chart <small>- Rounded</small>
              </h4>
            </CardHeader>
            <CardBody>
              <ChartistGraph
                data={colouredLinesChart.data}
                type="Line"
                options={colouredLinesChart.options}
                listener={colouredLinesChart.animation}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={5}>
          <Card>
            <CardHeader color="danger" icon>
              <CardIcon color="danger">
                <Timeline />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>Pie Chart</h4>
            </CardHeader>
            <CardBody>
              <ChartistGraph
                data={pieChart.data}
                type="Pie"
                options={pieChart.options}
              />
            </CardBody>
            <CardFooter stats className={classes.cardFooter}>
              <h6 className={classes.legendTitle}>Legend</h6>
              <i className={"fas fa-circle " + classes.info} /> Apple{` `}
              <i className={"fas fa-circle " + classes.warning} /> Samsung
              {` `}
              <i className={"fas fa-circle " + classes.danger} /> Windows Phone
              {` `}
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
