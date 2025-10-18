/*eslint-disable*/
import React from "react";
// react components used to create a calendar with events on it
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
// dependency plugin for react-big-calendar
import moment from "moment";
// react component used to create alerts
import SweetAlert from "react-bootstrap-sweetalert";

// @mui styles
import { makeStyles } from '@mui/styles'

// core components
import Heading from "mui-pro/Heading/Heading";
import GridContainer from "mui-pro/Grid/GridContainer";
import GridItem from "mui-pro/Grid/GridItem";
import Card from "mui-pro/Card/Card";
import CardBody from "mui-pro/Card/CardBody";

import styles from "assets/jss/material-dashboard-pro-react/components/buttonStyle";

import { events as calendarEvents } from "variables/general";

const localizer = momentLocalizer(moment);

const useStyles = makeStyles(styles);

export default function Calendar() {
  const classes = useStyles();
  const [events, setEvents] = React.useState(calendarEvents);
  const [alert, setAlert] = React.useState(null);
  const selectedEvent = event => {
    window.alert(event.title);
  };
  const addNewEventAlert = slotInfo => {
    setAlert(
      <SweetAlert
        input
        showCancel
        style={{ display: "block", marginTop: "-100px" }}
        title="Input something"
        onConfirm={e => addNewEvent(e, slotInfo)}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.success}
        cancelBtnCssClass={classes.button + " " + classes.danger}
      />
    );
  };
  const addNewEvent = (e, slotInfo) => {
    var newEvents = events;
    newEvents.push({
      title: e,
      start: slotInfo.start,
      end: slotInfo.end
    });
    setAlert(null);
    setEvents(newEvents);
  };
  const hideAlert = () => {
    setAlert(null);
  };
  const eventColors = event => {
    var backgroundColor = "event-";
    event.color
      ? (backgroundColor = backgroundColor + event.color)
      : (backgroundColor = backgroundColor + "default");
    return {
      className: backgroundColor
    };
  };
  return (
    <div>
      <Heading
        textAlign="center"
        title="React Big Calendar"
        category={
          <span>
            A beautiful react component made by{" "}
            <a
              href="https://github.com/intljusticemission?ref=creativetim"
              target="_blank"
            >
              International Justice Mission
            </a>
            . Please checkout their{" "}
            <a
              href="https://github.com/intljusticemission/react-big-calendar?ref=creativetim"
              target="_blank"
            >
              full documentation.
            </a>
          </span>
        }
      />
      {alert}
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={10}>
          <Card>
            <CardBody calendar>
              <BigCalendar
                selectable
                localizer={localizer}
                events={events}
                defaultView="month"
                scrollToTime={new Date(1970, 1, 1, 6)}
                defaultDate={new Date()}
                onSelectEvent={event => selectedEvent(event)}
                onSelectSlot={slotInfo => addNewEventAlert(slotInfo)}
                eventPropGetter={eventColors}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
