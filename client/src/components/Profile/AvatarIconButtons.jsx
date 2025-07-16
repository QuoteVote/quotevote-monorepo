import { useMutation } from '@apollo/react-hooks'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

// MUI
import { MuiThemeProvider as ThemeProvider, makeStyles } from '@material-ui/core/styles'
import {
  Avatar, Typography, Grid, Button,
} from '@material-ui/core'

// Local
import { updateAvatar } from 'store/user'
import { UPDATE_USER_AVATAR } from '../../graphql/mutations'
import AvatarPreview from '../Avatar'
import { avatarOptions } from '../../utils/display'
import theme from '../../themes/MainTheme'
import { SET_SNACKBAR } from '../../store/ui'

// Icons

const useStyles = makeStyles({
  card: {
    backgroundColor: 'rgba(255, 255, 255, .6)',
    borderRadius: 5,
  },
  heading: {
    color: '#97999A',
    fontWeight: 'bold',
    fontSize: 16,
    padding: '10px 0px 0px 10px',
  },
  bingoButton: {
    backgroundColor: '#7DD6AD',
    color: 'white',
    fontSize: 30,
    width: 163,
    height: 88,
    marginBottom: 50,
    textTransform: 'none',
    fontWeight: 'normal',
    '&:hover': {
      backgroundColor: '#52E39F !important',
    },
  },
  avatar: {
    margin: 50,
    height: 200,
    width: 200,
    backgroundColor: '#65C9FF',
  },
  svgButton: {
    borderRadius: 100,
    height: 80,
    width: 80,
    margin: '0px 30px 0px 15px',
    '&:hover': {
      backgroundColor: 'rgba(0, 207, 110, .5) !important',
    },
  },
  avatarRow: {
    padding: 25,
    overflowY: 'scroll',
  },
})

function AvatarIconButton(props) {
  const user = useSelector((state) => state.user.data)
  const [updateUserAvatar] = useMutation(UPDATE_USER_AVATAR)
  const { defaultAvatar, handleIconClick } = props
  const dispatch = useDispatch()
  const classes = useStyles()
  const history = useHistory()

  const onSubmit = async (avatar) => {
    const newAvatar = await updateUserAvatar({ variables: { user_id: user._id, avatarQualities: avatar } })
    await updateAvatar(dispatch, newAvatar.data.updateUserAvatar.avatar)
    dispatch(SET_SNACKBAR({
      type: 'danger',
      message: 'Avatar has been updated',
      open: true,
    }))
    history.push('/search')
  }

  const groupedAvatarOptions = _.groupBy(avatarOptions, 'name')

  const {
    topType, accessoriesType, facialHairType, clotheType, mouthType, eyebrowType, eyeType, skinColor,
  } = groupedAvatarOptions

  topType.icon = '/assets/Hat.svg'
  accessoriesType.icon = '/assets/Glasses.svg'
  facialHairType.icon = '/assets/Beard.svg'
  clotheType.icon = '/assets/Shirt.svg'
  skinColor.icon = '/assets/Silhouette.svg'
  mouthType.icon = '/assets/Mouth.svg'
  eyeType.icon = '/assets/Eyes.svg'
  eyebrowType.icon = '/assets/Eyebrow.svg'

  const buttonOptions = []

  buttonOptions.push(eyebrowType, topType, accessoriesType, facialHairType, clotheType, skinColor, mouthType, eyeType)

  return (
    <ThemeProvider theme={theme}>
      <Grid container display="flex" direction="column" alignItems="center" justify="center">
        <Grid item className={classes.card} xs={6}>
          <Grid item>
            <Typography className={classes.heading}>
              choose a feature to customize
            </Typography>
          </Grid>
          <Grid item className={classes.avatarRow} container display="flex" direction="row" justify="space-evenly">
            {buttonOptions.map((category) => (
              <Button className={classes.svgButton} hover onClick={() => handleIconClick(category[0])}>
                <img src={category.icon} alt={category.name} />
              </Button>
            ))}
          </Grid>
        </Grid>
        <Grid item container display="flex" direction="column" alignItems="center" justify="center">
          <Avatar className={classes.avatar}>
            <AvatarPreview {...defaultAvatar} />
          </Avatar>
        </Grid>
        <Grid item>
          <Button
            type="submit"
            className={classes.bingoButton}
            onClick={() => onSubmit(defaultAvatar)}
          >
            Bingo
          </Button>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

AvatarIconButton.propTypes = {
  defaultAvatar: PropTypes.object,
  handleIconClick: PropTypes.func,
}

export default AvatarIconButton
