// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import { useHistory } from 'react-router-dom'

import styles from 'assets/jss/material-dashboard-pro-react/views/errorPageStyles'

const useStyles = makeStyles(styles)

export default function ErrorPage() {
  const classes = useStyles()
  const history = useHistory()

  const handleBack = () => {
    history.push('/search')
  }

  return (
    <div className={classes.root}>
      <div className={classes.inner}>
        <h1 className={classes.title}>404</h1>
        <h2 className={classes.subTitle}>Page not found</h2>
        <p className={classes.description}>
          Oooops! Looks like you got lost.
        </p>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBack}
          className={classes.button}
        >
          Go to Search
        </Button>
      </div>
    </div>
  )
}
