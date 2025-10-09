/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
// @mui icons
import Face from '@mui/icons-material/Face'
import RecordVoiceOver from '@mui/icons-material/RecordVoiceOver'
import Email from '@mui/icons-material/Email'

// @mui core components
import withStyles from '@mui/styles/withStyles'
import InputAdornment from '@mui/material/InputAdornment'

// core components
import GridContainer from 'mui-pro/Grid/GridContainer'
import GridItem from 'mui-pro/Grid/GridItem'
import PictureUpload from 'mui-pro/CustomUpload/PictureUpload'
import CustomInput from 'mui-pro/CustomInput/CustomInput'

const style = {
  infoText: {
    fontWeight: '300',
    margin: '10px 0 30px',
    textAlign: 'center',
  },
  inputAdornmentIcon: {
    color: '#555',
  },
  inputAdornment: {
    position: 'relative',
  },
}

class Step1 extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      firstname: '',
      firstnameState: '',
      lastname: '',
      lastnameState: '',
      email: '',
      emailState: '',
    }
  }

  sendState() {
    return this.state
  }

  // function that returns true if value is email, false otherwise
  verifyEmail(value) {
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (emailRex.test(value)) {
      return true
    }
    return false
  }

  // function that verifies if a string has a given length or not
  verifyLength(value, length) {
    if (value.length >= length) {
      return true
    }
    return false
  }

  change(event, stateName, type, stateNameEqualTo) {
    switch (type) {
      case 'email':
        if (this.verifyEmail(event.target.value)) {
          this.setState({ [`${stateName}State`]: 'success' })
        } else {
          this.setState({ [`${stateName}State`]: 'error' })
        }
        break
      case 'length':
        if (this.verifyLength(event.target.value, stateNameEqualTo)) {
          this.setState({ [`${stateName}State`]: 'success' })
        } else {
          this.setState({ [`${stateName}State`]: 'error' })
        }
        break
      default:
        break
    }
    this.setState({ [stateName]: event.target.value })
  }

  isValidated() {
    if (
      this.state.firstnameState === 'success' &&
      this.state.lastnameState === 'success' &&
      this.state.emailState === 'success'
    ) {
      return true
    }
    if (this.state.firstnameState !== 'success') {
      this.setState({ firstnameState: 'error' })
    }
    if (this.state.lastnameState !== 'success') {
      this.setState({ lastnameState: 'error' })
    }
    if (this.state.emailState !== 'success') {
      this.setState({ emailState: 'error' })
    }

    return false
  }

  render() {
    const { classes } = this.props
    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={12}>
          <h4 className={classes.infoText}>
            Let
            '
            s start with the basic information (with validation)
          </h4>
        </GridItem>
        <GridItem xs={12} sm={4}>
          <PictureUpload />
        </GridItem>
        <GridItem xs={12} sm={6}>
          <CustomInput
            success={this.state.firstnameState === 'success'}
            error={this.state.firstnameState === 'error'}
            labelText={(
              <span>
                First Name
                {' '}
                <small>(required)</small>
              </span>
            )}
            id="firstname"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              onChange: (event) => this.change(event, 'firstname', 'length', 3),
              endAdornment: (
                <InputAdornment
                  position="end"
                  className={classes.inputAdornment}
                >
                  <Face className={classes.inputAdornmentIcon} />
                </InputAdornment>
              ),
            }}
          />
          <CustomInput
            success={this.state.lastnameState === 'success'}
            error={this.state.lastnameState === 'error'}
            labelText={(
              <span>
                Last Name
                {' '}
                <small>(required)</small>
              </span>
            )}
            id="lastname"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              onChange: (event) => this.change(event, 'lastname', 'length', 3),
              endAdornment: (
                <InputAdornment
                  position="end"
                  className={classes.inputAdornment}
                >
                  <RecordVoiceOver className={classes.inputAdornmentIcon} />
                </InputAdornment>
              ),
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={12} lg={10}>
          <CustomInput
            success={this.state.emailState === 'success'}
            error={this.state.emailState === 'error'}
            labelText={(
              <span>
                Email
                {' '}
                <small>(required)</small>
              </span>
            )}
            id="email"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              onChange: (event) => this.change(event, 'email', 'email'),
              endAdornment: (
                <InputAdornment
                  position="end"
                  className={classes.inputAdornment}
                >
                  <Email className={classes.inputAdornmentIcon} />
                </InputAdornment>
              ),
            }}
          />
        </GridItem>
      </GridContainer>
    )
  }
}

Step1.propTypes = {
  classes: PropTypes.object,
}

export default withStyles(style)(Step1)
