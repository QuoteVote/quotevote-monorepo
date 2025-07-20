import { withStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import { green } from '@mui/material/colors'
import React from 'react'
import { useHistory } from 'react-router-dom'

const GetAccessButtonStyle = withStyles(() => ({
  root: {
    color: 'white',
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
    padding: '5px 10px 5px 10px',
    borderRadius: '8px',
  },
}))(Button)

function GetAccessButton() {
  const history = useHistory()
  const handleClick = () => {
    history.push('/auth/request-access')
  }

  return (
    <GetAccessButtonStyle
      variant="contained"
      color="primary"
      onClick={handleClick}
    >
      Get Access
    </GetAccessButtonStyle>
  )
}
export default GetAccessButton
