import React, { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'

// MUI
import { ThemeProvider } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import {
  Typography, Grid,
} from '@mui/material'

// Local
import AvatarIconButtons from './AvatarIconButtons'
import AvatarOptionButtons from './AvatarOptionButtons'
import theme from '../../themes/MainTheme'

const useStyles = makeStyles({
  fullCard: {
    paddingTop: 30,
  },
  heading: {
    color: '#56DA9C',
    fontSize: 40,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, .6)',
    height: 205,
    borderRadius: 5,
  },
})

/**
 * Creating a Users Avataaar
 * @function
 * @returns {JSX.Element}
 */
function ChangePhoto() {
  const user = useSelector((state) => state.user.data)
  const [avatarOptionsArray, setAvatarOptionsArray] = useState()
  const [updatedAvatar, setUpdatedAvatar] = useState()
  const [colorOptions, setColorOptions] = useState() // eslint-disable-line no-unused-vars
  const [selectedOptions, setSelectedOptions] = useState()
  let defaultAvatar = {}
  if (updatedAvatar !== undefined) {
    defaultAvatar = updatedAvatar
  } else if (user.avatar && typeof user.avatar === 'object') { // check user.avatar exists
    defaultAvatar = user.avatar
  }

  const classes = useStyles()

  const handleIconClick = useCallback((category) => {
    const displayAvatarOptions = [] // Define inside to avoid stale closure or make it a dep
    const { name, options } = category
    // defaultAvatar needs to be a dependency if used from outside
    // For simplicity, let's assume defaultAvatar is stable or re-evaluate its definition
    // Current defaultAvatar is calculated based on updatedAvatar and user.avatar

    let currentDefaultAvatar = {}
    if (updatedAvatar !== undefined) {
      currentDefaultAvatar = updatedAvatar
    } else if (user.avatar && typeof user.avatar === 'object') {
      currentDefaultAvatar = user.avatar
    }

    switch (name) {
      case 'topType':
        for (let i = 0; i < options.length; i++) {
          const avatarCategoryDisplay = { ...currentDefaultAvatar }
          avatarCategoryDisplay.topType = options[i]
          displayAvatarOptions.push(avatarCategoryDisplay)
        }
        setSelectedOptions(name)
        setAvatarOptionsArray(displayAvatarOptions)
        break
      case 'eyebrowType':
        for (let i = 0; i < options.length; i++) {
          const avatarCategoryDisplay = { ...currentDefaultAvatar }
          avatarCategoryDisplay.eyebrowType = options[i]
          displayAvatarOptions.push(avatarCategoryDisplay)
        }
        setSelectedOptions(name)
        setColorOptions(null)
        setAvatarOptionsArray(displayAvatarOptions)
        break
      case 'eyeType':
        for (let i = 0; i < options.length; i++) {
          const avatarCategoryDisplay = { ...currentDefaultAvatar }
          avatarCategoryDisplay.eyeType = options[i]
          displayAvatarOptions.push(avatarCategoryDisplay)
        }
        setSelectedOptions(name)
        setColorOptions(null)
        setAvatarOptionsArray(displayAvatarOptions)
        break
      case 'clotheType':
        for (let i = 0; i < options.length; i++) {
          const avatarCategoryDisplay = { ...currentDefaultAvatar }
          avatarCategoryDisplay.clotheType = options[i]
          displayAvatarOptions.push(avatarCategoryDisplay)
        }
        setSelectedOptions(name)
        setAvatarOptionsArray(displayAvatarOptions)
        break
      case 'skinColor':
        for (let i = 0; i < options.length; i++) {
          const avatarCategoryDisplay = { ...currentDefaultAvatar }
          avatarCategoryDisplay.skinColor = options[i]
          displayAvatarOptions.push(avatarCategoryDisplay)
        }
        setSelectedOptions(name)
        setColorOptions(null)
        setAvatarOptionsArray(displayAvatarOptions)
        break
      case 'facialHairType':
        for (let i = 0; i < options.length; i++) {
          const avatarCategoryDisplay = { ...currentDefaultAvatar }
          avatarCategoryDisplay.facialHairType = options[i]
          displayAvatarOptions.push(avatarCategoryDisplay)
        }
        setSelectedOptions(name)
        setAvatarOptionsArray(displayAvatarOptions)
        break
      case 'mouthType':
        for (let i = 0; i < options.length; i++) {
          const avatarCategoryDisplay = { ...currentDefaultAvatar }
          avatarCategoryDisplay.mouthType = options[i]
          displayAvatarOptions.push(avatarCategoryDisplay)
        }
        setSelectedOptions(name)
        setColorOptions(null)
        setAvatarOptionsArray(displayAvatarOptions)
        break
      case 'accessoriesType':
        for (let i = 0; i < options.length; i++) {
          const avatarCategoryDisplay = { ...currentDefaultAvatar }
          avatarCategoryDisplay.accessoriesType = options[i]
          displayAvatarOptions.push(avatarCategoryDisplay)
        }
        setSelectedOptions(name)
        setColorOptions(null)
        setAvatarOptionsArray(displayAvatarOptions)
        break
      default:
        setSelectedOptions(null)
    }
  }, [updatedAvatar, user.avatar, setSelectedOptions, setAvatarOptionsArray, setColorOptions])

  return (
    <ThemeProvider theme={theme}>
      <Grid container className={classes.fullCard} display="flex" direction="column" alignItems="center">
        <Grid item>
          <Typography className={classes.heading}>
            Create your avatar
          </Typography>
        </Grid>
        <Grid item container>
          {!selectedOptions ? <AvatarIconButtons setSelectedOptions={setSelectedOptions} defaultAvatar={defaultAvatar} updatedAvatar={updatedAvatar} handleIconClick={handleIconClick} /> : <AvatarOptionButtons avatarOptionsArray={avatarOptionsArray} setUpdatedAvatar={setUpdatedAvatar} updatedAvatar={updatedAvatar} selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />}
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

export default ChangePhoto
