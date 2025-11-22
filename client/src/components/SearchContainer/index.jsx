/* eslint-disable react/prop-types */
import { useState } from 'react'
import { makeStyles, fade } from '@material-ui/core/styles'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
import Card from 'mui-pro/Card/Card'
import CardHeader from 'mui-pro/Card/CardHeader'
import { useQuery } from '@apollo/react-hooks'

import { SEARCH } from '@/graphql/query'
import SearchResultsView from './SearchResults'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    zIndex: 10,
    flex: 1,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.08)'
      : fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.12)'
        : fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    border: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(2),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: 0,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.text.secondary,
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    color: theme.palette.text.primary,
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.7,
    },
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    flexBasis: 300,
    minWidth: 0,
    flexWrap: 'inherit',
    height: '58px',
    zIndex: 10,
  },
  input: {
    marginLeft: '10px',
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },

  name: {
    display: 'table-cell',
    textOverflow: 'ellipsis',
    width: '100px',
    whiteSpace: 'nowrap',
    background: theme.palette.background.paper,
    fontFamily: 'Lato,Helvetica Neue,Arial,Helvetica,sans-serif',
    fontSize: '1em',
    padding: '.4em 1em',
    fontWeight: 700,
    color: theme.palette.text.primary,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  results: {
    width: '100%',
    display: 'table-cell',
    background: theme.palette.background.paper,
    borderLeft: `1px solid ${theme.palette.divider}`,
    borderBottom: `2px solid ${theme.palette.divider}`,
  },
  paper: {
    textAlign: 'center',
    backgroundColor: theme.palette.background.paper,
  },
  progress: {
    position: 'absolute',
    top: '100%',
    width: '18em',
    textAlign: 'center',
    transformOrigin: 'center top',
    background: theme.palette.background.paper,
    left: 0,
  },
  ruleStyle: {
    width: '200px',
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
  textinput: {
    display: 'flex',
    flexDirection: 'column',
  },
}))
function SidebarSearchView(props) {
  const [searchText, updateSearch] = useState('')
  const { loading, error, data } = useQuery(SEARCH, {
    variables: { text: searchText },
  })

  const handleTextChange = async ({ target: { value } }) => {
    if (value.trim()) {
      updateSearch(value)
    }
  }
  const classes = useStyles()

  const { Display } = props
  return (
    <div
      style={{
        flex: 1, display: Display || 'block', margin: '5px', marginRight: '16px', height: '90vh',
      }}
    >
      <Card style={{ zIndex: 10, height: 'fit-content' }}>
        <CardHeader
          style={{
            margin: '5px', paddingLeft: 0, paddingRight: 5,
          }}
        >
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onChange={handleTextChange}
            />
          </div>
        </CardHeader>

      </Card>
      {data && (
        <SearchResultsView
          searchResults={data}
          isLoading={loading}
          isError={error}
        />
      )}
    </div>
  )
}
export default SidebarSearchView
