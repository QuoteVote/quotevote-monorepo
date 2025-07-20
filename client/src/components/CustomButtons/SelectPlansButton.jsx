import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import { common } from '@mui/material/colors'

const SelectPlansButton = styled(Button)(() => ({
  color: common.white,
  borderColor: 'white',
  width: 120,
  height: 40,
}))

export default SelectPlansButton
