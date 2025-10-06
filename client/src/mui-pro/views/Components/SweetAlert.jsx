/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
// react component used to create sweet alerts
import SweetAlert from "react-bootstrap-sweetalert";

// @mui styles
import { makeStyles } from '@mui/styles'

// core components
import Heading from "mui-pro/Heading/Heading";
import GridContainer from "mui-pro/Grid/GridContainer";
import GridItem from "mui-pro/Grid/GridItem";
import Button from "mui-pro/CustomButtons/Button";
import Card from "mui-pro/Card/Card";
import CardBody from "mui-pro/Card/CardBody";

import styles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle";

const useStyles = makeStyles(styles);

export default function SweetAlertPage() {
  const classes = useStyles();
  const [alert, setAlert] = React.useState(null);
  const [inputValue, setInputValue] = React.useState(null);
  const basicAlert = () => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Here's a message!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.success}
      />
    );
  };
  const titleAndTextAlert = () => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Here's a message!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.info}
      >
        It{"'"}s pretty, isn{"'"}t it?
      </SweetAlert>
    );
  };
  const successAlert = () => {
    setAlert(
      <SweetAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Good job!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.success}
      >
        You clicked the button!
      </SweetAlert>
    );
  };
  const htmlAlert = () => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="HTML example"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.success}
      >
        You can use <b>bold</b> text,{" "}
        <a
          href="https://www.creative-tim.com/?ref=mdpr-sweetalert-page"
          target="_blank"
        >
          links
        </a>{" "}
        and other HTML tags
      </SweetAlert>
    );
  };
  const warningWithConfirmMessage = () => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => successDelete()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.success}
        cancelBtnCssClass={classes.button + " " + classes.danger}
        confirmBtnText="Yes, delete it!"
        cancelBtnText="Cancel"
        showCancel
      >
        You will not be able to recover this imaginary file!
      </SweetAlert>
    );
  };
  const warningWithConfirmAndCancelMessage = () => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => successDelete()}
        onCancel={() => cancelDetele()}
        confirmBtnCssClass={classes.button + " " + classes.success}
        cancelBtnCssClass={classes.button + " " + classes.danger}
        confirmBtnText="Yes, delete it!"
        cancelBtnText="Cancel"
        showCancel
      >
        You will not be able to recover this imaginary file!
      </SweetAlert>
    );
  };
  const autoCloseAlert = () => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Auto close alert!"
        onConfirm={() => hideAlert()}
        showConfirm={false}
      >
        I will close in 2 seconds.
      </SweetAlert>
    );
    setTimeout(hideAlert, 2000);
  };
  const inputAlert = () => {
    setAlert(
      <SweetAlert
        input
        showCancel
        style={{ display: "block", marginTop: "-100px" }}
        title="Input something"
        onConfirm={e => {
          inputConfirmAlertNext(e);
        }}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.info}
        cancelBtnCssClass={classes.button + " " + classes.danger}
      />
    );
  };
  // const inputConfirmAlert = e => {
  //   console.log(e);
  //   setInputValue(e);
  //   setAlert(null);
  //   console.log(inputValue,alert);
  //   setTimeout(() => {
  //     inputConfirmAlertNext();
  //   }, 5000);
  // };
  const inputConfirmAlertNext = e => {
    setAlert(e);
    setTimeout(() => {
      setAlert(
        <SweetAlert
          style={{ display: "block", marginTop: "-100px" }}
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnCssClass={classes.button + " " + classes.info}
          title={
            <p>
              You entered: <b>{e}</b>
            </p>
          }
        />
      );
    }, 200);
  };
  const successDelete = () => {
    setAlert(
      <SweetAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Deleted!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.success}
      >
        Your imaginary file has been deleted.
      </SweetAlert>
    );
  };
  const cancelDetele = () => {
    setAlert(
      <SweetAlert
        danger
        style={{ display: "block", marginTop: "-100px" }}
        title="Cancelled"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={classes.button + " " + classes.success}
      >
        Your imaginary file is safe :)
      </SweetAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };
  return (
    <div>
      <Heading
        textAlign="center"
        title="Sweet Alert"
        category={
          <span>
            A beautiful plugin, that replace the classic alert, Handcrafted by
            our friend{" "}
            <a
              target="_blank"
              href="https://github.com/djorg83?ref=creativetim"
            >
              Daniel Jorgensen
            </a>
            . Please check out the{" "}
            <a
              href="https://github.com/djorg83/react-bootstrap-sweetalert?ref=creativetim"
              target="_blank"
            >
              full documentation.
            </a>
            .
          </span>
        }
      />
      {alert}
      <GridContainer>
        <GridItem xs={12} sm={12} md={3}>
          <Card>
            <CardBody>
              <div className={classes.center}>
                <h5>Basic example</h5>
                <Button color="rose" onClick={basicAlert}>
                  Try me!
                </Button>
              </div>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={3}>
          <Card>
            <CardBody>
              <div className={classes.center}>
                <h5>A title with a text under</h5>
                <Button color="rose" onClick={titleAndTextAlert}>
                  Try me!
                </Button>
              </div>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={3}>
          <Card>
            <CardBody>
              <div className={classes.center}>
                <h5>A success message</h5>
                <Button color="rose" onClick={successAlert}>
                  Try me!
                </Button>
              </div>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={3}>
          <Card>
            <CardBody>
              <div className={classes.center}>
                <h5>Custom HTML description</h5>
                <Button color="rose" onClick={htmlAlert}>
                  Try me!
                </Button>
              </div>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={3}>
          <Card>
            <CardBody>
              <div className={classes.center}>
                <h5>
                  A warning message, with a function attached to the {'"'}
                  Confirm{'"'}
                  Button...
                </h5>
                <Button color="rose" onClick={warningWithConfirmMessage}>
                  Try me!
                </Button>
              </div>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={3}>
          <Card>
            <CardBody>
              <div className={classes.center}>
                <h5>
                  ...and by passing a parameter, you can execute something else
                  for {'"'}Cancel{'"'}
                </h5>
                <Button
                  color="rose"
                  onClick={warningWithConfirmAndCancelMessage}
                >
                  Try me!
                </Button>
              </div>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={3}>
          <Card>
            <CardBody>
              <div className={classes.center}>
                <h5>A message with auto close timer set to 2 seconds</h5>
                <Button color="rose" onClick={autoCloseAlert}>
                  Try me!
                </Button>
              </div>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={3}>
          <Card>
            <CardBody>
              <div className={classes.center}>
                <h5>Modal window with input field</h5>
                <Button color="rose" onClick={inputAlert}>
                  Try me!
                </Button>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
