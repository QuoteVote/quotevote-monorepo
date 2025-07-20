import CreditCardInput from './CreditCardInput'
import { makeStyles } from '@mui/styles'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { CircularProgress, TextField } from '@mui/material'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import requestAccessStyles from '../requestAccessStyles'

const useStyles = makeStyles(requestAccessStyles)

const PaymentMethod = (props) => {
  const classes = useStyles()
  const {
    isContinued, cardDetails, onSubmit, setCardDetails, isPersonal, errorMessage,
    loading,
  } = props

  const {
    register, errors, handleSubmit, getValues, setValue,
  } = useForm()

  const handleRequestAccess = () => {
    const values = getValues()
    // eslint-disable-next-line no-console
    console.log({ values, errors })
    if (!Object.keys(errors).length) { // if there are no errors proceed request access mutation
      onSubmit()
    }
  }

  return (
    <form onSubmit={handleSubmit(handleRequestAccess)}>
      <Card>
        <CardHeader
          avatar={(
            <Typography className={classes.stepNumber}>
              2
            </Typography>
          )}
          title={(
            <Typography className={classes.stepName}>
              Would you like to support this app?
            </Typography>
          )}
        />

        <input name="cardNumber" type="hidden" ref={register({ required: !isPersonal })} />
        <input name="expiry" type="hidden" ref={register({ required: !isPersonal })} />
        <input name="cvv" type="hidden" ref={register({ required: !isPersonal })} />

        {isContinued && (
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography className={classes.note}>
                  Payment will not be charged until invite is sent
                </Typography>
              </Grid>
              <Grid container item xs={12}>
                <CreditCardInput
                  cardNumberInputProps={{
                    autoFocus: !isPersonal,
                    value: cardDetails.cardNumber,
                    onChange: (e) => {
                      setValue('cardNumber', e.target.value)
                      setCardDetails({
                        ...cardDetails,
                        cardNumber: e.target.value,
                      })
                    },
                    onError: () => setValue('cardNumber', ''),
                  }}
                  cardExpiryInputProps={{
                    value: cardDetails.expiry,
                    onChange: (e) => {
                      setValue('expiry', e.target.value)
                      setCardDetails({
                        ...cardDetails,
                        expiry: e.target.value,
                      })
                    },
                    onError: () => setValue('expiry', ''),
                  }}
                  cardCVCInputProps={{
                    value: cardDetails.cvv,
                    onChange: (e) => {
                      setValue('cvv', e.target.value)
                      setCardDetails({
                        ...cardDetails,
                        cvv: e.target.value,
                      })
                    },
                    onError: () => setValue('cvv', ''),
                  }}
                  containerStyle={{ width: '100%' }}
                  inputStyle={{ width: '100%' }}
                  customTextLabels={{
                    cardNumberPlaceholder: 'Credit Card Number',
                  }}
                  fieldClassName="input"
                />
              </Grid>
              <Grid item xs={6}>
                {isPersonal && (
                  <TextField
                    value={cardDetails.cost}
                    fullWidth
                    label="Cost"
                    name="cost"
                    id="cost"
                    type="number"
                    onChange={(e) => setCardDetails({ ...cardDetails, cost: e.target.value })}
                  />
                )}
              </Grid>
              <Grid container item xs={isPersonal ? 6 : 12} alignItems="center">
                <Typography className={classes.stepName} align="center">
                  <b>
                    Total: $
                    {cardDetails.cost}
                  </b>
                </Typography>
              </Grid>
              <Grid container item xs={6} alignItems="center">
                <img
                  alt="stripe"
                  src="/assets/stripe.png"
                  style={{
                    width: '90px',
                    height: '19px',
                    opacity: 0.4,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  className={classes.greenBtn}
                  type="submit"
                  disabled={loading}
                >
                  Request Invite
                  {loading && (<CircularProgress size={20} className={classes.loadingProgress} />)}
                </Button>
              </Grid>
            </Grid>
            {errorMessage && (
              <Grid item xs={6}>
                <span className={classes.error}>
                  Error:
                  {' '}
                  {errorMessage}
                </span>
              </Grid>
            )}
          </CardContent>
        )}
      </Card>
    </form>
  )
}
PaymentMethod.defaultProps = {
  isPersonal: true,
}

PaymentMethod.propTypes = {
  cardDetails: PropTypes.object.isRequired,
  setCardDetails: PropTypes.func.isRequired,
  isContinued: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isPersonal: PropTypes.bool,
  errorMessage: PropTypes.any,
  loading: PropTypes.bool,
}

export default PaymentMethod
