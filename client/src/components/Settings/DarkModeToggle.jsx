import React from 'react'
import {
  FormControlLabel,
  Switch,
  Paper,
  Typography,
  Box,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Brightness4Icon from '@material-ui/icons/Brightness4'
import Brightness7Icon from '@material-ui/icons/Brightness7'
import { useTheme } from '../../Context/ThemeContext'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  toggleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  description: {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5),
  },
  switch: {
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: theme.palette.primary.main,
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}))

const DarkModeToggle = () => {
  const classes = useStyles()
  const { themeMode, toggleTheme, isDarkMode } = useTheme()

  return (
    <Paper className={classes.paper} elevation={1}>
      <Box className={classes.toggleContainer}>
        <Box className={classes.labelContainer}>
          {isDarkMode ? (
            <Brightness4Icon color="primary" />
          ) : (
            <Brightness7Icon color="primary" />
          )}
          <Box>
            <Typography variant="body1" component="div">
              Dark Mode
            </Typography>
            <Typography className={classes.description}>
              {isDarkMode 
                ? 'Switch to light theme for better visibility in bright environments'
                : 'Switch to dark theme for reduced eye strain in low-light environments'
              }
            </Typography>
          </Box>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              className={classes.switch}
              color="primary"
            />
          }
          label=""
        />
      </Box>
    </Paper>
  )
}

export default DarkModeToggle
