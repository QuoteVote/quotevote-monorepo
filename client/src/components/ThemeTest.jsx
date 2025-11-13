import React from 'react'
import { Paper, Typography, Button, Box } from '@material-ui/core'
import { makeStyles, useTheme as useMuiTheme } from '@material-ui/core/styles'
import { useTheme } from '../Context/ThemeContext'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
    margin: theme.spacing(2),
    maxWidth: 600,
  },
  section: {
    marginBottom: theme.spacing(2),
  },
  colorBox: {
    width: 50,
    height: 50,
    display: 'inline-block',
    marginRight: theme.spacing(1),
    border: '1px solid',
    borderColor: theme.palette.divider,
  },
}))

const ThemeTest = () => {
  const classes = useStyles()
  const muiTheme = useMuiTheme()
  const { themeMode, toggleTheme, isDarkMode } = useTheme()

  return (
    <Paper className={classes.container}>
      <Typography variant="h4" gutterBottom>
        Theme Test Component
      </Typography>
      
      <Box className={classes.section}>
        <Typography variant="h6">Current Theme: {themeMode}</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={toggleTheme}
          style={{ marginTop: 8 }}
        >
          Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
        </Button>
      </Box>

      <Box className={classes.section}>
        <Typography variant="h6">Theme Colors:</Typography>
        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
          <Box>
            <div 
              className={classes.colorBox}
              style={{ backgroundColor: muiTheme.palette.primary.main }}
            />
            <Typography variant="caption">Primary</Typography>
          </Box>
          <Box>
            <div 
              className={classes.colorBox}
              style={{ backgroundColor: muiTheme.palette.secondary.main }}
            />
            <Typography variant="caption">Secondary</Typography>
          </Box>
          <Box>
            <div 
              className={classes.colorBox}
              style={{ backgroundColor: muiTheme.palette.background.default }}
            />
            <Typography variant="caption">Background</Typography>
          </Box>
          <Box>
            <div 
              className={classes.colorBox}
              style={{ backgroundColor: muiTheme.palette.background.paper }}
            />
            <Typography variant="caption">Paper</Typography>
          </Box>
        </Box>
      </Box>

      <Box className={classes.section}>
        <Typography variant="h6">Custom Theme Properties:</Typography>
        <Typography variant="body2">
          Activity Card - Upvote Color: {muiTheme.custom?.activityCards?.upvote?.color || 'Not available'}
        </Typography>
        <Typography variant="body2">
          Activity Card - Downvote Color: {muiTheme.custom?.activityCards?.downvote?.color || 'Not available'}
        </Typography>
      </Box>

      <Box className={classes.section}>
        <Typography variant="body1">
          This component demonstrates the theme switching functionality. 
          The colors and styles should change when you toggle between light and dark modes.
        </Typography>
      </Box>
    </Paper>
  )
}

export default ThemeTest
