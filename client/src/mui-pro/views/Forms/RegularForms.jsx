import React from 'react'
// @material-ui/core components
import { makeStyles } from '@mui/styles'
import FormLabel from '@mui/material/FormLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'
import Radio from '@mui/material/Radio'
import Checkbox from '@mui/material/Checkbox'

// @material-ui/icons
import MailOutline from '@mui/icons-material/MailOutline'
import Check from '@mui/icons-material/Check'
import Clear from '@mui/icons-material/Clear'
import Contacts from '@mui/icons-material/Contacts'
import FiberManualRecord from '@mui/icons-material/FiberManualRecord'

// core components
import GridContainer from 'mui-pro/Grid/GridContainer'
import GridItem from 'mui-pro/Grid/GridItem'
import CustomInput from 'mui-pro/CustomInput/CustomInput'
import Button from 'mui-pro/CustomButtons/Button'
import Card from 'mui-pro/Card/Card'
import CardHeader from 'mui-pro/Card/CardHeader'
import CardText from 'mui-pro/Card/CardText'
import CardIcon from 'mui-pro/Card/CardIcon'
import CardBody from 'mui-pro/Card/CardBody'

import styles from 'assets/jss/material-dashboard-pro-react/views/regularFormsStyle'

const useStyles = makeStyles(styles)

