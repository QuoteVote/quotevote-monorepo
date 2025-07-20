/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
// @material-ui/core components
import withStyles from '@mui/styles/withStyles'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'

// core components
import CustomInput from 'mui-pro/CustomInput/CustomInput'
import GridContainer from 'mui-pro/Grid/GridContainer'
import GridItem from 'mui-pro/Grid/GridItem'

import customSelectStyle from 'assets/jss/material-dashboard-pro-react/customSelectStyle'

const style = {
  infoText: {
    fontWeight: '300',
    margin: '10px 0 30px',
    textAlign: 'center',
  },
  ...customSelectStyle,
}

class Step3 extends React.Component {
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

  isValidated() {
    return true
  }

  render() {
    const { classes } = this.props
    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={12}>
          <h4 className={classes.infoText}>Are you living in a nice area?</h4>
        </GridItem>
        <GridItem xs={12} sm={7}>
          <CustomInput
            labelText="Street Name"
            id="streetname"
            formControlProps={{
              fullWidth: true,
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={3}>
          <CustomInput
            labelText="Street No."
            id="streetno"
            formControlProps={{
              fullWidth: true,
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={5}>
          <CustomInput
            labelText="City"
            id="city"
            formControlProps={{
              fullWidth: true,
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={5}>
          <FormControl fullWidth className={classes.selectFormControl}>
            <InputLabel htmlFor="simple-select" className={classes.selectLabel}>
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
                Country
              </MenuItem>
              <MenuItem
                classes={{
                  root: classes.selectMenuItem,
                  selected: classes.selectMenuItemSelected,
                }}
                value="2"
              >
                France
              </MenuItem>
              <MenuItem
                classes={{
                  root: classes.selectMenuItem,
                  selected: classes.selectMenuItemSelected,
                }}
                value="3"
              >
                Romania
              </MenuItem>
            </Select>
          </FormControl>
        </GridItem>
      </GridContainer>
    )
  }
}

Step3.propTypes = {
  classes: PropTypes.object,
}

export default withStyles(style)(Step3)
