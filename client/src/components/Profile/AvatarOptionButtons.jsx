import React, { useState, useCallback } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'

// MUI
import { makeStyles } from '@mui/styles'
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { ThemeProvider } from '@mui/material/styles'

// Local
import AvatarPreview from '../Avatar'
import { avatarOptions } from '../../utils/display'
import theme from '../../themes/MainTheme'

const useStyles = makeStyles({
  card: {
    backgroundColor: 'rgba(255, 255, 255, .6)',
    height: 210,
    borderRadius: 5,
    overflowY: 'scroll',
    padding: 25,
  },
  avatar: {
    margin: 50,
    height: 200,
    width: 200,
    backgroundColor: '#65C9FF',
  },
  size: {
    height: 80,
    width: 80,
    backgroundColor: '#65C9FF',
    margin: '5px 30px 5px 15px',
    cursor: 'pointer',
  },
  backbtn: {
    backgroundColor: '#139797',
    width: 250,
    height: 70,
    fontSize: 25,
    color: 'white',
    textTransform: 'none',
    fontWeight: 'normal',
    borderRadius: 2,
    border: 'none',
    cursor: 'pointer',
    margin: 40,
  },
})

function ArticleOptions(props) {
  const { avatarOptionsArray, handleSelectAvatarOption } = props
  const classes = useStyles()
  return (
    <Grid item container display="flex" direction="row" justify="space-evenly">
      {avatarOptionsArray && avatarOptionsArray.map((option) => (
        <Avatar className={classes.size} onClick={() => handleSelectAvatarOption(option)}>
          <AvatarPreview {...option} />
        </Avatar>
      ))}
    </Grid>
  )
}

function ArticleColorOptions(props) {
  const { colorOptions, setUpdatedAvatar, setSelectedOptions } = props
  const classes = useStyles()

  function handleColorSelect(option) {
    setUpdatedAvatar(option)
    setSelectedOptions(null)
  }

  return (
    <Grid item container display="flex" direction="row" justify="space-evenly">
      {colorOptions && colorOptions.map((option) => (
        <Avatar className={classes.size} onClick={() => handleColorSelect(option)}>
          <AvatarPreview {...option} />
        </Avatar>
      ))}
    </Grid>
  )
}

function AvatarOptionButtons(props) {
  const {
    avatarOptionsArray,
    setSelectedOptions,
    setUpdatedAvatar,
    selectedOptions,
  } = props
  const [colorOptions, setColorOptions] = useState()
  const classes = useStyles()

  const groupedAvatarOptions = _.groupBy(avatarOptions, 'name')

  const {
    facialHairColor, clotheColor, hairColor, hatColor,
  } = groupedAvatarOptions

  const handleBackButtonClick = useCallback(() => {
    if (colorOptions) {
      setColorOptions(null)
    }
    if (!colorOptions) {
      setSelectedOptions(null)
    }
  }, [colorOptions, setColorOptions, setSelectedOptions])

  const handleSelectAvatarOption = useCallback((option) => {
    setUpdatedAvatar(option)
    let colors
    const displayColorOptions = []
    switch (selectedOptions) {
      case 'topType':
        if (option.topType.includes('WinterHat') || option.topType === 'Hijab' || option.topType === 'Turban') {
          colors = hatColor[0].options
          for (let i = 0; i < colors.length; i++) {
            const avatarCategoryDisplay = { ...option }
            avatarCategoryDisplay.hatColor = colors[i]
            displayColorOptions.push(avatarCategoryDisplay)
          }
        } else if (option.topType === 'LongHairFrida' || option.topType === 'Eyepatch' || option.topType === 'NoHair' || option.topType === 'Hat' || option.topType === 'LongHairShavedSides') {
          const avatarCategoryDisplay = { ...option }
          displayColorOptions.push(avatarCategoryDisplay)
        } else {
          colors = hairColor[0].options
          for (let i = 0; i < colors.length; i++) {
            const avatarCategoryDisplay = { ...option }
            avatarCategoryDisplay.hairColor = colors[i]
            displayColorOptions.push(avatarCategoryDisplay)
          }
        }
        setColorOptions(displayColorOptions)
        break
      case 'facialHairType':
        if (option.facialHairType === 'Blank') {
          const avatarCategoryDisplay = { ...option }
          displayColorOptions.push(avatarCategoryDisplay)
        } else {
          colors = facialHairColor[0].options
          for (let i = 0; i < colors.length; i++) {
            const avatarCategoryDisplay = { ...option }
            avatarCategoryDisplay.facialHairColor = colors[i]
            displayColorOptions.push(avatarCategoryDisplay)
          }
        }
        setColorOptions(displayColorOptions)
        break
      case 'clotheType':
        if (option.clotheType.includes('Blazer')) {
          const avatarCategoryDisplay = { ...option }
          displayColorOptions.push(avatarCategoryDisplay)
        } else {
          colors = clotheColor[0].options
          for (let i = 0; i < colors.length; i++) {
            const avatarCategoryDisplay = { ...option }
            avatarCategoryDisplay.clotheColor = colors[i]
            displayColorOptions.push(avatarCategoryDisplay)
          }
        }
        setColorOptions(displayColorOptions)
        break
      default:
        setColorOptions(null)
        setSelectedOptions(null)
    }
  }, [selectedOptions, setUpdatedAvatar, setColorOptions, setSelectedOptions, hatColor, hairColor, facialHairColor, clotheColor])

  return (
    <ThemeProvider theme={theme}>
      <Grid container display="flex" direction="column" alignItems="center" justify="center">
        <Grid item className={classes.card} xs={6}>
          {colorOptions ? <ArticleColorOptions colorOptions={colorOptions} setUpdatedAvatar={setUpdatedAvatar} setSelectedOptions={setSelectedOptions} /> : <ArticleOptions avatarOptionsArray={avatarOptionsArray} handleSelectAvatarOption={handleSelectAvatarOption} setUpdatedAvatar={setUpdatedAvatar} />}
        </Grid>
        <Grid item>
          <Button type="submit" className={classes.backbtn} onClick={handleBackButtonClick}>Back</Button>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

AvatarOptionButtons.propTypes = {
  avatarOptionsArray: PropTypes.array,
  setSelectedOptions: PropTypes.func,
  setUpdatedAvatar: PropTypes.func,
  selectedOptions: PropTypes.string,
}

ArticleColorOptions.propTypes = {
  colorOptions: PropTypes.array,
  setUpdatedAvatar: PropTypes.func,
  setSelectedOptions: PropTypes.func,
}

ArticleOptions.propTypes = {
  avatarOptionsArray: PropTypes.array,
  handleSelectAvatarOption: PropTypes.func,
}

export default AvatarOptionButtons
