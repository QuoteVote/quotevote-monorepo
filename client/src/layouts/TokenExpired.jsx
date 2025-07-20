import { makeStyles } from '@mui/material/styles'
import { useHistory } from 'react-router-dom'
import GridContainer from 'mui-pro/Grid/GridContainer'
import React from 'react'
import styles from 'assets/jss/material-dashboard-pro-react/views/sweetAlertStyle'
import SweetAlert from 'react-bootstrap-sweetalert'

export default function TokenExpired() {
  const useStyles = makeStyles(styles)
  const history = useHistory()
  const classes = useStyles()
  const hideAlert = () => {
    history.push('/auth/auth-login')
  }
  return (
    <GridContainer>
      <SweetAlert
        style={{ display: 'block' }}
        title="Token Expired!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={`${classes.button} ${classes.info}`}
      >
        Please login to continue.
      </SweetAlert>
    </GridContainer>
  )
}
