import React from 'react'

// firebase

// @mui/material components
import { makeStyles } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Icon from '@mui/material/Icon'

// @mui/icons-material
import Timeline from '@mui/icons-material/Timeline'
import Code from '@mui/icons-material/Code'
import Group from '@mui/icons-material/Group'
import Face from '@mui/icons-material/Face'
import Email from '@mui/icons-material/Email'
// import LockOutline from "@mui/icons-material/LockOutline";
import Check from '@mui/icons-material/Check'

// core components
import GridContainer from 'mui-pro/Grid/GridContainer'
import GridItem from 'mui-pro/Grid/GridItem'
import Button from 'mui-pro/CustomButtons/Button'
import CustomInput from 'mui-pro/CustomInput/CustomInput'
import InfoArea from 'mui-pro/InfoArea/InfoArea'
import Card from 'mui-pro/Card/Card'
import CardBody from 'mui-pro/Card/CardBody'

import styles from 'assets/jss/material-dashboard-pro-react/views/registerPageStyle'

const useStyles = makeStyles(styles)

export default function RegisterPage() {
  const [checked, setChecked] = React.useState([])
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
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
  const handleEmail = (emailValue) => {
    // console.log('email changed', email)
    setEmail(emailValue)
  }

  const handlePassword = (passwordValue) => {
    // console.log('password changed', password)
    setPassword(passwordValue)
  }
  const handleSubmit = (event) => {
    event.preventDeafult()
    // THIS IS UNSAFE
    // WIP
    // eslint-disable-next-line no-console
    console.log({ email, password })
  }

  const classes = useStyles()
  // console.log('email state is', email)
  return (
    <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={10}>
          <Card className={classes.cardSignup}>
            <h2 className={classes.cardTitle}>Register</h2>
            <CardBody>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={5}>
                  <InfoArea
                    title="Marketing"
                    description="We've created the marketing campaign of the website. It was a very interesting collaboration."
                    icon={Timeline}
                    iconColor="rose"
                  />
                  <InfoArea
                    title="Fully Coded in HTML5"
                    description="We've developed the website with HTML5 and CSS3. The client has access to the code using GitHub."
                    icon={Code}
                    iconColor="primary"
                  />
                  <InfoArea
                    title="Built Audience"
                    description="There is also a Fully Customizable CMS Admin Dashboard for this product."
                    icon={Group}
                    iconColor="info"
                  />
                </GridItem>
                <GridItem xs={12} sm={8} md={5}>
                  <div className={classes.center}>
                    <Button justIcon round color="twitter">
                      <i className="fab fa-twitter" />
                    </Button>
                    {' '}
                    <Button justIcon round color="dribbble">
                      <i className="fab fa-dribbble" />
                    </Button>
                    {' '}
                    <Button justIcon round color="facebook">
                      <i className="fab fa-facebook-f" />
                    </Button>
                    {' '}
                    <h4 className={classes.socialTitle}>or be classical</h4>
                  </div>
                  <form className={classes.form}>
                    <CustomInput
                      formControlProps={{
                        fullWidth: true,
                        className: classes.customFormControlClasses,
                      }}
                      inputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            className={classes.inputAdornment}
                          >
                            <Face className={classes.inputAdornmentIcon} />
                          </InputAdornment>
                        ),
                        placeholder: 'First Name...',
                      }}
                    />
                    <CustomInput
                      formControlProps={{
                        fullWidth: true,
                        className: classes.customFormControlClasses,
                      }}
                      inputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            className={classes.inputAdornment}
                          >
                            <Email className={classes.inputAdornmentIcon} />
                          </InputAdornment>
                        ),
                        placeholder: 'Email...',
                        onChange: (e) => handleEmail(e.target.value),
                      }}
                    />
                    <CustomInput
                      formControlProps={{
                        fullWidth: true,
                        className: classes.customFormControlClasses,
                      }}
                      inputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            className={classes.inputAdornment}
                          >
                            <Icon className={classes.inputAdornmentIcon}>
                              lock_outline
                            </Icon>
                          </InputAdornment>
                        ),
                        placeholder: 'Password...',
                        onChange: (e) => handlePassword(e.target.value),
                      }}
                    />
                    <FormControlLabel
                      classes={{
                        root: classes.checkboxLabelControl,
                        label: classes.checkboxLabel,
                      }}
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
                      label={(
                        <span>
                          I agree to the
                          {' '}
                          <a href="#pablo">terms and conditions</a>
                          .
                        </span>
                      )}
                    />
                    <div className={classes.center}>
                      <Button onClick={handleSubmit} round color="primary">
                        Get started
                      </Button>
                    </div>
                  </form>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  )
}
