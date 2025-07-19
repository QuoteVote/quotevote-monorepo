import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import InputAdornment from '@mui/material/InputAdornment'
import Email from '@mui/icons-material/Email'
import { CircularProgress } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import ArrowBackIos from '@mui/icons-material/ArrowBackIos'
import { useHistory } from 'react-router-dom'
import Card from '../../mui-pro/Card/Card'
import CardBody from '../../mui-pro/Card/CardBody'

const useStyles = makeStyles({
  headerBox: {
    marginBottom: 20,
  },
  header: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontStyle: 'normal',
    fontSize: '20px',
    lineHeight: '24px',
    marginBottom: 10,
    marginLeft: 25,
  },
  headerSubText: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '16px',
    lineHeight: '19px',
  },
  card: {
    width: 350,
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
})

function ForgotPasswordForm({
  onSubmit = () => {
  }, loading, error,
}) {
  const classes = useStyles()
  const {
    register, handleSubmit, errors, setError,
  } = useForm()

  useEffect(() => {
    if (error) {
      setError('email', {
        type: 'manual',
        message: error,
      })
    }
  }, [error, setError])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email className={classes.icon} />
            </InputAdornment>
          ),
        }}
        inputRef={register({
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        })}
        className={classes.textfield}
        placeholder="Email"
        fullWidth
        name="email"
        id="email"
        error={errors.email}
        helperText={errors.email && errors.email.message}
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
          Send
          {loading && <CircularProgress size={20} style={{ marginLeft: 5 }} />}
        </Typography>
      </Button>
    </form>
  )
}

ForgotPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.any,
}

function ForgotPassword({
  onSubmit = () => {
  }, loading = false,
  error,
}) {
  const classes = useStyles()
  const history = useHistory()
  const handleGoBack = () => {
    history.push('/auth/login')
  }

  return (
    <Card className={classes.card}>
      <CardBody>
        <div className={classes.headerBox}>
          <Typography>
            <IconButton
              size="medium"
              edge="start"
              aria-label="Go Back"
              color="inherit"
              onClick={handleGoBack}
            >
              <ArrowBackIos />
            </IconButton>
            <span className={classes.header}>
              Forgot password?
            </span>
          </Typography>
          <p className={classes.headerSubText}>
            We will send you a link to reset your password.
          </p>
        </div>
        <Grid
          container
          direction="column"
          alignItems="center"
          justify="space-evenly"
          spacing={2}
        >
          <Grid item>
            <ForgotPasswordForm onSubmit={onSubmit} loading={loading} error={error} />
          </Grid>
          <Grid item>
            <Typography variant="body1">
              <Link className={classes.link} href="/auth/login">
                Login
              </Link>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              No account?
              <span style={{ marginRight: 5 }} />
              <Link className={classes.link} href="/auth/request-access">
                Request Access
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </CardBody>
    </Card>
  )
}

ForgotPassword.propTypes = {
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string,
}

export default ForgotPassword
