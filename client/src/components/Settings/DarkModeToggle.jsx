import {
  FormControlLabel,
  Switch,
  Paper,
  Typography,
  Box,
  Fade,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Brightness4Icon from '@material-ui/icons/Brightness4'
import Brightness7Icon from '@material-ui/icons/Brightness7'
import { useTheme } from '../../Context/ThemeContext'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(2),
    background: theme.palette.mode === 'dark' ?
      'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)' :
      'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    border: `1px solid ${theme.palette.divider}`,
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.palette.mode === 'dark' ?
        '0 8px 25px rgba(0,0,0,0.3)' :
        '0 8px 25px rgba(0,0,0,0.1)',
    },
  },
  toggleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: theme.palette.mode === 'dark' ?
      'linear-gradient(135deg, #52b274 0%, #4a9d66 100%)' :
      'linear-gradient(135deg, #52b274 0%, #66c587 100%)',
    color: '#ffffff',
    transition: 'all 0.3s ease-in-out',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 600,
    fontSize: '1.1rem',
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(0.5),
  },
  description: {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
    lineHeight: 1.4,
  },
  switch: {
    '& .MuiSwitch-switchBase': {
      color: theme.palette.grey[300],
      '&.Mui-checked': {
        color: '#52b274',
        '& + .MuiSwitch-track': {
          backgroundColor: '#52b274',
          opacity: 0.5,
        },
      },
    },
    '& .MuiSwitch-track': {
      backgroundColor: theme.palette.grey[400],
      opacity: 0.3,
    },
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.spacing(1),
    fontSize: '0.75rem',
    fontWeight: 500,
    marginLeft: theme.spacing(1),
    background: theme.palette.mode === 'dark' ?
      'rgba(82, 178, 116, 0.2)' :
      'rgba(82, 178, 116, 0.1)',
    color: '#52b274',
    border: '1px solid rgba(82, 178, 116, 0.3)',
  },
}))

const DarkModeToggle = () => {
  const classes = useStyles()
  const { toggleTheme, isDarkMode } = useTheme()

  return (
    <Paper className={classes.paper} elevation={0}>
      <Box className={classes.toggleContainer}>
        <Box className={classes.labelContainer}>
          <Fade in timeout={300}>
            <Box className={classes.iconContainer}>
              {isDarkMode ? (
                <Brightness4Icon fontSize="large" />
              ) : (
                <Brightness7Icon fontSize="large" />
              )}
            </Box>
          </Fade>
          <Box className={classes.textContainer}>
            <Typography className={classes.title}>
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              <span className={classes.badge}>
                Active
              </span>
            </Typography>
            <Typography className={classes.description}>
              {isDarkMode ? (
                'Easier on your eyes in low-light environments. Switch to light mode for bright conditions.'
              ) : (
                'Perfect for well-lit environments. Switch to dark mode to reduce eye strain at night.'
              )}
            </Typography>
          </Box>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              className={classes.switch}
              size="medium"
            />
          }
          label=""
        />
      </Box>
    </Paper>
  )
}

export default DarkModeToggle
