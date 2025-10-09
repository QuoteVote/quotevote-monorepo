/*eslint-disable*/
import React from "react";
// nod library to set properties for components
import PropTypes from "prop-types";

import { makeStyles } from '@mui/styles'
import Switch from '@mui/material/Switch'

import styles from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch";

// import imagine1 from "/assets/sidebar-1.jpg";
// import imagine2 from "/assets/sidebar-2.jpg";
// import imagine3 from "/assets/sidebar-3.jpg";
// import imagine4 from "/assets/sidebar-4.jpg";

import Button from "mui-pro/CustomButtons/Button";

const useStyles = makeStyles(styles);

export default function FixedPlugin(props) {
  const [classes, setClasses] = React.useState("dropdown show");
  const [bg_checked, setBg_checked] = React.useState(true);
  const [bgImage, setBgImage] = React.useState(props.bgImage);
  const [showImage, setShowImage] = React.useState(true);
  const handleClick = () => {
    props.handleFixedClick();
  };
  const handleChange = name => event => {
    switch (name) {
      case "miniActive":
        props.sidebarMinimize();
        break;
      case "image":
        if (event.target.checked) {
          props.handleImageClick(bgImage);
        } else {
          props.handleImageClick();
        }
        setShowImage(event.target.checked);
        break;
      default:
        break;
    }
  };
  const classesObj = useStyles();
  return (
    <div
      className={"fixed-plugin" + (props.rtlActive ? " fixed-plugin-rtl" : "")}
    >
      <div id="fixedPluginClasses" className={props.fixedClasses}>
        <div onClick={handleClick}>
          <i className="fa fa-cog fa-2x" />
        </div>
        <ul className="dropdown-menu">
          <li className="header-title">SIDEBAR FILTERS</li>
          <li className="adjustments-line">
            <a className="switch-trigger active-color">
              <div className="badge-colors text-center">
                <span
                  className={
                    props.color === "purple"
                      ? "badge filter badge-purple active"
                      : "badge filter badge-purple"
                  }
                  data-color="purple"
                  onClick={() => {
                    props.handleColorClick("purple");
                  }}
                />
                <span
                  className={
                    props.color === "blue"
                      ? "badge filter badge-blue active"
                      : "badge filter badge-blue"
                  }
                  data-color="blue"
                  onClick={() => {
                    props.handleColorClick("blue");
                  }}
                />
                <span
                  className={
                    props.color === "green"
                      ? "badge filter badge-green active"
                      : "badge filter badge-green"
                  }
                  data-color="green"
                  onClick={() => {
                    props.handleColorClick("green");
                  }}
                />
                <span
                  className={
                    props.color === "red"
                      ? "badge filter badge-red active"
                      : "badge filter badge-red"
                  }
                  data-color="red"
                  onClick={() => {
                    props.handleColorClick("red");
                  }}
                />
                <span
                  className={
                    props.color === "orange"
                      ? "badge filter badge-orange active"
                      : "badge filter badge-orange"
                  }
                  data-color="orange"
                  onClick={() => {
                    props.handleColorClick("orange");
                  }}
                />
                <span
                  className={
                    props.color === "white"
                      ? "badge filter badge-white active"
                      : "badge filter badge-white"
                  }
                  data-color="orange"
                  onClick={() => {
                    props.handleColorClick("white");
                  }}
                />
                <span
                  className={
                    props.color === "rose"
                      ? "badge filter badge-rose active"
                      : "badge filter badge-rose"
                  }
                  data-color="orange"
                  onClick={() => {
                    props.handleColorClick("rose");
                  }}
                />
              </div>
              <div className="clearfix" />
            </a>
          </li>
          <li className="header-title">SIDEBAR BACKGROUND</li>
          <li className="adjustments-line">
            <a className="switch-trigger active-color">
              <div className="badge-colors text-center">
                <span
                  className={
                    props.bgColor === "blue"
                      ? "badge filter badge-blue active"
                      : "badge filter badge-blue"
                  }
                  data-color="orange"
                  onClick={() => {
                    props.handleBgColorClick("blue");
                  }}
                />
                <span
                  className={
                    props.bgColor === "white"
                      ? "badge filter badge-white active"
                      : "badge filter badge-white"
                  }
                  data-color="orange"
                  onClick={() => {
                    props.handleBgColorClick("white");
                  }}
                />
                <span
                  className={
                    props.bgColor === "black"
                      ? "badge filter badge-black active"
                      : "badge filter badge-black"
                  }
                  data-color="orange"
                  onClick={() => {
                    props.handleBgColorClick("black");
                  }}
                />
              </div>
              <div className="clearfix" />
            </a>
          </li>
          <li className="adjustments-line">
            <a className="switch-trigger">
              <p className="switch-label">Sidebar Mini</p>
              <Switch
                checked={props.miniActive}
                onChange={handleChange("miniActive")}
                value="sidebarMini"
                classes={{
                  switchBase: classesObj.switchBase,
                  checked: classesObj.switchChecked,
                  thumb: classesObj.switchIcon,
                  track: classesObj.switchBar
                }}
              />
              <div className="clearfix" />
            </a>
          </li>
          <li className="adjustments-line">
            <a className="switch-trigger">
              <p className="switch-label">Sidebar Image</p>
              <Switch
                checked={showImage}
                onChange={handleChange("image")}
                value="sidebarMini"
                classes={{
                  switchBase: classesObj.switchBase,
                  checked: classesObj.switchChecked,
                  thumb: classesObj.switchIcon,
                  track: classesObj.switchBar
                }}
              />
              <div className="clearfix" />
            </a>
          </li>
          <li className="header-title">Images</li>
          <li className={bgImage === "/assets/sidebar-1.jpg" ? "active" : ""}>
            <a
              className="img-holder switch-trigger"
              onClick={() => {
                setShowImage(true);
                setBgImage("/assets/sidebar-1.jpg");
                props.handleImageClick("/assets/sidebar-1.jpg");
              }}
            >
              <img src="/assets/sidebar-1.jpg" alt="..." />
            </a>
          </li>
          <li className={bgImage === "/assets/sidebar-2.jpg" ? "active" : ""}>
            <a
              className="img-holder switch-trigger"
              onClick={() => {
                setShowImage(true);
                setBgImage("/assets/sidebar-2.jpg");
                props.handleImageClick("/assets/sidebar-2.jpg");
              }}
            >
              <img src="/assets/sidebar-2.jpg" alt="..." />
            </a>
          </li>
          <li className={bgImage === "/assets/sidebar-3.jpg" ? "active" : ""}>
            <a
              className="img-holder switch-trigger"
              onClick={() => {
                setShowImage(true);
                setBgImage("/assets/sidebar-3.jpg");
                props.handleImageClick("/assets/sidebar-3.jpg");
              }}
            >
              <img src="/assets/sidebar-3.jpg" alt="..." />
            </a>
          </li>
          <li className={bgImage === "/assets/sidebar-4.jpg" ? "active" : ""}>
            <a
              className="img-holder switch-trigger"
              onClick={() => {
                setShowImage(true);
                setBgImage("/assets/sidebar-4.jpg");
                props.handleImageClick("/assets/sidebar-4.jpg");
              }}
            >
              <img src="/assets/sidebar-4.jpg" alt="..." />
            </a>
          </li>
          <li className="button-container">
            <div>
              <Button
                color="warning"
                href="https://www.creative-tim.com/product/material-dashboard-pro-react?ref=mdpr-fixed-plugin"
                target="_blank"
                fullWidth
              >
                Buy now
              </Button>
            </div>
          </li>
          <li className="button-container">
            <div>
              <Button
                color="warning"
                href="https://demos.creative-tim.com/material-dashboard-pro-react/#/documentation/tutorial?ref=mdpr-fixed-plugin"
                target="_blank"
                fullWidth
              >
                Buy now
              </Button>
            </div>
          </li>
          <li className="header-title" id="sharrreTitle">
            Thank you for sharing!
            <br />
          </li>
        </ul>
      </div>
    </div>
  );
}

FixedPlugin.propTypes = {
  bgImage: PropTypes.string,
  handleFixedClick: PropTypes.func,
  miniActive: PropTypes.bool,
  fixedClasses: PropTypes.string,
  bgColor: PropTypes.oneOf(["white", "black", "blue"]),
  color: PropTypes.oneOf([
    "white",
    "red",
    "orange",
    "green",
    "blue",
    "purple",
    "rose"
  ]),
  handleBgColorClick: PropTypes.func,
  handleColorClick: PropTypes.func,
  handleImageClick: PropTypes.func,
  sidebarMinimize: PropTypes.func,
  rtlActive: PropTypes.bool
};
