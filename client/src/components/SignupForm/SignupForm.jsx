import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';

import {
  CardActions,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import CardBody from '../../mui-pro/Card/CardBody';
import CardHeader from '../../mui-pro/Card/CardHeader';
import Card from '../../mui-pro/Card/Card';
import { UPDATE_USER } from '../../graphql/mutations';
import { USER_LOGIN_SUCCESS } from '../../store/user';

const useStyles = makeStyles({
  header: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontStyle: 'normal',
    fontSize: '20px',
    lineHeight: '24px',
  },
  card: {
    width: 350,
  },
  submitButton: {
    textTransform: 'none',
    color: 'white',
    textColor: 'white',
    width: '100%',
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

function SignupForm({ user, token }) {
  localStorage.setItem('token', token)
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useDispatch()
  const { register, handleSubmit, errors, setError, formState, watch } = useForm({
    mode: 'onChange', // Validate on change
    reValidateMode: 'onChange', // Re-validate on change
  })
  const [updateUser, { loading, error, data }] = useMutation(UPDATE_USER)

  // Watch form values to track validity
  const watchedFields = watch(['username', 'password'])
  const tosAccepted = watch('tos')
  const cocAccepted = watch('coc')

  const onSubmit = async (values) => {
    // Double-check that there are no form errors before proceeding
    if (Object.keys(errors).length > 0) {
      console.warn('Form submission blocked due to validation errors:', errors)
      return
    }

    const { username, password, email } = values

    const result = await updateUser({
      variables: {
        user: {
          _id: user._id,
          email,
          name: "",
          username,
          password,
        },
      },
    })

    if (result && result.data) {
      dispatch(
        USER_LOGIN_SUCCESS({
          data: result.data.updateUser,
          loading: false,
          loginError: null,
        }),
      )
    }
  }


  useEffect(() => {
    if (error) {
      setError('password', {
        type: 'manual',
        message: error.message,
      })
    }
  }, [error, setError])

  useEffect(() => {
    if (!loading && data) {
      history.push('/Home')
    }
  }, [data, loading, history])

  // Check if form is valid
  const isFormValid = formState.isValid && !loading

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className={classes.card}>
        <CardHeader>
          <Typography className={classes.header}>
            Complete Your Registration
          </Typography>
        </CardHeader>
        <CardBody>
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="space-evenly"
          >
            <Grid item>
              <TextField
                inputRef={register({
                  required: 'Email is required',
                })}
                className={classes.textfield}
                placeholder="Email"
                fullWidth
                name="email"
                id="email"
                error={errors.email}
                helperText={errors.email && errors.email.message}
                disabled
                value={user.email}
              />

              <TextField
                inputRef={register({
                  required: 'Username is required',
                  minLength: {
                    value: 4,
                    message: 'Username should be more than 4 characters',
                  },
                  maxLength: {
                    value: 20,
                    message: 'Username should be less than twenty characters',
                  },
                })}
                className={classes.textfield}
                placeholder="Username"
                fullWidth
                name="username"
                id="username"
                error={errors.username}
                helperText={errors.username && errors.username.message}
              />

              <TextField
                inputRef={register({
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password should be at least 8 characters',
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
                type="password"
                error={errors.password}
              helperText={errors.password && errors.password.message}
            />
          </Grid>
        </Grid>
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
      </CardBody>

      <CardActions>
        <Button
          className={classes.submitButton}
            color="secondary"
            variant="contained"
            fullWidth
            type="submit"
          disabled={loading || !isFormValid || !tosAccepted || !cocAccepted}
          size={"small"}
          >
            <Typography variant="body1">
              Submit
              {loading && (
                <CircularProgress size={20} style={{ marginLeft: 5 }} />
              )}
            </Typography>
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}

SignupForm.propTypes = {
  user: PropTypes.object,
  token: PropTypes.any,
}

export default SignupForm
