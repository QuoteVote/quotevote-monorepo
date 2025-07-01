import { useMutation } from '@apollo/react-hooks';
import { Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { UPDATE_USER_AVATAR } from '../../graphql/mutations';
import { updateAvatar } from '../../store/user';
import { avatarOptions } from '../../utils/display';
import AvatarDisplay from '../Avatar';

const useStyles = makeStyles({
  editor: { 
    marginTop: 20,
    maxWidth: 600,
    margin: '20px auto 0',
    padding: 24,
  },
  paper: {
    margin: '20px',
  },
  avatar: { marginBottom: 20 },
  select: { minWidth: 160 },
  buttonRow: { marginTop: 20 },
})

function getRandomAvatar() {
  const randomAvatar = {}
  avatarOptions.forEach((opt) => {
    const idx = Math.floor(Math.random() * opt.options.length)
    randomAvatar[opt.name] = opt.options[idx]
  })
  return randomAvatar
}

function SimpleAvatarEditor() {
  const classes = useStyles()
  const user = useSelector((state) => state.user.data)
  const dispatch = useDispatch()
  const history = useHistory()
  const [avatar, setAvatar] = useState(user.avatar || getRandomAvatar())
  const [updateUserAvatar] = useMutation(UPDATE_USER_AVATAR)

  const handleChange = (name) => (event) => {
    setAvatar({ ...avatar, [name]: event.target.value })
  }

  const handleRandomize = () => {
    setAvatar(getRandomAvatar())
  }

  const handleSave = async () => {
    const result = await updateUserAvatar({
      variables: { user_id: user._id, avatarQualities: avatar },
    })
    updateAvatar(dispatch, result.data.updateUserAvatar.avatar)
    history.push('/profile')
  }

  return (
    <Paper elevation={2} className={classes.paper}>
      <Grid container className={classes.editor} direction="column" alignItems="center">
        <Grid item className={classes.avatar}>
          <AvatarDisplay height={180} width={180} {...avatar} />
        </Grid>
        <Grid item container spacing={2} justify="center">
          {avatarOptions.map((opt) => (
            <Grid item key={opt.name}>
              <FormControl className={classes.select}>
                <InputLabel>{opt.displayName}</InputLabel>
                <Select value={avatar[opt.name] || ''} onChange={handleChange(opt.name)}>
                  {opt.options.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ))}
        </Grid>
        <Grid item container className={classes.buttonRow} spacing={2} justify="center">
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleRandomize}>
              Randomize
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={handleSave}>
              Save Avatar
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default SimpleAvatarEditor
