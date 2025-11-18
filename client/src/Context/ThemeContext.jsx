import React, { createContext, useContext, useEffect, useState } from 'react'
import { createTheme, ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import { useMutation } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import { UPDATE_USER } from '../graphql/mutations'
import { SET_USER_DATA } from '../store/user'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

const createAppTheme = (mode) => {
  const isLight = mode === 'light'
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#52b274',
        contrastText: '#fff',
      },
      secondary: {
        main: isLight ? '#E91E63' : '#f48fb1',
        contrastText: isLight ? '#fff' : '#000',
      },
      background: {
        default: isLight ? '#EEF4F9' : '#121212',
        paper: isLight ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: isLight ? '#000000' : '#ffffff',
        secondary: isLight ? '#424556' : '#b0b0b0',
      },
      divider: isLight ? '#e0e0e0' : '#333333',
      action: {
        hover: isLight ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)',
        selected: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)',
      },
    },
    // Custom theme properties for the app
    custom: {
      activityCards: {
        quoted: {
          color: isLight ? '#E36DFA' : '#ba68c8',
          fontColor: isLight ? '#000000' : '#ffffff',
        },
        commented: {
          color: isLight ? '#FDD835' : '#fff176',
          fontColor: isLight ? '#000000' : '#000000',
        },
        upvote: {
          color: '#52b274',
          fontColor: isLight ? '#000000' : '#ffffff',
        },
        downvote: {
          color: isLight ? '#FF6060' : '#ef5350',
          fontColor: isLight ? '#000000' : '#ffffff',
        },
        submitted: {
          color: isLight ? '#000000' : '#ffffff',
          fontColor: isLight ? '#000000' : '#000000',
        },
        hearted: {
          color: isLight ? '#F16C99' : '#f06292',
          fontColor: isLight ? '#000000' : '#ffffff',
        },
        posted: {
          color: isLight ? '#FFFFFF' : '#2c2c2c',
          fontColor: isLight ? '#000000' : '#ffffff',
        },
        trending: {
          color: isLight ? '#03a9f4' : '#4fc3f7',
          fontColor: isLight ? '#000000' : '#ffffff',
        },
      },
      subHeader: {
        activeIcon: {
          color: isLight ? '#00bcd4' : '#4dd0e1',
        },
        default: {
          color: isLight ? 'black' : 'white',
        },
        followButton: {
          backgroundColor: '#52b274',
          color: 'white',
        },
      },
      activityCardsComplete: {
        peach: isLight ? '#F44336' : '#ef5350',
        greenSecondary: isLight ? '#4CAF50' : '#66bb6a',
        lightblueCard: isLight ? '#00BCD4' : '#4dd0e1',
        orange: isLight ? '#FF9801' : '#ffb74d',
        gray1: isLight ? '#454545' : '#bdbdbd',
        downvotedCardAndError: isLight ? '#DA3849' : '#f44336',
        blackCard: isLight ? '#2D2A2A' : '#424242',
        greenPrimary: '#52b274',
        heartedPinkCard: isLight ? '#F16C99' : '#f06292',
        backgroundOffWhite: isLight ? '#FAFAFA' : '#1a1a1a',
        mintyGreen: isLight ? '#00E676' : '#69f0ae',
        subsectionTitleMutedBlack: isLight ? '#424556' : '#b0b0b0',
        blue: isLight ? '#56B3FF' : '#64b5f6',
        yellow: isLight ? '#FEC02F' : '#fff176',
        red: isLight ? '#FF6060' : '#ef5350',
        violet: isLight ? '#E36DFA' : '#ba68c8',
        purple: isLight ? '#791E89' : '#ab47bc',
        gray2inactive: isLight ? '#D8D8D8' : '#616161',
      },
      alerts: {
        info: isLight ? '#00CAE3' : '#4dd0e1',
        success: isLight ? '#55B559' : '#66bb6a',
        warning: isLight ? '#FF9E0F' : '#ffb74d',
        danger: isLight ? '#F55145' : '#ef5350',
        primary: isLight ? '#A72ABD' : '#ba68c8',
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? '#52b274' : '#1e1e1e',
            transition: 'background-color 0.3s ease-in-out',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isLight ? '#ffffff' : '#1e1e1e',
            transition: 'background-color 0.3s ease-in-out',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            transition: 'all 0.3s ease-in-out',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              transition: 'border-color 0.3s ease-in-out',
              '& fieldset': {
                borderColor: isLight ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: isLight ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)',
              },
            },
          },
        },
      },
    },
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
    },
  })
}

export const ThemeProvider = ({ children }) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user?.data)
  const isLoggedIn = Boolean(user?._id)
  
  // Initialize theme mode from user preference or localStorage
  const getInitialTheme = () => {
    if (isLoggedIn && user?.themePreference) {
      return user.themePreference
    }
    return localStorage.getItem('themeMode') || 'light'
  }
  
  const [themeMode, setThemeMode] = useState(getInitialTheme)
  const [updateUser] = useMutation(UPDATE_USER)
  
  // Update theme when user data changes
  useEffect(() => {
    if (isLoggedIn && user?.themePreference && user.themePreference !== themeMode) {
      setThemeMode(user.themePreference)
    }
  }, [user?.themePreference, isLoggedIn])
  
  const toggleTheme = async () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light'
    setThemeMode(newMode)
    
    // Save to localStorage for guest users
    localStorage.setItem('themeMode', newMode)
    
    // Save to user profile for logged-in users
    if (isLoggedIn && user?._id) {
      try {
        const result = await updateUser({
          variables: {
            user: {
              _id: user._id,
              themePreference: newMode,
            },
          },
        })
        
        if (result.data) {
          dispatch(SET_USER_DATA({
            ...user,
            themePreference: newMode,
          }))
        }
      } catch (error) {
        console.error('Failed to save theme preference:', error)
        // Revert on error
        setThemeMode(themeMode)
        localStorage.setItem('themeMode', themeMode)
      }
    }
  }
  
  const theme = createAppTheme(themeMode)
  
  const contextValue = {
    themeMode,
    toggleTheme,
    isDarkMode: themeMode === 'dark',
  }
  
  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
