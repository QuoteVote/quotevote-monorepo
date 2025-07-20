import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// @material-ui/core components
import { makeStyles } from '@mui/styles';
import Snack from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';

// @material-ui/icons
import Close from '@mui/icons-material/Close';

import styles from "assets/jss/material-dashboard-pro-react/components/snackbarContentStyle";

const useStyles = makeStyles(styles);

export default function Snackbar(props) {
  const classes = useStyles();
  const {
    message, color, close, icon, place, open
  } = props;
  let action = [];
  const messageClasses = cx({
    [classes.iconMessage]: icon !== undefined
  });
  
  if (close !== undefined) {
    action = [
      <IconButton
        className={classes.iconButton}
        key="close"
        aria-label="Close"
        color="inherit"
        onClick={() => props.closeNotification()}
      >
        <Close className={classes.close} />
      </IconButton>
    ];
  }
  const iconClasses = cx({
    [classes.icon]: classes.icon,
    [classes.infoIcon]: color === "info",
    [classes.successIcon]: color === "success",
    [classes.warningIcon]: color === "warning",
    [classes.dangerIcon]: color === "danger",
    [classes.primaryIcon]: color === "primary",
    [classes.roseIcon]: color === "rose"
  });
  return (
    <Snack
      onClose={props.closeNotification}
      autoHideDuration={3000}
      classes={{
        anchorOriginTopCenter: classes.top20,
        anchorOriginTopRight: classes.top40,
        anchorOriginTopLeft: classes.top40
      }}
      anchorOrigin={{
        vertical: place.indexOf("t") === -1 ? "bottom" : "top",
        horizontal:
          place.indexOf("l") !== -1 ?
            "left" :
            place.indexOf("c") !== -1 ?
              "center" :
              "right"
      }}
      open={open}
      message={(
        <div>
          {icon !== undefined ? <props.icon className={iconClasses} /> : null}
          <span className={messageClasses}>{message}</span>
        </div>
      )}
      action={action}
      ContentProps={{
        classes: {
          root: `${classes.root} ${classes[color]}`,
          message: classes.message
        }
      }}
    />
  );
}

Snackbar.defaultProps = {
  color: 'info',
};

Snackbar.propTypes = {
  message: PropTypes.node.isRequired,
  color: PropTypes.oneOf([
    "info",
    "success",
    "warning",
    "danger",
    "primary",
    "rose"
  ]),
  close: PropTypes.bool,
  icon: PropTypes.object,
  place: PropTypes.oneOf(["tl", "tr", "tc", "br", "bl", "bc"]),
  open: PropTypes.bool,
  closeNotification: PropTypes.func
};
