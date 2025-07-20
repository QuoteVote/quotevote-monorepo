/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
// @mui/material components
import withStyles from '@mui/material/styles/withStyles'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Checkbox from '@mui/material/Checkbox'

// core components
import GridContainer from 'mui-pro/Grid/GridContainer'
import GridItem from 'mui-pro/Grid/GridItem'

import customSelectStyle from 'assets/jss/material-dashboard-pro-react/customSelectStyle'
import customCheckboxRadioSwitch from 'assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch'

const style = {
  infoText: {
    fontWeight: '300',
    margin: '10px 0 30px',
    textAlign: 'center',
  },
  inputAdornmentIcon: {
    color: '#555',
  },
  choiche: {
    textAlign: 'center',
    cursor: 'pointer',
    marginTop: '20px',
  },
  ...customSelectStyle,
  ...customCheckboxRadioSwitch,
}

class Step2 extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      simpleSelect: '',
      desgin: false,
      code: false,
      develop: false,
    }
  }

  sendState() {
    return this.state
  }

  handleSimple = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  };

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.checked })
  };

  isValidated() {
    return true
  }

  render() {
    const { classes } = this.props
    return (
      <div>
        <h4 className={classes.infoText}>What are you doing? (checkboxes)</h4>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} lg={10}>
            <GridContainer>
              <GridItem xs={12} sm={4}>
                <div className={classes.choiche}>
                  <Checkbox
                    tabIndex={-1}
                    onClick={this.handleChange('desgin')}
                    checkedIcon={(
                      <i
                        className={
                          `fas fa-pencil-alt ${classes.iconCheckboxIcon}`
                        }
                      />
                    )}
                    icon={(
                      <i
                        className={
                          `fas fa-pencil-alt ${classes.iconCheckboxIcon}`
                        }
                      />
                    )}
                    classes={{
                      checked: classes.iconCheckboxChecked,
                      root: classes.iconCheckbox,
                    }}
                  />
                  <h6>Design</h6>
                </div>
              </GridItem>
              <GridItem xs={12} sm={4}>
                <div className={classes.choiche}>
                  <Checkbox
                    tabIndex={-1}
                    onClick={this.handleChange('code')}
                    checkedIcon={(
                      <i
                        className={
                          `fas fa-terminal ${classes.iconCheckboxIcon}`
                        }
                      />
                    )}
                    icon={(
                      <i
                        className={
                          `fas fa-terminal ${classes.iconCheckboxIcon}`
                        }
                      />
                    )}
                    classes={{
                      checked: classes.iconCheckboxChecked,
                      root: classes.iconCheckbox,
                    }}
                  />
                  <h6>Code</h6>
                </div>
              </GridItem>
              <GridItem xs={12} sm={4}>
                <div className={classes.choiche}>
                  <Checkbox
                    tabIndex={-1}
                    onClick={this.handleChange('develop')}
                    checkedIcon={(
                      <i
                        className={`fas fa-laptop ${classes.iconCheckboxIcon}`}
                      />
                    )}
                    icon={(
                      <i
                        className={`fas fa-laptop ${classes.iconCheckboxIcon}`}
                      />
                    )}
                    classes={{
                      checked: classes.iconCheckboxChecked,
                      root: classes.iconCheckbox,
                    }}
                  />
                  <h6>Develop</h6>
                </div>
                <FormControl fullWidth className={classes.selectFormControl}>
                  <InputLabel
                    htmlFor="simple-select"
                    className={classes.selectLabel}
                  >
                    Choose City
                  </InputLabel>
                  <Select
                    MenuProps={{
                      className: classes.selectMenu,
                    }}
                    classes={{
                      select: classes.select,
                    }}
                    value={this.state.simpleSelect}
                    onChange={this.handleSimple}
                    inputProps={{
                      name: 'simpleSelect',
                      id: 'simple-select',
                    }}
                  >
                    <MenuItem
                      disabled
                      classes={{
                        root: classes.selectMenuItem,
                      }}
                    >
                      Choose City
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected,
                      }}
                      value="2"
                    >
                      Paris
                    </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected,
                      }}
                      value="3"
                    >
                      Bucharest
                    </MenuItem>
                  </Select>
                </FormControl>
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      </div>
    )
  }
}

Step2.propTypes = {
  classes: PropTypes.object,
}

export default withStyles(style)(Step2)
