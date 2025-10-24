import { makeStyles } from '@mui/styles'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Button } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import GridContainer from '../../mui-pro/Grid/GridContainer'
import GridItem from '../../mui-pro/Grid/GridItem'
import { SET_SELECTED_PAGE } from '../../store/ui'
const customTheme = createTheme({
  palette: {
    primary: {
      main: '#52b274',
    },
    secondary: {
      main: '#E91E63',
    },
  },
})
const useStyles = makeStyles((theme) => ({
  root: {
    width: '90%',
    textAlign: 'center',
    alignContent: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: '5px',
    },
  },
  emptyMessage: {
    textAlign: 'center',
  },
  paragraph: {
    width: '45%',
    display: 'block',
    alignContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginTop: '20px',
    },
  },
  image: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    alignContent: 'center',
    [theme.breakpoints.down('sm')]: {
      height: '130px',
    },
  },
  buttons: {
    margin: '20px 20px 20px 20px',
  },
}))
function ActivityEmptyList() {
  const classes = useStyles()

  const history = useHistory()
  const dispatch = useDispatch()
  const handleGoToSearch = () => {
    dispatch(SET_SELECTED_PAGE(1))
    history.push('/search')
  }
  return (
    <GridContainer className={classes.root}>
      <GridItem xs={12}>
        <p className={classes.paragraph}>
          Welcome to Quote Vote. To read some ideas you need to start following people. You can find your friends or you
          could go to the search page and follow anyone.
        </p>
      </GridItem>
      <GridItem xs={12}>
        <img
          alt="Add Buddy / Find Posts"
          src="/assets/ActivityFind.svg"
        />
      </GridItem>
      <GridItem xs={12}>
  <ThemeProvider theme={customTheme}>
          <Button variant="contained" color="secondary" className={classes.buttons}>
            FIND FRIENDS
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.buttons}
            onClick={handleGoToSearch}
          >
            GO TO SEARCH
          </Button>
  </ThemeProvider>
      </GridItem>
    </GridContainer>
  )
}

export default ActivityEmptyList
