import { withStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import { common } from '@mui/material/colors'

const SelectPlansButton = withStyles(() => ({
  root: {
    color: common.white,
    borderColor: 'white',
    width: 120,
    height: 40,
  },
}))(Button)

export default SelectPlansButton
