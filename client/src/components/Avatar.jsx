import React from 'react'
import Avatar from 'avataaars'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'

/**
  * Display an avataaar | https://avataaars.com/
  * @function
  * {param} props
  * returns {JSX.Element}
*/

function DisplayAvatar(props) {
  const muiTheme = useTheme()
  const {
    topType,
    accessoriesType,
    hairColor,
    facialHairType,
    facialHairColor,
    clotheType,
    clotheColor,
    eyeType,
    eyebrowType,
    mouthType,
    skinColor,
    hatColor,
    height,
  } = props

  const style = {
    height,
    width: height,
    backgroundColor: 'transparent',
    borderRadius: '50%',
  }

  return (
    <>
      <Avatar
        avatarStyle="Circle"
        topType={topType}
        hatColor={hatColor}
        accessoriesType={accessoriesType}
        hairColor={hairColor}
        facialHairType={facialHairType}
        facialHairColor={facialHairColor}
        clotheType={clotheType}
        clotheColor={clotheColor}
        eyeType={eyeType}
        eyebrowType={eyebrowType}
        mouthType={mouthType}
        skinColor={skinColor}
        style={style}
      />
    </>
  )
}

DisplayAvatar.propTypes = {
  topType: PropTypes.string,
  accessoriesType: PropTypes.string,
  hairColor: PropTypes.string,
  facialHairType: PropTypes.string,
  facialHairColor: PropTypes.string,
  clotheType: PropTypes.string,
  clotheColor: PropTypes.string,
  eyeType: PropTypes.string,
  eyebrowType: PropTypes.string,
  mouthType: PropTypes.string,
  skinColor: PropTypes.string,
  hatColor: PropTypes.string,
  height: PropTypes.any,
}

export default DisplayAvatar
