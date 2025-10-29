import React from 'react'
import { Avatar, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import classNames from 'classnames'
import InputLabel from '@material-ui/core/InputLabel'
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera'
import IconButton from '@material-ui/core/IconButton'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import TextField from '@material-ui/core/TextField'
import { useApolloClient, useMutation } from '@apollo/react-hooks'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import Link from '@material-ui/core/Link'
import AvatarDisplay from '../Avatar'
import SettingsSaveButton from '../CustomButtons/SettingsSaveButton'
import SignOutButton from '../CustomButtons/SignOutButton'
import ManageInviteButton from '../CustomButtons/ManageInviteButton'
import BlockedUsers from './BlockedUsers'
import { UPDATE_USER } from '../../graphql/mutations'
import { SET_USER_DATA } from '../../store/user'
import { replaceGqlError } from '../../utils/replaceGqlError'
import { useMobileDetection } from '../../utils/display'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 350,
    minWidth: 350,
    height: '90vh',
    marginLeft: 5,
    marginRight: 5,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      minWidth: '100%',
      height: '90vh',
      marginLeft: 0,
      marginRight: 0,
      padding: theme.spacing(2),
    },
  },
  contentArea: {
    flex: 1,
    overflow: 'auto',
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      position: 'sticky',
      bottom: 0,
      backgroundColor: 'inherit',
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      borderTop: `1px solid ${theme.palette.divider}`,
    },
  },
  title: {
    fontFamily: 'Montserrat',
    fontSize: '22px',
    fontWeight: 'bold',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    textAlign: 'left',
    color: '#ffffff',
    [theme.breakpoints.down('sm')]: {
      fontSize: '20px',
      marginBottom: theme.spacing(2),
    },
  },
  paperName: {
    maxWidth: 200,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      flex: 1,
    },
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(8),
      height: theme.spacing(8),
    },
  },
  cameraIcon: {
    marginTop: 25,
    margin: 0,
    position: 'absolute',
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      marginTop: 20,
    },
  },
  paper: {
    padding: 15,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  footerButtons: {
    position: 'fixed',
    bottom: 0,
    [theme.breakpoints.down('sm')]: {
      position: 'static',
      marginTop: theme.spacing(3),
      padding: theme.spacing(2),
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  error: {
    padding: 15,
    color: 'red',
    font: 'bold',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  success: {
    padding: 15,
    color: 'white',
    font: 'bold',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  required: {
    color: 'red',
  },
  forgot: {
    right: 10,
    position: 'absolute',
    marginTop: 5,
    [theme.breakpoints.down('sm')]: {
      position: 'relative',
      float: 'right',
      padding: theme.spacing(1),
    },
  },
  avatarContainer: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: 0,
      flexShrink: 0,
    },
  },
  nameContainer: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing(2),
    },
  },
}))

