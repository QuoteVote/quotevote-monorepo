import React from 'react'

// @mui/material components
import { makeStyles } from '@mui/material/styles'

// core components
import Button from 'mui-pro/CustomButtons/Button'
import CustomInput from 'mui-pro/CustomInput/CustomInput'
import Card from 'mui-pro/Card/Card'
import CardBody from 'mui-pro/Card/CardBody'
import CardAvatar from 'mui-pro/Card/CardAvatar'
import CardFooter from 'mui-pro/Card/CardFooter'

import styles from 'assets/jss/material-dashboard-pro-react/views/lockScreenPageStyle'

const useStyles = makeStyles(styles)

export default function LockScreenPage() {
  const [cardAnimaton, setCardAnimation] = React.useState('cardHidden')
  setTimeout(() => {
    setCardAnimation('')
  }, 700)
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <form>
        <Card
          profile
          className={`${classes.customCardClass} ${classes[cardAnimaton]}`}
        >
          <CardAvatar profile className={classes.cardAvatar}>
            <a href="#pablo" onClick={(e) => e.preventDefault()}>
              <img src="/assets/faces/avatar.jpg" alt="..." />
            </a>
          </CardAvatar>
          <CardBody profile>
            <h4 className={classes.cardTitle}>Tania Andrew</h4>
            <CustomInput
              labelText="Enter Password"
              id="company-disabled"
              formControlProps={{
                fullWidth: true,
              }}
              inputProps={{
                type: 'password',
                autoComplete: 'off',
              }}
            />
          </CardBody>
          <CardFooter className={classes.justifyContentCenter}>
            <Button color="rose" round>
              Unlock
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
