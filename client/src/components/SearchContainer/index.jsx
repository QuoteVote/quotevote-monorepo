/* eslint-disable react/prop-types */
import { useState } from 'react'
import { makeStyles, fade } from '@mui/styles'
import InputBase from '@mui/material/InputBase'
import Search from '@mui/icons-material/Search'
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
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
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
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
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
    color: '#ff0000',
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
    background: '0 0',
    fontFamily: 'Lato,Helvetica Neue,Arial,Helvetica,sans-serif',
    fontSize: '1em',
    padding: '.4em 1em',
    fontWeight: 700,
    color: 'rgba(0,0,0,.4)',
    borderBottom: '1px solid rgba(34,36,38,.1)',
  },
  results: {
    width: '100%',
    display: 'table-cell',
    background: '#fff',
    borderLeft: '1px solid rgba(34,36,38,.15)',
    borderBottom: '2px solid rgba(34,36,38,.1)',
  },
  paper: {
    textAlign: 'center',
  },
  progress: {
    position: 'absolute',
    top: '100%',
    width: '18em',
    textAlign: 'center',
    transformOrigin: 'center top',
    background: '#fff',
    left: 0,
  },
  ruleStyle: {
    width: '200px',
    borderBottom: '2px solid #9C27B0',
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
            backgroundColor: 'white', margin: '5px', paddingLeft: 0, paddingRight: 5,
          }}
        >
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <Search />
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
