import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { InputBase, IconButton, Fade, InputAdornment } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: '100%',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.grey[50],
    borderRadius: 12,
    padding: theme.spacing(0.75, 1.5),
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
    '&:hover': {
      backgroundColor: theme.palette.grey[100],
      borderColor: theme.palette.grey[300],
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
    },
    '&:focus-within': {
      backgroundColor: 'white',
      borderColor: '#52b274',
      boxShadow: `0 0 0 3px rgba(82, 178, 116, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08)`,
      transform: 'translateY(-1px)',
    },
  },
  searchContainerAddMode: {
    borderColor: '#52b274',
    backgroundColor: 'white',
    boxShadow: `0 0 0 3px rgba(82, 178, 116, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08)`,
  },
  input: {
    flex: 1,
    fontSize: '0.875rem',
    '& input': {
      padding: theme.spacing(0.75, 1),
      '&::placeholder': {
        color: theme.palette.text.secondary,
        opacity: 0.6,
        fontWeight: 400,
      },
    },
  },
  iconButton: {
    padding: 8,
    color: theme.palette.text.secondary,
    transition: 'all 0.2s',
    '&:hover': {
      color: '#52b274',
      backgroundColor: 'rgba(82, 178, 116, 0.12)',
    },
  },
  searchIcon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(0.5),
    fontSize: '1.2rem',
  },
  addModeIcon: {
    color: '#52b274',
  },
  clearButton: {
    padding: 6,
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.error.main,
      backgroundColor: theme.palette.error.light + '15',
    },
  },
  addModeIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    background: `linear-gradient(135deg, rgba(82, 178, 116, 0.12) 0%, rgba(74, 158, 99, 0.08) 100%)`,
    borderRadius: 8,
    marginRight: theme.spacing(0.5),
    fontSize: '0.75rem',
    color: '#52b274',
    fontWeight: 600,
  },
}))

function ChatSearchInput({ setSearch, addBuddyMode, onAddBuddyModeChange }) {
  const classes = useStyles()
  const [searchValue, setSearchValue] = useState('')

  // When addBuddyMode changes, clear search if exiting add mode
  useEffect(() => {
    if (!addBuddyMode && searchValue) {
      setSearchValue('')
      setSearch('')
    }
  }, [addBuddyMode])

  const handleInput = (e) => {
    const searchKey = e.target.value
    setSearchValue(searchKey)
    setSearch(searchKey)
  }

  const handleClear = () => {
    setSearchValue('')
    setSearch('')
    if (addBuddyMode && onAddBuddyModeChange) {
      onAddBuddyModeChange(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  const toggleAddMode = () => {
    if (onAddBuddyModeChange) {
      onAddBuddyModeChange(!addBuddyMode)
      if (!addBuddyMode) {
        // When entering add mode, focus the input
        setTimeout(() => {
          const input = document.querySelector('input[aria-label="search conversations"]')
          if (input) input.focus()
        }, 100)
      } else {
        // When exiting add mode, clear search
        setSearchValue('')
        setSearch('')
      }
    }
  }

  return (
    <div className={classes.root}>
      <form onSubmit={handleSubmit} className={`${classes.searchContainer} ${addBuddyMode ? classes.searchContainerAddMode : ''}`}>
        {addBuddyMode && (
          <div className={classes.addModeIndicator}>
            <PersonAddIcon style={{ fontSize: '1rem' }} />
            <span>Add Buddy</span>
          </div>
        )}
        <SearchIcon className={`${classes.searchIcon} ${addBuddyMode ? classes.addModeIcon : ''}`} />
        <InputBase
          className={classes.input}
          placeholder={addBuddyMode ? "Search users to add as buddy..." : "Search conversations..."}
          value={searchValue}
          onChange={handleInput}
          inputProps={{ 'aria-label': addBuddyMode ? 'search users to add' : 'search conversations' }}
          endAdornment={
            searchValue && (
              <Fade in={searchValue.length > 0}>
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleClear}
                    className={classes.clearButton}
                    aria-label="clear search"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              </Fade>
            )
          }
        />
      </form>
    </div>
  )
}

ChatSearchInput.propTypes = {
  setSearch: PropTypes.func.isRequired,
  addBuddyMode: PropTypes.bool,
  onAddBuddyModeChange: PropTypes.func,
}

ChatSearchInput.defaultProps = {
  addBuddyMode: false,
  onAddBuddyModeChange: null,
}

export default ChatSearchInput
