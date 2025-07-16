import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'

import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import InputAdornment from '@material-ui/core/InputAdornment'

import FaceIcon from '@material-ui/icons/Face'
import LockIcon from '@material-ui/icons/Lock'

import { CircularProgress, Checkbox, FormControlLabel } from '@material-ui/core'
import { useSelector } from 'react-redux'
import CardBody from '../../mui-pro/Card/CardBody'
import Card from '../../mui-pro/Card/Card'

const useStyles = makeStyles((theme) => ({
  header: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontStyle: 'normal',
    fontSize: '20px',
    lineHeight: '24px',
  },
  card: {
    width: 350,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      maxWidth: 350,
    },
  },
  loginButton: {
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
  forgotPasswordContainer: {
    width: '100%',
    textAlign: 'right',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'right',
      paddingRight: theme.spacing(2),
    },
  },
  formContainer: {
    width: '100%',
  },
}))

function LoginForm({ onSubmit = () => {}, loading, loginError }) {
  const classes = useStyles()
  const {
    register,
    handleSubmit,
    errors,
    setError,
    watch,
  } = useForm()
  const tosAccepted = watch('tos')
  const cocAccepted = watch('coc')

  useEffect(() => {
    if (loginError && loginError.data && loginError.data.message) {
      setError('password', {
        type: 'manual',
        message: loginError.data.message,
      })
    } else if (typeof loginError === 'string') {
      setError('password', {
        type: 'manual',
        message: loginError,
      })
    }
  }, [loginError, setError])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.formContainer}>
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FaceIcon className={classes.icon} />
            </InputAdornment>
          ),
        }}
        inputRef={register({
          required: 'Username is required',
          minLength: {
            value: 4,
            message: 'Username should be more than 4 characters',
          },
          maxLength: {
            value: 30,
            message: 'Username should be less than thirty characters',
          },
        })}
        className={classes.textfield}
        placeholder="Email/Username"
        fullWidth
        name="username"
        id="username"
        error={errors.username}
        helperText={errors.username && errors.username.message}
      />
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon className={classes.icon} />
            </InputAdornment>
          ),
        }}
        inputRef={register({
          required: 'Password is required',
          minLength: {
            value: 2,
            message: 'Password should be more than 2 characters',
          },
          maxLength: {
            value: 20,
            message: 'Password should be less than twenty characters',
          },
        })}
        className={classes.textfield}
        placeholder="Password"
        fullWidth
        name="password"
        id="password"
        type="password"
        error={errors.password}
        helperText={errors.password && errors.password.message}
      />
      <FormControlLabel
        control={(
          <Checkbox
            color="default"
            style={{ color: 'gray' }}
            name="tos"
            inputRef={register({ required: true })}
          />
        )}
        label={(
          <Typography variant="body2">
            I agree to the
            {' '}
            <Link
              href="/quote_vote_terms_of_service.md"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.link}
              underline="always"
            >
              Terms of Service
            </Link>
          </Typography>
        )}
      />
      {errors.tos && (
        <Typography color="error" variant="caption">
          Acceptance required
        </Typography>
      )}
      <FormControlLabel
        control={(
          <Checkbox
            color="default"
            style={{ color: 'gray' }}
            name="coc"
            inputRef={register({ required: true })}
          />
        )}
        label={(
          <Typography variant="body2">
            I agree to the
            {' '}
            <Link
              href="/quote_vote_code_of_conduct.md"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.link}
              underline="always"
            >
              Code of Conduct
            </Link>
          </Typography>
        )}
      />
      {errors.coc && (
        <Typography color="error" variant="caption">
          Acceptance required
        </Typography>
      )}
      <Button
        className={classes.loginButton}
        size="large"
        color="secondary"
        variant="contained"
        fullWidth
        type="submit"
        disabled={loading || !tosAccepted || !cocAccepted}
      >
        <Typography variant="body1">
          Log in
          {loading && <CircularProgress size={20} style={{ marginLeft: 5 }} />}
        </Typography>
      </Button>
    </form>
  )
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  loginError: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      data: PropTypes.shape({
        message: PropTypes.string,
      }),
    }),
  ]),
}

function Login({ onSubmit = () => {}, loading = false }) {
  const classes = useStyles()
  const loginError = useSelector((state) => state.user.loginError)

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
          <Grid item>
            <Typography className={classes.header}>
              Login
            </Typography>
          </Grid>
          <Grid item>
            <LoginForm onSubmit={onSubmit} loading={loading} loginError={loginError} />
          </Grid>
          <Grid item className={classes.forgotPasswordContainer}>
            <Typography variant="body1">
              <Link className={classes.link} href="/auth/forgot">
                Forgot password?
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

Login.propTypes = {
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
}

export default Login