export default function RegularForms() {
  const [checked, setChecked] = React.useState([24, 22])
  const [selectedEnabled, setSelectedEnabled] = React.useState('b')
  const [selectedValue, setSelectedValue] = React.useState(null)
  const handleChange = (event) => {
    setSelectedValue(event.target.value)
  }
  const handleChangeEnabled = (event) => {
    setSelectedEnabled(event.target.value)
  }
  const handleToggle = (value) => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }
    setChecked(newChecked)
  }
  const classes = useStyles()
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={6}>
        <Card>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <MailOutline />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Stacked Form</h4>
          </CardHeader>
          <CardBody>
            <form>
              <CustomInput
                labelText="Email adress"
                id="email_adress"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  type: 'email',
                }}
              />
              <CustomInput
                labelText="Password"
                id="password"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  type: 'password',
                  autoComplete: 'off',
                }}
              />
              <div className={classes.checkboxAndRadio}>
                <FormControlLabel
                  control={(
                    <Checkbox
                      tabIndex={-1}
                      onClick={() => handleToggle(2)}
                      checkedIcon={<Check className={classes.checkedIcon} />}
                      icon={<Check className={classes.uncheckedIcon} />}
                      classes={{
                        checked: classes.checked,
                        root: classes.checkRoot,
                      }}
                    />
                  )}
                  classes={{
                    label: classes.label,
                    root: classes.labelRoot,
                  }}
                  label="Subscribe to newsletter"
                />
              </div>
              <Button color="rose">Submit</Button>
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
            <h4 className={classes.cardIconTitle}>Horizontal Form</h4>
          </CardHeader>
          <CardBody>
            <form>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Email
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={12} md={9}>
                  <CustomInput
                    id="email_adress2"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: 'email',
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <FormLabel className={classes.labelHorizontal}>
                    Password
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={12} md={9}>
                  <CustomInput
                    id="password2"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: 'password',
                      autoComplete: 'off',
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer justify="flex-end">
                <GridItem xs={12} sm={12} md={9}>
                  <div className={classes.checkboxAndRadio}>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          tabIndex={-1}
                          onClick={() => handleToggle(1)}
                          checkedIcon={
                            <Check className={classes.checkedIcon} />
                          }
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
                            root: classes.checkRoot,
                          }}
                        />
                      )}
                      classes={{
                        label: classes.label,
                        root: classes.labelRoot,
                      }}
                      label="Remember me"
                    />
                  </div>
                </GridItem>
              </GridContainer>
              <GridContainer justify="flex-end">
                <GridItem xs={12} sm={12} md={9}>
                  <Button color="rose">Submit</Button>
                </GridItem>
              </GridContainer>
            </form>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="rose" text>
            <CardText color="rose">
              <h4 className={classes.cardTitle}>Form Elements</h4>
            </CardText>
          </CardHeader>
          <CardBody>
            <form>
              <GridContainer>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal}>
                    With Help
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={10}>
                  <CustomInput
                    id="help-text"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: 'text',
                    }}
                    helpText="A block of help text that breaks onto a new line."
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal}>
                    Password
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={10}>
                  <CustomInput
                    id="pass"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: 'password',
                      autoComplete: 'off',
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal}>
                    Placeholder
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={10}>
                  <CustomInput
                    id="placeholder"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      placeholder: 'placeholder',
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal}>
                    Disabled
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={10}>
                  <CustomInput
                    id="disabled"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      placeholder: 'Disabled',
                      disabled: true,
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal}>
                    Static control
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={10}>
                  <div className={classes.staticFormGroup}>
                    <p className={classes.staticFormControl}>
                      hello@creative-tim.com
                    </p>
                  </div>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={2}>
                  <FormLabel
                    className={
                      `${classes.labelHorizontal
                      } ${
                        classes.labelHorizontalRadioCheckbox}`
                    }
                  >
                    Checkboxes and radios
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={10}>
                  <div
                    className={
                      `${classes.checkboxAndRadio
                      } ${
                        classes.checkboxAndRadioHorizontal}`
                    }
                  >
                    <FormControlLabel
                      control={(
                        <Checkbox
                          tabIndex={-1}
                          onClick={() => handleToggle(3)}
                          checkedIcon={
                            <Check className={classes.checkedIcon} />
                          }
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
                            root: classes.checkRoot,
                          }}
                        />
                      )}
                      classes={{
                        label: classes.label,
                        root: classes.labelRoot,
                      }}
                      label="First Checkbox"
                    />
                  </div>
                  <div
                    className={
                      `${classes.checkboxAndRadio
                      } ${
                        classes.checkboxAndRadioHorizontal}`
                    }
                  >
                    <FormControlLabel
                      control={(
                        <Checkbox
                          tabIndex={-1}
                          onClick={() => handleToggle(4)}
                          checkedIcon={
                            <Check className={classes.checkedIcon} />
                          }
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
                            root: classes.checkRoot,
                          }}
                        />
                      )}
                      classes={{
                        label: classes.label,
                        root: classes.labelRoot,
                      }}
                      label="Second Checkbox"
                    />
                  </div>
                  <div
                    className={
                      `${classes.checkboxAndRadio
                      } ${
                        classes.checkboxAndRadioHorizontal}`
                    }
                  >
                    <FormControlLabel
                      control={(
                        <Radio
                          checked={selectedValue === 'a'}
                          onChange={handleChange}
                          value="a"
                          name="radio button demo"
                          aria-label="A"
                          icon={(
                            <FiberManualRecord
                              className={classes.radioUnchecked}
                            />
                          )}
                          checkedIcon={(
                            <FiberManualRecord
                              className={classes.radioChecked}
                            />
                          )}
                          classes={{
                            checked: classes.radio,
                            root: classes.radioRoot,
                          }}
                        />
                      )}
                      classes={{
                        label: classes.label,
                        root: classes.labelRoot,
                      }}
                      label="First Radio"
                    />
                  </div>
                  <div
                    className={
                      `${classes.checkboxAndRadio
                      } ${
                        classes.checkboxAndRadioHorizontal}`
                    }
                  >
                    <FormControlLabel
                      control={(
                        <Radio
                          checked={selectedValue === 'b'}
                          onChange={handleChange}
                          value="b"
                          name="radio button demo"
                          aria-label="B"
                          icon={(
                            <FiberManualRecord
                              className={classes.radioUnchecked}
                            />
                          )}
                          checkedIcon={(
                            <FiberManualRecord
                              className={classes.radioChecked}
                            />
                          )}
                          classes={{
                            checked: classes.radio,
                            root: classes.radioRoot,
                          }}
                        />
                      )}
                      classes={{
                        label: classes.label,
                        root: classes.labelRoot,
                      }}
                      label="Second Radio"
                    />
                  </div>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={2}>
                  <FormLabel
                    className={
                      `${classes.labelHorizontal
                      } ${
                        classes.labelHorizontalRadioCheckbox}`
                    }
                  >
                    Inline checkboxes
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={10}>
                  <div className={classes.inlineChecks}>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          tabIndex={-1}
                          onClick={() => handleToggle(10)}
                          checkedIcon={
                            <Check className={classes.checkedIcon} />
                          }
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
                            root: classes.checkRoot,
                          }}
                        />
                      )}
                      classes={{
                        label: classes.label,
                        root: classes.labelRoot,
                      }}
                      label="a"
                    />
                    <FormControlLabel
                      control={(
                        <Checkbox
                          tabIndex={-1}
                          onClick={() => handleToggle(11)}
                          checkedIcon={
                            <Check className={classes.checkedIcon} />
                          }
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
                            root: classes.checkRoot,
                          }}
                        />
                      )}
                      classes={{
                        label: classes.label,
                        root: classes.labelRoot,
                      }}
                      label="b"
                    />
                    <FormControlLabel
                      control={(
                        <Checkbox
                          tabIndex={-1}
                          onClick={() => handleToggle(12)}
                          checkedIcon={
                            <Check className={classes.checkedIcon} />
                          }
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
                            root: classes.checkRoot,
                          }}
                        />
                      )}
                      classes={{
                        label: classes.label,
                        root: classes.labelRoot,
                      }}
                      label="c"
                    />
                  </div>
                </GridItem>
              </GridContainer>
            </form>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary" text>
            <CardText color="primary">
              <h4 className={classes.cardTitle}>Input Variants</h4>
            </CardText>
          </CardHeader>
          <CardBody>
            <form>
              <GridContainer>
                <GridItem xs={12} sm={2}>
                  <FormLabel
                    className={
                      `${classes.labelHorizontal
                      } ${
                        classes.labelHorizontalRadioCheckbox}`
                    }
                  >
                    Custom Checkboxes & Radios
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={4}>
                  <div
                    className={
                      `${classes.checkboxAndRadio
                      } ${
                        classes.checkboxAndRadioHorizontal}`
                    }
                  >
                    <FormControlLabel
                      control={(
                        <Checkbox
                          tabIndex={-1}
                          onClick={() => handleToggle(21)}
                          checkedIcon={
                            <Check className={classes.checkedIcon} />
                          }
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
                            root: classes.checkRoot,
                          }}
                        />
                      )}
                      classes={{
                        label: classes.label,
                        root: classes.labelRoot,
                      }}
                      label="Unchecked"
                    />
                  </div>
                  <div
                    className={
                      `${classes.checkboxAndRadio
                      } ${
                        classes.checkboxAndRadioHorizontal}`
                    }
                  >
                    <FormControlLabel
                      control={(
                        <Checkbox
                          tabIndex={-1}
                          onClick={() => handleToggle(22)}
                          checked={checked.indexOf(22) !== -1}
                          checkedIcon={
                            <Check className={classes.checkedIcon} />
                          }
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
                            root: classes.checkRoot,
                          }}
                        />
                      )}
                      classes={{
                        label: classes.label,
                        root: classes.labelRoot,
                      }}
                      label="Checked"
                    />
                  </div>
                  <div
                    className={
                      `${classes.checkboxAndRadio
                      } ${
                        classes.checkboxAndRadioHorizontal}`
                    }
                  >
                    <FormControlLabel
                      disabled
                      control={(
                        <Checkbox
                          tabIndex={-1}
                          checkedIcon={
                            <Check className={classes.checkedIcon} />
                          }
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
                            root: classes.checkRoot,
                          }}
                        />
                      )}
                      classes={{
                        label: classes.label,
                        disabled: classes.disabledCheckboxAndRadio,
                        root: classes.labelRoot,
                      }}
                      label="Disabled Unchecked"
                    />
                  </div>
                  <div
                    className={
                      `${classes.checkboxAndRadio
                      } ${
                        classes.checkboxAndRadioHorizontal}`
                    }
                  >
                    <FormControlLabel
                      disabled
                      control={(
                        <Checkbox
                          tabIndex={-1}
                          checked={checked.indexOf(24) !== -1}
                          checkedIcon={
                            <Check className={classes.checkedIcon} />
                          }
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
                            root: classes.checkRoot,
                          }}
                        />
                      )}
                      classes={{
                        label: classes.label,
                        disabled: classes.disabledCheckboxAndRadio,
                        root: classes.labelRoot,
                      }}
                      label="Disabled Checked"
                    />
                  </div>
                </GridItem>
                <GridItem xs={12} sm={4}>
                  <div
                    className={
                      `${classes.checkboxAndRadio
                      } ${
                        classes.checkboxAndRadioHorizontal}`
                    }
                  >
                    <FormControlLabel
                      control={(
                        <Radio
                          checked={selectedEnabled === 'a'}
                          onChange={handleChangeEnabled}
                          value="a"
                          name="radio button enabled"
                          aria-label="A"
                          icon={(
                            <FiberManualRecord
                              className={classes.radioUnchecked}
                            />
                          )}
                          checkedIcon={(
                            <FiberManualRecord
                              className={classes.radioChecked}
                            />
                          )}
                          classes={{
                            checked: classes.radio,
                            root: classes.radioRoot,
                          }}
                        />
                      )}
                      classes={{
                        label: classes.label,
                        root: classes.labelRoot,
                      }}
                      label="First Radio"
                    />
                  </div>
                  <div
                    className={
                      `${classes.checkboxAndRadio
                      } ${
                        classes.checkboxAndRadioHorizontal}`
                    }
                  >
                    <FormControlLabel
                      control={(
                        <Radio
                          checked={selectedEnabled === 'b'}
                          onChange={handleChangeEnabled}
                          value="b"
                          name="radio button enabled"
                          aria-label="B"
                          icon={(
                            <FiberManualRecord
                              className={classes.radioUnchecked}
                            />
                          )}
                          checkedIcon={(
                            <FiberManualRecord
                              className={classes.radioChecked}
                            />
                          )}
                          classes={{
                            checked: classes.radio,
                            root: classes.radioRoot,
                          }}
                        />
                      )}
                      classes={{
                        label: classes.label,
                        root: classes.labelRoot,
                      }}
                      label="Second Radio"
                    />
                  </div>
                  <div
                    className={
                      `${classes.checkboxAndRadio
                      } ${
                        classes.checkboxAndRadioHorizontal}`
                    }
                  >
                    <FormControlLabel
                      disabled
                      control={(
                        <Radio
                          checked={false}
                          value="a"
                          name="radio button disabled"
                          aria-label="B"
                          icon={(
                            <FiberManualRecord
                              className={classes.radioUnchecked}
                            />
                          )}
                          checkedIcon={(
                            <FiberManualRecord
                              className={classes.radioChecked}
                            />
                          )}
                          classes={{
                            checked: classes.radio,
                            disabled: classes.disabledCheckboxAndRadio,
                            root: classes.radioRoot,
                          }}
                        />
                      )}
                      classes={{
                        label: classes.label,
                        root: classes.labelRoot,
                      }}
                      label="Second Radio"
                    />
                  </div>
                  <div
                    className={
                      `${classes.checkboxAndRadio
                      } ${
                        classes.checkboxAndRadioHorizontal}`
                    }
                  >
                    <FormControlLabel
                      disabled
                      control={(
                        <Radio
                          checked
                          value="b"
                          name="radio button disabled"
                          aria-label="B"
                          icon={(
                            <FiberManualRecord
                              className={classes.radioUnchecked}
                            />
                          )}
                          checkedIcon={(
                            <FiberManualRecord
                              className={classes.radioChecked}
                            />
                          )}
                          classes={{
                            checked: classes.radio,
                            disabled: classes.disabledCheckboxAndRadio,
                            root: classes.radioRoot,
                          }}
                        />
                      )}
                      classes={{
                        label: classes.label,
                        root: classes.labelRoot,
                      }}
                      label="Second Radio"
                    />
                  </div>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal}>
                    Input with success
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={10}>
                  <CustomInput
                    id="success"
                    labelText="Success"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          className={classes.inputAdornment}
                        >
                          <Check
                            className={classes.inputAdornmentIconSuccess}
                          />
                        </InputAdornment>
                      ),
                    }}
                    success
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal}>
                    Input with error
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={10}>
                  <CustomInput
                    id="error"
                    labelText="Error"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          className={classes.inputAdornment}
                        >
                          <Clear className={classes.inputAdornmentIconError} />
                        </InputAdornment>
                      ),
                    }}
                    error
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={2}>
                  <FormLabel className={classes.labelHorizontal}>
                    Column sizing
                  </FormLabel>
                </GridItem>
                <GridItem xs={12} sm={10}>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={3}>
                      <CustomInput
                        id="md3"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          placeholder: 'md={3}',
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <CustomInput
                        id="md4"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          placeholder: 'md={4}',
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={5}>
                      <CustomInput
                        id="md5"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          placeholder: 'md={5}',
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                </GridItem>
              </GridContainer>
            </form>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  )
}
