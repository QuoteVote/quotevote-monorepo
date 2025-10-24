/*eslint-disable*/
import React from "react";
// @mui styles + components
import { makeStyles } from '@mui/styles'
import Slide from '@mui/material/Slide'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// @mui icons
import AddAlert from '@mui/icons-material/AddAlert'
import Close from '@mui/icons-material/Close'

// core components
import Heading from "mui-pro/Heading/Heading";
import GridContainer from "mui-pro/Grid/GridContainer";
import GridItem from "mui-pro/Grid/GridItem";
import SnackbarContent from "mui-pro/Snackbar/SnackbarContent";
import Button from "mui-pro/CustomButtons/Button";
import Snackbar from "mui-pro/Snackbar/Snackbar";
import Instruction from "mui-pro/Instruction/Instruction";
import Card from "mui-pro/Card/Card";
import CardBody from "mui-pro/Card/CardBody";

import styles from "assets/jss/material-dashboard-pro-react/views/notificationsStyle";

// import noticeModal1 from "/assets/card-1.jpeg";
// import noticeModal2 from "/assets/card-2.jpeg";

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function Notifications() {
  const classes = useStyles();
  const [tl, setTL] = React.useState(false);
  const [tc, setTC] = React.useState(false);
  const [tr, setTR] = React.useState(false);
  const [bl, setBL] = React.useState(false);
  const [bc, setBC] = React.useState(false);
  const [br, setBR] = React.useState(false);
  const [classicModal, setClassicModal] = React.useState(false);
  const [noticeModal, setNoticeModal] = React.useState(false);
  const [smallModal, setSmallModal] = React.useState(false);
  React.useEffect(() => {
    // Specify how to clean up after this effect:
    return function cleanup() {
      // to stop the warning of calling setState of unmounted component
      var id = window.setTimeout(null, 0);
      while (id--) {
        window.clearTimeout(id);
      }
    };
  });
  const showNotification = place => {
    switch (place) {
      case "tl":
        if (!tl) {
          setTL(true);
          setTimeout(function() {
            setTL(false);
          }, 6000);
        }
        break;
      case "tc":
        if (!tc) {
          setTC(true);
          setTimeout(function() {
            setTC(false);
          }, 6000);
        }
        break;
      case "tr":
        if (!tr) {
          setTR(true);
          setTimeout(function() {
            setTR(false);
          }, 6000);
        }
        break;
      case "bl":
        if (!bl) {
          setBL(true);
          setTimeout(function() {
            setBL(false);
          }, 6000);
        }
        break;
      case "bc":
        if (!bc) {
          setBC(true);
          setTimeout(function() {
            setBC(false);
          }, 6000);
        }
        break;
      case "br":
        if (!br) {
          setBR(true);
          setTimeout(function() {
            setBR(false);
          }, 6000);
        }
        break;
      default:
        break;
    }
  };
  return (
    <div>
      <Heading
        title="Notifications"
        textAlign="center"
        category={
          <span>
            Handcrafted by our friends from{" "}
            <a
              target="_blank"
              href="https://material-ui-next.com/?ref=creativetim"
            >
              Material UI
            </a>{" "}
            and styled by{" "}
            <a
              target="_blank"
              href="https://www.creative-tim.com/?ref=mdpr-notifications-page"
            >
              Creative Tim
            </a>
            . Please checkout the{" "}
            <a href="#pablo" target="_blank">
              full documentation
            </a>
            .
          </span>
        }
      />
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardBody>
              <div className={classes.cardHeader}>
                <h4 className={classes.cardTitle}>Notifications Style</h4>
              </div>
              <br />
              <SnackbarContent
                message={"This is a plain notification"}
                color="info"
              />
              <SnackbarContent
                message={"This is a notification with close button."}
                close
                color="info"
              />
              <br />
              <SnackbarContent
                message={
                  "This is a notification with close button and icon and have many lines. You can see that the icon and the close button are always vertically aligned. This is a beautiful notification. So you don't have to worry about the style."
                }
                close
                icon={AddAlert}
                color="info"
              />
              <br />
              <SnackbarContent
                message={
                  'This is a notification with close button and icon and is made with color="rose". You can see that the icon and the close button are always vertically aligned. This is a beautiful notification. So you don\'t have to worry about the style.'
                }
                close
                icon={AddAlert}
                color="rose"
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardBody>
              <div>
                <div className={classes.cardHeader}>
                  <h4 className={classes.cardTitle}>Notification states</h4>
                </div>
                <br />
                <SnackbarContent
                  message={
                    'INFO - This is a regular notification made with color="info"'
                  }
                  close
                  color="info"
                />
                <SnackbarContent
                  message={
                    'SUCCESS - This is a regular notification made with color="success"'
                  }
                  close
                  color="success"
                />
                <SnackbarContent
                  message={
                    'WARNING - This is a regular notification made with color="warning"'
                  }
                  close
                  color="warning"
                />
                <SnackbarContent
                  message={
                    'DANGER - This is a regular notification made with color="danger"'
                  }
                  close
                  color="danger"
                />
                <SnackbarContent
                  message={
                    'PRIMARY - This is a regular notification made with color="primary"'
                  }
                  close
                  color="primary"
                />
                <SnackbarContent
                  message={
                    'ROSE - This is a regular notification made with color="primary"'
                  }
                  close
                  color="rose"
                />
              </div>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody>
              <div>
                <GridContainer justify="center">
                  <GridItem xs={12}>
                    <div className={classes.cardHeader + " " + classes.center}>
                      <h4 className={classes.cardTitle}>
                        Notifications Places
                      </h4>
                      <p className={classes.cardSubtitle}>
                        Click to view notifications
                      </p>
                    </div>
                  </GridItem>
                </GridContainer>
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={3}>
                    <Button
                      fullWidth
                      color="primary"
                      onClick={() => showNotification("tl")}
                    >
                      Top Left
                    </Button>
                    <Snackbar
                      place="tl"
                      color="info"
                      icon={AddAlert}
                      message="Welcome to MATERIAL DASHBOARD PRO - a beautiful admin panel for every web developer."
                      open={tl}
                      closeNotification={() => setTL(false)}
                      close
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <Button
                      fullWidth
                      color="primary"
                      onClick={() => showNotification("tc")}
                    >
                      Top Center
                    </Button>
                    <Snackbar
                      place="tc"
                      color="info"
                      icon={AddAlert}
                      message="Welcome to MATERIAL DASHBOARD PRO - a beautiful admin panel for every web developer."
                      open={tc}
                      closeNotification={() => setTC(false)}
                      close
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <Button
                      fullWidth
                      color="primary"
                      onClick={() => showNotification("tr")}
                    >
                      Top Right
                    </Button>
                    <Snackbar
                      place="tr"
                      color="info"
                      icon={AddAlert}
                      message="Welcome to MATERIAL DASHBOARD PRO - a beautiful admin panel for every web developer."
                      open={tr}
                      closeNotification={() => setTR(false)}
                      close
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={3}>
                    <Button
                      fullWidth
                      color="primary"
                      onClick={() => showNotification("bl")}
                    >
                      Bottom Left
                    </Button>
                    <Snackbar
                      place="bl"
                      color="info"
                      icon={AddAlert}
                      message="Welcome to MATERIAL DASHBOARD PRO - a beautiful admin panel for every web developer."
                      open={bl}
                      closeNotification={() => setBL(false)}
                      close
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <Button
                      fullWidth
                      color="primary"
                      onClick={() => showNotification("bc")}
                    >
                      Bottom Center
                    </Button>
                    <Snackbar
                      place="bc"
                      color="info"
                      icon={AddAlert}
                      message="Welcome to MATERIAL DASHBOARD PRO - a beautiful admin panel for every web developer."
                      open={bc}
                      closeNotification={() => setBC(false)}
                      close
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={3}>
                    <Button
                      fullWidth
                      color="primary"
                      onClick={() => showNotification("br")}
                    >
                      Bottom Right
                    </Button>
                    <Snackbar
                      place="br"
                      color="info"
                      icon={AddAlert}
                      message="Welcome to MATERIAL DASHBOARD PRO - a beautiful admin panel for every web developer."
                      open={br}
                      closeNotification={() => setBR(false)}
                      close
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={12} className={classes.center}>
                    <div
                      className={
                        classes.cardHeader +
                        " " +
                        classes.center +
                        " " +
                        classes.modalSectionTitle
                      }
                    >
                      <h4 className={classes.cardTitle}>Modal</h4>
                    </div>
                    <Button
                      color="primary"
                      round
                      className={classes.marginRight}
                      onClick={() => setClassicModal(true)}
                    >
                      Classic modal
                    </Button>
                    <Dialog
                      classes={{
                        root: classes.center + " " + classes.modalRoot,
                        paper: classes.modal
                      }}
                      open={classicModal}
                      TransitionComponent={Transition}
                      keepMounted
                      onClose={() => setClassicModal(false)}
                      aria-labelledby="classic-modal-slide-title"
                      aria-describedby="classic-modal-slide-description"
                    >
                      <DialogTitle
                        id="classic-modal-slide-title"
                        disableTypography
                        className={classes.modalHeader}
                      >
                        <Button
                          justIcon
                          className={classes.modalCloseButton}
                          key="close"
                          aria-label="Close"
                          color="transparent"
                          onClick={() => setClassicModal(false)}
                        >
                          <Close className={classes.modalClose} />
                        </Button>
                        <h4 className={classes.modalTitle}>Modal title</h4>
                      </DialogTitle>
                      <DialogContent
                        id="classic-modal-slide-description"
                        className={classes.modalBody}
                      >
                        <p>
                          Far far away, behind the word mountains, far from the
                          countries Vokalia and Consonantia, there live the
                          blind texts. Separated they live in Bookmarksgrove
                          right at the coast of the Semantics, a large language
                          ocean. A small river named Duden flows by their place
                          and supplies it with the necessary regelialia. It is a
                          paradisematic country, in which roasted parts of
                          sentences fly into your mouth. Even the all-powerful
                          Pointing has no control about the blind texts it is an
                          almost unorthographic life One day however a small
                          line of blind text by the name of Lorem Ipsum decided
                          to leave for the far World of Grammar.
                        </p>
                      </DialogContent>
                      <DialogActions className={classes.modalFooter}>
                        <Button color="transparent">Nice Button</Button>
                        <Button
                          onClick={() => setClassicModal(false)}
                          color="danger"
                          simple
                        >
                          Close
                        </Button>
                      </DialogActions>
                    </Dialog>
                    <Button
                      color="info"
                      round
                      className={classes.marginRight}
                      onClick={() => setNoticeModal(true)}
                    >
                      Notice Modal
                    </Button>
                    <Dialog
                      classes={{
                        root: classes.center + " " + classes.modalRoot,
                        paper: classes.modal
                      }}
                      open={noticeModal}
                      TransitionComponent={Transition}
                      keepMounted
                      onClose={() => setNoticeModal(false)}
                      aria-labelledby="notice-modal-slide-title"
                      aria-describedby="notice-modal-slide-description"
                    >
                      <DialogTitle
                        id="notice-modal-slide-title"
                        disableTypography
                        className={classes.modalHeader}
                      >
                        <Button
                          justIcon
                          className={classes.modalCloseButton}
                          key="close"
                          aria-label="Close"
                          color="transparent"
                          onClick={() => setNoticeModal(false)}
                        >
                          <Close className={classes.modalClose} />
                        </Button>
                        <h4 className={classes.modalTitle}>Notice Modal</h4>
                      </DialogTitle>
                      <DialogContent
                        id="notice-modal-slide-description"
                        className={classes.modalBody}
                      >
                        <Instruction
                          title="1. Register"
                          text={
                            <span>
                              The first step is to create an account at{" "}
                              <a href="https://www.creative-tim.com/?ref=mdpr-notifications-page">
                                Creative Tim
                              </a>
                              . You can choose a social network or go for the
                              classic version, whatever works best for you.
                            </span>
                          }
                          image="/assets/card-1.jpeg"
                          className={classes.instructionNoticeModal}
                          imageClassName={classes.imageNoticeModal}
                        />
                        <Instruction
                          title="2. Apply"
                          text={
                            <span>
                              The first step is to create an account at{" "}
                              <a href="https://www.creative-tim.com/?ref=mdpr-notifications-page">
                                Creative Tim
                              </a>
                              . You can choose a social network or go for the
                              classic version, whatever works best for you.
                            </span>
                          }
                          image="/assets/card-2.jpeg"
                          className={classes.instructionNoticeModal}
                          imageClassName={classes.imageNoticeModal}
                        />
                        <p>
                          If you have more questions, don{"'"}t hesitate to
                          contact us or send us a tweet @creativetim. We{"'"}
                          re here to help!
                        </p>
                      </DialogContent>
                      <DialogActions
                        className={
                          classes.modalFooter + " " + classes.modalFooterCenter
                        }
                      >
                        <Button
                          onClick={() => setNoticeModal(false)}
                          color="info"
                          round
                        >
                          Sounds Good
                        </Button>
                      </DialogActions>
                    </Dialog>
                    <Button
                      color="rose"
                      round
                      className={classes.marginRight}
                      onClick={() => setSmallModal(true)}
                    >
                      Small alert modal
                    </Button>
                    <Dialog
                      classes={{
                        root: classes.center + " " + classes.modalRoot,
                        paper: classes.modal + " " + classes.modalSmall
                      }}
                      open={smallModal}
                      TransitionComponent={Transition}
                      keepMounted
                      onClose={() => setSmallModal(false)}
                      aria-labelledby="small-modal-slide-title"
                      aria-describedby="small-modal-slide-description"
                    >
                      <DialogTitle
                        id="small-modal-slide-title"
                        disableTypography
                        className={classes.modalHeader}
                      >
                        <Button
                          justIcon
                          className={classes.modalCloseButton}
                          key="close"
                          aria-label="Close"
                          color="transparent"
                          onClick={() => setSmallModal(false)}
                        >
                          <Close className={classes.modalClose} />
                        </Button>
                      </DialogTitle>
                      <DialogContent
                        id="small-modal-slide-description"
                        className={
                          classes.modalBody + " " + classes.modalSmallBody
                        }
                      >
                        <h5>Are you sure you want to do this?</h5>
                      </DialogContent>
                      <DialogActions
                        className={
                          classes.modalFooter + " " + classes.modalFooterCenter
                        }
                      >
                        <Button
                          onClick={() => setSmallModal(false)}
                          color="transparent"
                          className={classes.modalSmallFooterFirstButton}
                        >
                          Never Mind
                        </Button>
                        <Button
                          onClick={() => setSmallModal(false)}
                          color="success"
                          simple
                          className={
                            classes.modalSmallFooterFirstButton +
                            " " +
                            classes.modalSmallFooterSecondButton
                          }
                        >
                          Yes
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </GridItem>
                </GridContainer>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