function SettingsContent({ setOpen }) {
  const classes = useStyles()
  const isMobileDevice = useMobileDetection()
  const history = useHistory()
  const dispatch = useDispatch()
  const client = useApolloClient()
  const {
    username, email, name, avatar, _id, ...otherUserData
  } = useSelector((state) => {
    console.log(state)
    return state.user.data
  })
  console.log(otherUserData)
  const handleChangeAvatar = () => {
    setOpen(false)
    history.push(`/Profile/${username}/avatar`)
  }
  
  const defaultValues = {
    username, password: username, name,
  }
  
  const {
    register, handleSubmit, errors, formState, reset,
  } = useForm({ defaultValues })
  
  const isPasswordTouched = 'password' in Object.keys(formState.dirtyFields)
  const [updateUser, { loading, error, data }] = useMutation(UPDATE_USER)
  
  const onSubmit = async (values) => {
    const { password, ...otherValues } = values
    const otherVariables = values.password === password ? otherValues : values
    try {
      const result = await updateUser({
        variables: {
          user: {
            _id,
            ...otherVariables,
          },
        },
      })
      if (result.data) {
        dispatch(SET_USER_DATA({
          _id,
          ...otherUserData,
          ...otherValues,
        }))
      }
    } catch (e) {
      reset()
    }
  }

  const handleLogout = () => {
    setOpen(false)
    localStorage.removeItem('token')
    client.stop()
    client.resetStore()
    history.push('/auth/login')
  }

  const handleInvite = () => {
    history.push('/ControlPanel')
    setOpen(false)
  }
  
  const hasChange = Object.keys(formState.dirtyFields).length
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        direction="column"
        justify="space-between"
        alignItems="stretch"
        className={classes.root}
        spacing={2}
      >
        <Grid item className={classes.contentArea}>
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="stretch"
            spacing={2}
          >
            <Grid item>
              {!isMobileDevice && (
                 <Typography className={classes.title}>
                    Settings
                  </Typography>
              )}
            </Grid>
            <Grid item>
              <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                className={classes.nameContainer}
                spacing={0}
              >
                <Grid item className={classes.avatarContainer}>
                  <IconButton onClick={handleChangeAvatar}>
                    <Avatar className={classes.avatar}>
                      <AvatarDisplay height={75} width={75} {...avatar} />
                      <PhotoCameraIcon className={classes.cameraIcon} />
                    </Avatar>
                  </IconButton>
                </Grid>
                <Grid item className={classes.paperName}>
                  <Paper className={classNames(classes.paperName, classes.paper)}>
                    <InputLabel>Name</InputLabel>
                    <TextField
                      inputRef={register({
                        required: 'Name is required',
                      })}
                      defaultValue={name}
                      fullWidth
                      name="name"
                      id="name"
                      error={errors.name}
                      helperText={errors.name && errors.name.message}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Paper className={classes.paper}>
                <InputLabel>Username</InputLabel>
                <TextField
                  inputRef={register({
                    required: 'Username is required',
                    minLength: {
                      value: 4,
                      message: 'Username should be more than 4 characters',
                    },
                    maxLength: {
                      value: 50,
                      message: 'Username should be less than twenty characters',
                    },
                  })}
                  defaultValue={username}
                  fullWidth
                  name="username"
                  id="username"
                  error={errors.username}
                  helperText={errors.username && errors.username.message}
                />
              </Paper>
            </Grid>
            <Grid item>
              <Paper className={classes.paper}>
                <InputLabel>Email</InputLabel>
                <TextField
                  inputRef={register({
                    required: 'Email is required',
                    pattern: {
                      value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                      message: 'Entered value does not match email format',
                    },
                  })}
                  defaultValue={email}
                  fullWidth
                  name="email"
                  id="email"
                  error={errors.email}
                  helperText={errors.email && errors.email.message}
                />
              </Paper>
            </Grid>
            <Grid item>
              <Grid>
                <Paper className={classes.paper}>
                  <InputLabel>
                    Password
                    <span className={classes.required}>*</span>
                  </InputLabel>
                  <TextField
                    inputRef={register({
                      required: 'Password is required',
                      minLength: {
                        value: 3,
                        message: 'Password should be more than 3 characters',
                      },
                      maxLength: {
                        value: 50,
                        message: 'Password should be less than twenty characters',
                      },
                      pattern: isPasswordTouched ? {
                        value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                        message:
                          'Password should contain a number, an uppercase, and lowercase letter',
                      } : null,
                    })}
                    defaultValue={username}
                    fullWidth
                    name="password"
                    id="password"
                    error={errors.password}
                    helperText={errors.password && errors.password.message}
                    type="password"
                  />
                </Paper>
                <Link
                  href="/auth/forgot"
                  className={classes.forgot}
                  el="noopener"
                  target="_blank"
                >
                  Forgot Password?
                </Link>
              </Grid>
            </Grid>
            
            {/* Blocked Users Section */}
            <Grid item>
              <BlockedUsers />
            </Grid>
            
            {!loading && error && (<Typography className={classes.error}>{replaceGqlError(error.message)}</Typography>)}
            {!loading && data && (<Typography className={classes.success}>Successfully saved!</Typography>)}
          </Grid>
        </Grid>
        
        <Grid item className={classes.buttonContainer}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="flex-end"
          >
            <Grid item>
              <SignOutButton onClick={handleLogout} />
            </Grid>
            {otherUserData.admin && (
              <Grid item>
                <ManageInviteButton onClick={handleInvite} />
              </Grid>
            )}
            <Grid item>
              <SettingsSaveButton disabled={!hasChange} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </form>
  )
}

SettingsContent.propTypes = {
  setOpen: PropTypes.func,
}

export default SettingsContent