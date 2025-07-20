import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { makeStyles } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import LockIcon from '@mui/icons-material/LockOutlined'
import { CircularProgress } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useHistory } from 'react-router-dom'
import Link from '@mui/material/Link'
import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined'
import ErrorIcon from '@mui/icons-material/Error'
import CardBody from '../../mui-pro/Card/CardBody'
import Card from '../../mui-pro/Card/Card'
import Loader from '../common/Loader'

const useStyles = makeStyles((theme) => ({
  headerBox: {
    marginBottom: 20,
  },
  header: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontStyle: 'normal',
    fontSize: '20px',
    lineHeight: '24px',
  },
  headerSubText: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '16px',
    lineHeight: '19px',
  },
  errorSubText: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '16px',
    lineHeight: '19px',
    color: 'red',
  },
  card: {
    width: 500,
    [theme.breakpoints.down('sm')]: {
      width: 300,
    },
  },
  sendButton: {
    textTransform: 'none',
    color: 'white',
    textColor: 'white',
  },
  forgotPassword: {
    textTransform: 'none',
  },
  textfield: {
    marginBottom: 20,
  },
  icon: {
    color: '#495057',
  },
  link: {
    color: '#00bcd4',
  },
}))

function PasswordResetForm({
  onSubmit = () => {
  }, loading, error,
}) {
  const classes = useStyles()
  const {
    register, handleSubmit, errors, setError, getValues,
  } = useForm()

  const [showPassword, setShowPassword] = useState(false)
  useEffect(() => {
    if (error) {
      setError('password', {
        type: 'manual',
        message: error,
      })
    }
  }, [error, setError])
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon className={classes.icon} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        type={showPassword ? 'text' : 'password'}
        inputRef={register({
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password should be more than six characters',
          },
          maxLength: {
            value: 20,
            message: 'Password should be less than twenty characters',
          },
          pattern: {
            value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
            message:
              'Password should contain a number, an uppercase, and lowercase letter',
          },
        })}
        className={classes.textfield}
        placeholder="Password"
        fullWidth
        name="password"
        id="password"
        error={errors.password}
        helperText={errors.password && errors.password.message}
      />
      <TextField
        type="password"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon className={classes.icon} />
            </InputAdornment>
          ),
        }}
        inputRef={register({
          required: 'Confirm password is required',
          validate: (value) => value === getValues('password') || "Passwords don't match.",
        })}
        className={classes.textfield}
        placeholder="Confirm Password"
        fullWidth
        name="confirmPassword"
        id="confirmPassword"
        error={errors.confirmPassword}
        helperText={errors.confirmPassword && errors.confirmPassword.message}
      />
      <Button
        className={classes.sendButton}
        size="large"
        color="primary"
        variant="contained"
        fullWidth
        type="submit"
        disabled={loading}
      >
        <Typography variant="body1">
          Confirm Password
          {loading && <CircularProgress size={20} style={{ marginLeft: 5 }} />}
        </Typography>
      </Button>
    </form>
  )
}

PasswordResetForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.any,
}

function PasswordReset({
  onSubmit = () => {
  }, loading = false,
  error,
  passwordUpdated,
  isValidToken,
  loadingData,
}) {
  const classes = useStyles()
  const history = useHistory()
  if (loadingData) {
    return (
      <Card className={classes.card}>
        <CardBody>
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="space-evenly"
            spacing={2}
          >
            <Loader />
          </Grid>
        </CardBody>
      </Card>
    )
  }
  return (
    <Card className={classes.card}>
      <CardBody>
        <Grid
          container
          direction="column"
          alignItems="center"
          justify="space-evenly"
          spacing={2}
        >
          {passwordUpdated ? (
            <>
              <Grid item>
                <Typography className={classes.headerSubText}>
                  Your password has been changed successfully!
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  className={classes.sendButton}
                  size="large"
                  color="primary"
                  variant="contained"
                  fullWidth
                  onClick={() => history.push('/auth/login')}
                >
                  Login
                </Button>
              </Grid>
            </>
          ) : (
            <>
              {isValidToken && (
                <>
                  <Grid item>
                    <Typography className={classes.header}>
                      Choose New Password
                    </Typography>
                  </Grid>
                  <Grid item>
                    <PasswordResetForm onSubmit={onSubmit} loading={loading} error={error} />
                  </Grid>
                </>
              )}
              {!isValidToken && (
                <>
                  <Grid item>
                    <SentimentDissatisfiedOutlinedIcon fontSize="large" />
                  </Grid>
                  <Grid item>
                    <Typography className={classes.header}>
                      Password Reset
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography className={classes.errorSubText}>
                      <ErrorIcon fontSize="medium" />
                      Sorry, your password reset link is invalid or expired.
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Link className={classes.link} href="/auth/forgot">
                      Request reset password.
                    </Link>
                  </Grid>
                </>
              )}

            </>
          )}
        </Grid>
      </CardBody>
    </Card>
  )
}

PasswordReset.propTypes = {
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string,
  passwordUpdated: PropTypes.bool,
  isValidToken: PropTypes.bool,
  loadingData: PropTypes.bool,
}

export default PasswordReset
