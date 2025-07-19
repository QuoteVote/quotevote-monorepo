import { TextField, Grid } from '@mui/material'
import PropTypes from 'prop-types'

const CreditCardInput = ({
  cardNumberInputProps,
  cardExpiryInputProps,
  cardCVCInputProps,
  containerStyle,
  inputStyle,
  customTextLabels,
  fieldClassName,
}) => {
  const formatCardNumber = (value) => {
    // Remove all non-digits
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    }
    return v
  }

  const formatExpiry = (value) => {
    // Remove all non-digits
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return v
  }

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value)
    e.target.value = formatted
    if (cardNumberInputProps.onChange) {
      cardNumberInputProps.onChange(e)
    }
  }

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value)
    e.target.value = formatted
    if (cardExpiryInputProps.onChange) {
      cardExpiryInputProps.onChange(e)
    }
  }

  const handleCVCChange = (e) => {
    // Only allow digits and limit to 4 characters
    const v = e.target.value.replace(/\D/g, '').substring(0, 4)
    e.target.value = v
    if (cardCVCInputProps.onChange) {
      cardCVCInputProps.onChange(e)
    }
  }

  return (
    <Grid container spacing={2} style={containerStyle}>
      <Grid item xs={12}>
        <TextField
          {...cardNumberInputProps}
          fullWidth
          label={customTextLabels?.cardNumberPlaceholder || 'Card Number'}
          variant="outlined"
          onChange={handleCardNumberChange}
          style={inputStyle}
          className={fieldClassName}
          inputProps={{
            maxLength: 19, // 16 digits + 3 spaces
            ...cardNumberInputProps.inputProps,
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          {...cardExpiryInputProps}
          fullWidth
          label="MM/YY"
          variant="outlined"
          onChange={handleExpiryChange}
          style={inputStyle}
          className={fieldClassName}
          inputProps={{
            maxLength: 5, // MM/YY format
            ...cardExpiryInputProps.inputProps,
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          {...cardCVCInputProps}
          fullWidth
          label="CVC"
          variant="outlined"
          onChange={handleCVCChange}
          style={inputStyle}
          className={fieldClassName}
          inputProps={{
            maxLength: 4,
            ...cardCVCInputProps.inputProps,
          }}
        />
      </Grid>
    </Grid>
  )
}

CreditCardInput.propTypes = {
  cardNumberInputProps: PropTypes.object,
  cardExpiryInputProps: PropTypes.object,
  cardCVCInputProps: PropTypes.object,
  containerStyle: PropTypes.object,
  inputStyle: PropTypes.object,
  customTextLabels: PropTypes.object,
  fieldClassName: PropTypes.string,
}

CreditCardInput.defaultProps = {
  cardNumberInputProps: {},
  cardExpiryInputProps: {},
  cardCVCInputProps: {},
  containerStyle: {},
  inputStyle: {},
  customTextLabels: {},
  fieldClassName: '',
}

export default CreditCardInput 