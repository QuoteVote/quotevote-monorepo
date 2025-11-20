import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
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

    // Initialize theme mode from user preference or localStorage
    const getInitialThemeMode = () => {
        if (isLoggedIn && user.themePreference) {
            return user.themePreference
        }
        const savedTheme = localStorage.getItem('themeMode')
        return savedTheme || 'light'
    }

    const [themeMode, setThemeMode] = useState(getInitialThemeMode)

    // Update theme when user logs in/out or user preference changes
    useEffect(() => {
        if (isLoggedIn && user.themePreference) {
            setThemeMode(user.themePreference)
            localStorage.setItem('themeMode', user.themePreference)
        } else if (!isLoggedIn) {
            const savedTheme = localStorage.getItem('themeMode') || 'light'
            setThemeMode(savedTheme)
        }
    }, [isLoggedIn, user.themePreference])

    const theme = useMemo(
        () => createTheme(themeMode === 'dark' ? darkTheme : lightTheme),
        [themeMode]
    )

    const toggleTheme = () => {
        const newMode = themeMode === 'light' ? 'dark' : 'light'
        setThemeMode(newMode)
        // Always update localStorage for immediate persistence
        localStorage.setItem('themeMode', newMode)
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
