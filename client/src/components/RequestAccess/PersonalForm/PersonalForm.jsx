import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import { TextField } from '@material-ui/core'
import PropTypes from 'prop-types'
import requestAccessStyles from '../requestAccessStyles'
import PaymentMethod from '../PaymentMethod/PaymentMethod'

const useStyles = makeStyles(requestAccessStyles)

const PersonalForm = (props) => {
  const classes = useStyles()
  const {
    requestInviteSuccessful,
    handleSubmit,
    isContinued,
    onContinue,
    errors,
    register,
    setCardDetails,
    cardDetails,
    onSubmit,
    errorMessage,
    loading,
  } = props

  return (
    <Grid container justify="center" style={{ marginRight: 24 }} spacing={2}>
      <Grid item xs={12}>
        <Typography align="center" className={classes.header}>
          {requestInviteSuccessful ? 'Thank you for' : 'Get access to your'}
          {' '}
          <span className={classes.header} style={{ color: '#52b274' }}>
            {requestInviteSuccessful ? 'joining us' : 'Personal Plan!'}
          </span>
        </Typography>
      </Grid>
      <Grid item xs={12} hidden={requestInviteSuccessful}>
        <Typography align="center" className={classes.subHeader}>
          Pay what you like, or pay nothing at all
        </Typography>
      </Grid>
      <Grid item xs={12} style={{ marginTop: requestInviteSuccessful ? '4%' : '2%' }}>
        <Grid container spacing={2}>
          <Grid container item xs={12} md={6} justify="center" alignItems="center">
            <img
              alt="Personal Plan"
              height={500}
              src="/assets/PersonalPlan.png"
              style={{
                width: '489px',
                height: '265px',
                objectFit: 'contain',
              }}
            />
          </Grid>
          {requestInviteSuccessful ? (
            <Grid container item xs={12} md={6} justify="center" alignItems="center">
              <div className={classes.opaqueBackground}>
                <Typography className={classes.message}>
                  <br />
                  When an account becomes available, an
                  <br />
                  invite will be sent to the email address you
                  <br />
                  provided.
                </Typography>
              </div>
            </Grid>
          ) : (
            <Grid item container xs={11} md={6} spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    avatar={(
                      <Typography className={classes.stepNumber}>
                        1
                      </Typography>
                    )}
                    title={(
                      <Typography
                        style={{
                          font: 'Roboto',
                          fontsize: '18px',
                          lineHeight: 1.56,
                        }}
                      >
                        Your Personal Info
                      </Typography>
                    )}
                  />

                  {!isContinued && (
                    <form onSubmit={handleSubmit(onContinue)}>
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              required
                              label="First Name"
                              name="firstName"
                              id="firstName"
                              error={errors.firstName}
                              helperText={errors.firstName && errors.firstName.message}
                              inputRef={register({
                                required: 'First Name is required',
                                minLength: {
                                  value: 1,
                                  message: 'First Name should be more than 1 character',
                                },
                                maxLength: {
                                  value: 20,
                                  message: 'First Name should be less than twenty characters',
                                },
                              })}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              required
                              label="Last Name"
                              name="lastName"
                              id="lastName"
                              error={errors.lastName}
                              helperText={errors.lastName && errors.lastName.message}
                              inputRef={register({
                                required: 'Last Name is required',
                                minLength: {
                                  value: 1,
                                  message: 'Last Name should be more than 1 character',
                                },
                                maxLength: {
                                  value: 20,
                                  message: 'Last Name should be less than twenty characters',
                                },
                              })}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              required
                              label="Email"
                              name="email"
                              id="email"
                              error={errors.email}
                              helperText={errors.email && errors.email.message}
                              inputRef={register({
                                required: 'Email is required',
                                pattern: {
                                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: 'Invalid email address',
                                },
                              })}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Button variant="contained" className={classes.greenBtn} type="submit">
                              Continue
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </form>
                  )}
                </Card>
              </Grid>
              <Grid item xs={12}>
                <PaymentMethod
                  cardDetails={cardDetails}
                  onSubmit={onSubmit}
                  isContinued={isContinued}
                  setCardDetails={setCardDetails}
                  errorMessage={errorMessage}
                  loading={loading}
                />
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

PersonalForm.propTypes = {
  requestInviteSuccessful: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isContinued: PropTypes.bool.isRequired,
  onContinue: PropTypes.func.isRequired,
  errors: PropTypes.any.isRequired,
  register: PropTypes.any.isRequired,
  setCardDetails: PropTypes.func.isRequired,
  cardDetails: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.any,
  loading: PropTypes.bool,
}
export default PersonalForm
