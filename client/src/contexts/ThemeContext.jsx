import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createTheme } from '@material-ui/core/styles';

const ThemeContext = createContext();

// Predefined themes
export const PREDEFINED_THEMES = {
  LIGHT: {
    type: 'LIGHT',
    name: 'Light Mode',
    colors: {
      primary: '#52b274',
      secondary: '#E91E63',
      background: '#EEF4F9',
      text: '#000000',
    },
  },
  DARK: {
    type: 'DARK',
    name: 'Dark Mode',
    colors: {
      primary: '#4CAF50',
      secondary: '#FF4081',
      background: '#121212',
      text: '#FFFFFF',
    },
  },
  HIGH_CONTRAST: {
    type: 'HIGH_CONTRAST',
    name: 'High Contrast',
    colors: {
      primary: '#000000',
      secondary: '#FFFFFF',
      background: '#FFFFFF',
      text: '#000000',
    },
  },
};

// Theme reducer
const themeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        currentTheme: action.payload,
        isCustom: action.payload.type === 'CUSTOM',
      };
    case 'UPDATE_CUSTOM_COLORS':
      return {
        ...state,
        currentTheme: {
          ...state.currentTheme,
          customColors: action.payload,
        },
        isCustom: true,
      };
    case 'RESET_TO_DEFAULT':
      return {
        ...state,
        currentTheme: PREDEFINED_THEMES.LIGHT,
        isCustom: false,
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  currentTheme: PREDEFINED_THEMES.LIGHT,
  isCustom: false,
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);
  const userData = useSelector((state) => state.user.data);

  // Load user theme on mount or when user data changes
  useEffect(() => {
    if (userData?.theme) {
      if (userData.theme.type === 'CUSTOM' && userData.theme.customColors) {
        dispatch({
          type: 'SET_THEME',
          payload: {
            type: 'CUSTOM',
            customColors: userData.theme.customColors,
          },
        });
      } else if (PREDEFINED_THEMES[userData.theme.type]) {
        dispatch({
          type: 'SET_THEME',
          payload: PREDEFINED_THEMES[userData.theme.type],
        });
      }
    } else if (userData && !userData.theme) {
      // User exists but has no theme set, use default
      dispatch({
        type: 'SET_THEME',
        payload: PREDEFINED_THEMES.LIGHT,
      });
    }
  }, [userData]);

  // Create Material-UI theme based on current theme
  const muiTheme = createTheme({
    palette: {
      primary: {
        main: state.currentTheme.customColors?.primary || state.currentTheme.colors?.primary || '#52b274',
        contrastText: '#fff',
      },
      secondary: {
        main: state.currentTheme.customColors?.secondary || state.currentTheme.colors?.secondary || '#E91E63',
        contrastText: '#fff',
      },
      background: {
        default: state.currentTheme.customColors?.background || state.currentTheme.colors?.background || '#EEF4F9',
      },
      text: {
        primary: state.currentTheme.customColors?.text || state.currentTheme.colors?.text || '#000000',
      },
    },
    activityCards: {
      quoted: {
        color: '#E36DFA',
        fontColor: '#000000',
      },
      commented: {
        color: '#FDD835',
        fontColor: '#000000',
      },
      upvote: {
        color: state.currentTheme.customColors?.primary || state.currentTheme.colors?.primary || '#52b274',
        fontColor: '#000000',
      },
      downvote: {
        color: '#FF6060',
        fontColor: '#000000',
      },
      submitted: {
        color: '#000000',
        fontColor: '#000000',
      },
      hearted: {
        color: '#F16C99',
        fontColor: '#000000',
      },
      posted: {
        color: '#FFFFFF',
        fontColor: '#000000',
      },
      trending: {
        color: '#2196F3',
        fontColor: '#000000',
      },
    },
    subHeader: {
      activeIcon: {
        color: state.currentTheme.customColors?.primary || state.currentTheme.colors?.primary || '#52b274',
      },
      default: {
        color: state.currentTheme.customColors?.text || state.currentTheme.colors?.text || 'black',
      },
      followButton: {
        backgroundColor: state.currentTheme.customColors?.primary || state.currentTheme.colors?.primary || '#52b274',
        color: 'white',
      },
    },
  });

  const setTheme = (theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const updateCustomColors = (colors) => {
    dispatch({ type: 'UPDATE_CUSTOM_COLORS', payload: colors });
  };

  const resetToDefault = () => {
    dispatch({ type: 'RESET_TO_DEFAULT' });
  };

  const value = {
    currentTheme: state.currentTheme,
    isCustom: state.isCustom,
    muiTheme,
    setTheme,
    updateCustomColors,
    resetToDefault,
    predefinedThemes: PREDEFINED_THEMES,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
