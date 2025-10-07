import { makeStyles } from '@mui/styles'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { TextField } from '@mui/material'
import PropTypes from 'prop-types'
import requestAccessStyles from '../requestAccessStyles'
import PaymentMethod from '../PaymentMethod/PaymentMethod'

const useStyles = makeStyles(requestAccessStyles)

const BusinessForm = (props) => {
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
            {requestInviteSuccessful ? 'joining us' : 'Business Plan!'}
          </span>
        </Typography>
      </Grid>
    <Grid item xs={12} hidden={requestInviteSuccessful}>
        <Typography align="center" className={classes.subHeader}>
          You are one step away from
          {' '}
          <b>
            unlimited access
          </b>
          {' '}
          to Quote Vote
        </Typography>
      </Grid>
      <Grid item xs={12} style={{ marginTop: requestInviteSuccessful ? '4%' : '2%' }}>
        <Grid container spacing={2}>
          <Grid container item xs={12} md={6} justify="center" alignItems="center">
            <img
              alt="Business Illustration"
              height={500}
              src="/assets/Illustration.png"
              style={{
                width: '400px',
                height: '265px',
                objectFit: 'contain',
              }}
            />
          </Grid>
          {requestInviteSuccessful ? (
            <Grid container item xs={12} md={6} justify="center" alignItems="center">
              <Typography className={classes.message}>
                <b>You selected the Business Plan</b>
                , and we
                <br />
                are excited to talk with you.
                <br />
                <br />
                When an account becomes available, an
                <br />
                invite will be sent to the email address you
                <br />
                provided.
              </Typography>
            </Grid>
          ) : (
            <Grid item container xs={12} md={6} spacing={2}>
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
                              label="Full Name"
                              name="fullName"
                              id="fullName"
                              error={errors.fullName}
                              helperText={errors.fullName && errors.fullName.message}
                              inputRef={register({
                                required: 'Full Name is required',
                                minLength: {
                                  value: 1,
                                  message: 'Full Name should be more than 1 character',
                                },
                                maxLength: {
                                  value: 20,
                                  message: 'Full Name should be less than twenty characters',
                                },
                              })}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              required
                              label="Company Name"
                              name="companyName"
                              id="companyName"
                              error={errors.companyName}
                              helperText={errors.companyName && errors.companyName.message}
                              inputRef={register({
                                required: 'Company Name is required',
                                minLength: {
                                  value: 1,
                                  message: 'Company Name should be more than 1 character',
                                },
                                maxLength: {
                                  value: 20,
                                  message: 'Company Name should be less than twenty characters',
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
  )
}

BusinessForm.propTypes = {
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
export default BusinessForm
