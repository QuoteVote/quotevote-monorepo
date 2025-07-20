import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import { green } from '@mui/material/colors'
import React from 'react'
import { useHistory } from 'react-router-dom'

const GetAccessButtonStyle = styled(Button)(() => ({
  color: 'white',
  backgroundColor: green[500],
  '&:hover': {
    backgroundColor: green[700],
  },
  padding: '5px 10px',
  borderRadius: '8px',
}))

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
