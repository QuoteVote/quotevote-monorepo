import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
} from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { createTheme } from '@material-ui/core/styles'
import { lightTheme, darkTheme } from '../themes/themeConfig'

const ThemeContext = createContext()

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

export function ThemeContextProvider({ children }) {
    const user = useSelector((state) => state.user.data)
    const isLoggedIn = !!user?._id

    // Initialize theme mode from localStorage (fast, before Redux finishes hydrating)
    const getInitialThemeMode = () => {
        if (typeof window !== 'undefined') {
            try {
                const savedTheme = localStorage.getItem('themeMode')
                if (savedTheme) {
                    return savedTheme
                }
            } catch (error) {
                console.warn('Failed to read theme from localStorage:', error)
            }
        }
        return 'light'
    }

    const [themeMode, setThemeMode] = useState(() => getInitialThemeMode())

    // Update theme when user logs in/out or user preference changes
    useEffect(() => {
        if (isLoggedIn && user?.themePreference) {
            setThemeMode(user.themePreference)
            try {
                localStorage.setItem('themeMode', user.themePreference)
            } catch (error) {
                console.warn('Failed to save theme to localStorage:', error)
            }
        } else if (!isLoggedIn) {
            let savedTheme = 'light'
            try {
                savedTheme = localStorage.getItem('themeMode') || 'light'
            } catch (error) {
                console.warn('Failed to read theme from localStorage:', error)
            }
            setThemeMode(savedTheme)
        } else if (isLoggedIn && !user?.themePreference) {
            try {
                const currentTheme = localStorage.getItem('themeMode') || themeMode || 'light'
                localStorage.setItem('themeMode', currentTheme)
                setThemeMode(currentTheme)
            } catch (error) {
                console.warn('Failed to sync theme preference:', error)
            }
        }
    }, [isLoggedIn, user, themeMode])

    const theme = useMemo(
        () => createTheme(themeMode === 'dark' ? darkTheme : lightTheme),
        [themeMode]
    )

    const toggleTheme = () => {
        const newMode = themeMode === 'light' ? 'dark' : 'light'
        setThemeMode(newMode)
        try {
            // Always update localStorage for immediate persistence
            localStorage.setItem('themeMode', newMode)
        } catch (error) {
            console.warn('Failed to persist theme toggle:', error)
        }
        return newMode
    }

    const value = useMemo(
        () => ({
            themeMode,
            theme,
            toggleTheme,
            isDarkMode: themeMode === 'dark',
        }),
        [themeMode, theme]
    )

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

ThemeContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export default ThemeContext
