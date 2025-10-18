/*eslint-disable*/
import React from "react";
// @mui styles + components
import { makeStyles } from '@mui/styles'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Checkbox from '@mui/material/Checkbox'
import InputAdornment from '@mui/material/InputAdornment'

// material ui icons
import MailOutline from '@mui/icons-material/MailOutline'
import Contacts from '@mui/icons-material/Contacts'
import Check from '@mui/icons-material/Check'
import Close from '@mui/icons-material/Close'

// core components
import GridContainer from "mui-pro/Grid/GridContainer";
import GridItem from "mui-pro/Grid/GridItem";
import CustomInput from "mui-pro/CustomInput/CustomInput";
import Button from "mui-pro/CustomButtons/Button";
import Card from "mui-pro/Card/Card";
import CardHeader from "mui-pro/Card/CardHeader";
import CardText from "mui-pro/Card/CardText";
import CardIcon from "mui-pro/Card/CardIcon";
import CardBody from "mui-pro/Card/CardBody";
import CardFooter from "mui-pro/Card/CardFooter";

// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle";

const useStyles = makeStyles(styles);

export default function ValidationForms() {
  // register form
  const [registerEmail, setregisterEmail] = React.useState("");
  const [registerEmailState, setregisterEmailState] = React.useState("");
  const [registerPassword, setregisterPassword] = React.useState("");
  const [registerPasswordState, setregisterPasswordState] = React.useState("");
  const [registerConfirmPassword, setregisterConfirmPassword] = React.useState(
    ""
  );
  const [
    registerConfirmPasswordState,
    setregisterConfirmPasswordState
  ] = React.useState("");
  const [registerCheckbox, setregisterCheckbox] = React.useState(false);
  const [registerCheckboxState, setregisterCheckboxState] = React.useState("");
  // login form
  const [loginEmail, setloginEmail] = React.useState("");
  const [loginEmailState, setloginEmailState] = React.useState("");
  const [loginPassword, setloginPassword] = React.useState("");
  const [loginPasswordState, setloginPasswordState] = React.useState("");
  // type validation
  const [required, setrequired] = React.useState("");
  const [requiredState, setrequiredState] = React.useState("");
  const [typeEmail, settypeEmail] = React.useState("");
  const [typeEmailState, settypeEmailState] = React.useState("");
  const [number, setnumber] = React.useState("");
  const [numberState, setnumberState] = React.useState("");
  const [url, seturl] = React.useState("");
  const [urlState, seturlState] = React.useState("");
  const [equalTo, setequalTo] = React.useState("");
  const [whichEqualTo, setwhichEqualTo] = React.useState("");
  const [equalToState, setequalToState] = React.useState("");
  // range validation
  const [minLength, setminLength] = React.useState("");
  const [minLengthState, setminLengthState] = React.useState("");
  const [maxLength, setmaxLength] = React.useState("");
  const [maxLengthState, setmaxLengthState] = React.useState("");
  const [range, setrange] = React.useState("");
  const [rangeState, setrangeState] = React.useState("");
  const [minValue, setminValue] = React.useState("");
  const [minValueState, setminValueState] = React.useState("");
  const [maxValue, setmaxValue] = React.useState("");
  const [maxValueState, setmaxValueState] = React.useState("");
  // function that returns true if value is email, false otherwise
  const verifyEmail = value => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };
  // function that verifies if a string has a given length or not
  const verifyLength = (value, length) => {
    if (value.length >= length) {
      return true;
    }
    return false;
  };
  // function that verifies if value contains only numbers
  const verifyNumber = value => {
    var numberRex = new RegExp("^[0-9]+$");
    if (numberRex.test(value)) {
      return true;
    }
    return false;
  };
  // verifies if value is a valid URL
  const verifyUrl = value => {
    try {
      new URL(value);
      return true;
    } catch (_) {
      return false;
    }
  };
  const registerClick = () => {
    if (registerEmailState === "") {
      setregisterEmailState("error");
    }
    if (registerPasswordState === "") {
      setregisterPasswordState("error");
    }
    if (registerConfirmPasswordState === "") {
      setregisterConfirmPasswordState("error");
    }
    if (registerCheckboxState === "") {
      setregisterCheckboxState("error");
    }
  };
  const loginClick = () => {
    if (loginEmailState === "") {
      setloginEmailState("error");
    }
    if (loginPasswordState === "") {
      setloginPasswordState("error");
    }
  };
  const typeClick = () => {
    if (requiredState === "") {
      setrequiredState("error");
    }
    if (typeEmailState === "") {
      settypeEmailState("error");
    }
    if (numberState === "") {
      setnumberState("error");
    }
    if (urlState === "") {
      seturlState("error");
    }
    if (equalToState === "") {
      setequalToState("error");
    }
  };
  const rangeClick = () => {
    if (minLengthState === "") {
      setminLengthState("error");
    }
    if (maxLengthState === "") {
      setmaxLengthState("error");
    }
    if (rangeState === "") {
      setrangeState("error");
    }
    if (minValueState === "") {
      setminValueState("error");
    }
    if (maxValueState === "") {
      setmaxValueState("error");
    }
  };
  const classes = useStyles();
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={6}>
        <Card>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <MailOutline />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Register Forms</h4>
          </CardHeader>
          <CardBody>
            <form>
              <CustomInput
                success={registerEmailState === "success"}
                error={registerEmailState === "error"}
                labelText="Email Address *"
                id="registeremail"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: event => {
                    if (verifyEmail(event.target.value)) {
                      setregisterEmailState("success");
                    } else {
                      setregisterEmailState("error");
                    }
                    setregisterEmail(event.target.value);
                  },
                  type: "email"
                }}
              />
              <CustomInput
                success={registerPasswordState === "success"}
                error={registerPasswordState === "error"}
                labelText="Password *"
                id="registerpassword"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: event => {
                    if (verifyLength(event.target.value, 1)) {
                      setregisterPasswordState("success");
                    } else {
                      setregisterPasswordState("error");
                    }
                    setregisterPassword(event.target.value);
                  },
                  type: "password",
                  autoComplete: "off"
                }}
              />
              <CustomInput
                success={registerConfirmPasswordState === "success"}
                error={registerConfirmPasswordState === "error"}
                labelText="Confirm Password *"
                id="registerconfirmpassword"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: event => {
                    if (registerPassword === event.target.value) {
                      setregisterConfirmPasswordState("success");
                    } else {
                      setregisterConfirmPasswordState("error");
                    }
                    setregisterConfirmPassword(event.target.value);
                  },
                  type: "password",
                  autoComplete: "off"
                }}
              />
              <div className={classes.formCategory}>
                <small>*</small> Required fields
              </div>
              <FormControlLabel
                control={
                  <Checkbox
                    tabIndex={-1}
                    onClick={event => {
                      if (event.target.checked) {
                        setregisterCheckboxState("success");
                      } else {
                        setregisterCheckboxState("error");
                      }
                      setregisterCheckbox(event.target.checked);
                    }}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot
                    }}
                  />
                }
                classes={{
                  label:
                    classes.label +
                    (registerCheckboxState === "error"
                      ? " " + classes.labelError
                      : "")
                }}
                label="Subscribe to newsletter"
              />
              <Button
                color="rose"
                onClick={registerClick}
                className={classes.registerButton}
              >
                Register
              </Button>
            </form>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={6}>
        <Card>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <Contacts />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Login Form</h4>
          </CardHeader>
          <CardBody>
            <form>
              <CustomInput
                success={loginEmailState === "success"}
                error={loginEmailState === "error"}
                labelText="Email Address *"
                id="loginemail"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: event => {
                    if (verifyEmail(event.target.value)) {
                      setloginEmailState("success");
                    } else {
                      setloginEmailState("error");
                    }
                    setloginEmail(event.target.value);
                  },
                  type: "email"
                }}
              />
              <CustomInput
                success={loginPasswordState === "success"}
                error={loginPasswordState === "error"}
                labelText="Password *"
                id="loginpassword"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  onChange: event => {
                    if (verifyLength(event.target.value, 1)) {
                      setloginPasswordState("success");
                    } else {
                      setloginPasswordState("error");
                    }
                    setloginPassword(event.target.value);
                  },
                  type: "password",
                  autoComplete: "off"
                }}
              />
              <div className={classes.formCategory}>
                <small>*</small> Required fields
              </div>
              <div className={classes.center}>
                <Button color="rose" onClick={loginClick}>
                  Login
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="rose" text>
            <CardText color="rose">
              <h4 className={classes.cardTitle}>Type Validation</h4>
            </CardText>
          </CardHeader>
          <CardBody>
            <form>
              <GridContainer>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal}>
                    Required Text
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={7}>
                  <CustomInput
                    success={requiredState === "success"}
                    error={requiredState === "error"}
                    id="required"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => {
                        if (verifyLength(event.target.value, 0)) {
                          setrequiredState("success");
                        } else {
                          setrequiredState("error");
                        }
                        setrequired(event.target.value);
                      },
                      type: "text",
                      endAdornment:
                        requiredState === "error" ? (
                          <InputAdornment position="end">
                            <Close className={classes.danger} />
                          </InputAdornment>
                        ) : (
                          undefined
                        )
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={3}>
                  <FormLabel className={classes.labelLeftHorizontal}>
                    <code>required</code>
                  </FormLabel>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal}>
                    Email
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={7}>
                  <CustomInput
                    success={typeEmailState === "success"}
                    error={typeEmailState === "error"}
                    id="typeemail"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => {
                        if (verifyEmail(event.target.value)) {
                          settypeEmailState("success");
                        } else {
                          settypeEmailState("error");
                        }
                        settypeEmail(event.target.value);
                      },
                      type: "email",
                      endAdornment:
                        typeEmailState === "error" ? (
                          <InputAdornment position="end">
                            <Close className={classes.danger} />
                          </InputAdornment>
                        ) : (
                          undefined
                        )
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={3}>
                  <FormLabel className={classes.labelLeftHorizontal}>
                    <code>email</code>
                  </FormLabel>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal}>
                    Number
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={7}>
                  <CustomInput
                    success={numberState === "success"}
                    error={numberState === "error"}
                    id="number"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => {
                        if (verifyNumber(event.target.value)) {
                          setnumberState("success");
                        } else {
                          setnumberState("error");
                        }
                        setnumber(event.target.value);
                      },
                      type: "number",
                      endAdornment:
                        numberState === "error" ? (
                          <InputAdornment position="end">
                            <Close className={classes.danger} />
                          </InputAdornment>
                        ) : (
                          undefined
                        )
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={3}>
                  <FormLabel className={classes.labelLeftHorizontal}>
                    <code>number</code>
                  </FormLabel>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal}>Url</FormLabel>
                </GridItem>
                <GridItem xs={12} sm={7}>
                  <CustomInput
                    success={urlState === "success"}
                    error={urlState === "error"}
                    id="url"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => {
                        if (verifyUrl(event.target.value)) {
                          seturlState("success");
                        } else {
                          seturlState("error");
                        }
                        seturl(event.target.value);
                      },
                      type: "text",
                      endAdornment:
                        urlState === "error" ? (
                          <InputAdornment position="end">
                            <Close className={classes.danger} />
                          </InputAdornment>
                        ) : (
                          undefined
                        )
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={3}>
                  <FormLabel className={classes.labelLeftHorizontal}>
                    <code>url</code>
                  </FormLabel>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal}>
                    Equal to
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={3}>
                  <CustomInput
                    success={equalToState === "success"}
                    error={equalToState === "error"}
                    id="equalto"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => setequalTo(event.target.value),
                      type: "text",
                      endAdornment:
                        equalToState === "error" ? (
                          <InputAdornment position="end">
                            <Close className={classes.danger} />
                          </InputAdornment>
                        ) : (
                          undefined
                        )
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={3}>
                  <CustomInput
                    success={equalToState === "success"}
                    error={equalToState === "error"}
                    id="whichequalto"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => {
                        if (equalTo === event.target.value) {
                          setequalToState("success");
                        } else {
                          setequalToState("error");
                        }
                        setwhichEqualTo(event.target.value);
                      },
                      type: "text",
                      endAdornment:
                        equalToState === "error" ? (
                          <InputAdornment position="end">
                            <Close className={classes.danger} />
                          </InputAdornment>
                        ) : (
                          undefined
                        )
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={3}>
                  <FormLabel className={classes.labelLeftHorizontal}>
                    <code>equalTo</code>
                  </FormLabel>
                </GridItem>
              </GridContainer>
            </form>
          </CardBody>
          <CardFooter className={classes.justifyContentCenter}>
            <Button color="rose" onClick={typeClick}>
              Validate Inputs
            </Button>
          </CardFooter>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="rose" text>
            <CardText color="rose">
              <h4 className={classes.cardTitle}>Range Validation</h4>
            </CardText>
          </CardHeader>
          <CardBody>
            <form>
              <GridContainer>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal}>
                    Min Length
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={7}>
                  <CustomInput
                    success={minLengthState === "success"}
                    error={minLengthState === "error"}
                    id="minlength"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => {
                        if (verifyLength(event.target.value, 5)) {
                          setminLengthState("success");
                        } else {
                          setminLengthState("error");
                        }
                        setminLength(event.target.value);
                      },
                      type: "text",
                      endAdornment:
                        minLengthState === "error" ? (
                          <InputAdornment position="end">
                            <Close className={classes.danger} />
                          </InputAdornment>
                        ) : (
                          undefined
                        )
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={3}>
                  <FormLabel className={classes.labelLeftHorizontal}>
                    <code>
                      minLength={'"'}5{'"'}
                    </code>
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal}>
                    Max Length
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={7}>
                  <CustomInput
                    success={maxLengthState === "success"}
                    error={maxLengthState === "error"}
                    id="maxlength"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => {
                        if (!verifyLength(event.target.value, 6)) {
                          setmaxLengthState("success");
                        } else {
                          setmaxLengthState("error");
                        }
                        setmaxLength(event.target.value);
                      },
                      type: "text",
                      endAdornment:
                        maxLengthState === "error" ? (
                          <InputAdornment position="end">
                            <Close className={classes.danger} />
                          </InputAdornment>
                        ) : (
                          undefined
                        )
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={3}>
                  <FormLabel className={classes.labelLeftHorizontal}>
                    <code>
                      maxLength={'"'}5{'"'}
                    </code>
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal}>
                    Range
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={7}>
                  <CustomInput
                    success={rangeState === "success"}
                    error={rangeState === "error"}
                    id="range"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => {
                        if (
                          verifyNumber(event.target.value) &&
                          event.target.value >= 6 &&
                          event.target.value <= 10
                        ) {
                          setrangeState("success");
                        } else {
                          setrangeState("error");
                        }
                        setrange(event.target.value);
                      },
                      type: "text",
                      endAdornment:
                        rangeState === "error" ? (
                          <InputAdornment position="end">
                            <Close className={classes.danger} />
                          </InputAdornment>
                        ) : (
                          undefined
                        )
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={3}>
                  <FormLabel className={classes.labelLeftHorizontal}>
                    <code>
                      range={'"'}[6,10]{'"'}
                    </code>
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal}>
                    Min Value
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={7}>
                  <CustomInput
                    success={minValueState === "success"}
                    error={minValueState === "error"}
                    id="minvalue"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => {
                        if (
                          verifyNumber(event.target.value) &&
                          event.target.value >= 6
                        ) {
                          setminValueState("success");
                        } else {
                          setminValueState("error");
                        }
                        setminValue(event.target.value);
                      },
                      type: "text",
                      endAdornment:
                        minValueState === "error" ? (
                          <InputAdornment position="end">
                            <Close className={classes.danger} />
                          </InputAdornment>
                        ) : (
                          undefined
                        )
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={3}>
                  <FormLabel className={classes.labelLeftHorizontal}>
                    <code>
                      min={'"'}6{'"'}
                    </code>
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal}>
                    Max Value
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={7}>
                  <CustomInput
                    success={maxValueState === "success"}
                    error={maxValueState === "error"}
                    id="maxvalue"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => {
                        if (
                          verifyNumber(event.target.value) &&
                          event.target.value <= 6
                        ) {
                          setmaxValueState("success");
                        } else {
                          setmaxValueState("error");
                        }
                        setmaxValue(event.target.value);
                      },
                      type: "text",
                      endAdornment:
                        maxValueState === "error" ? (
                          <InputAdornment position="end">
                            <Close className={classes.danger} />
                          </InputAdornment>
                        ) : (
                          undefined
                        )
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={3}>
                  <FormLabel className={classes.labelLeftHorizontal}>
                    <code>
                      max={'"'}6{'"'}
                    </code>
                  </FormLabel>
                </GridItem>
              </GridContainer>
            </form>
          </CardBody>
          <CardFooter className={classes.justifyContentCenter}>
            <Button color="rose" onClick={rangeClick}>
              Validate Inputs
            </Button>
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
