/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React from 'react'
import { Link } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import { makeStyles } from '@mui/styles'

import Card from 'mui-pro/Card/Card'
import CardHeader from 'mui-pro/Card/CardHeader'
import CardBody from 'mui-pro/Card/CardBody'

export default function SearchResultsView({ searchResults, isLoading, isError }) {
  const classes = sty()

  // If searchResults query in
  // components/SearchContainer/index.js doesn't work
  // Show an error
  if (isError) {
    return (
      <Card className={classes.progress}>
        An error has occured.c
      </Card>
    )
  }

  return (
    <div
      style={{
        zIndex: 10, overflowY: 'scroll', height: '100%', maxHeight: '100%',
      }}
    >
      {/* If it's loading, show a spinner */}
      {isLoading ? (
        <Card className={classes.progress}>
          <CircularProgress disableShrink style={{ margin: 'auto' }} />
        </Card>
      ) : (
        <>
          {/* searchResults has more than one query.
            *  Interate over the object to check each query's results
            */
          }
          {Object.keys(searchResults).map((resultCategory, id) => {
            // searchresult is an object, using resultCategory as a key
            // returning the name of the query being ran by searchResults
            const category = searchResults[resultCategory]
            // If the query is empty, display the the approiate header, and "No Results"
            if (category.length === 0) {
              let typename
              switch (resultCategory) {
                case 'searchCreator':
                  typename = 'Username'
                  break
                case 'searchContent':
                  typename = 'Content'
                  break
                // Domain search to be added later
                // case 'searchDomain':
                //   typename = 'Domain'
                //   break
                default:
                  typename = '' // This should never happen.
                  break
              }
              return (
                <Card
                  className={classes.category}
                  style={{ zIndex: 10 }}
                  key={`${resultCategory}${id}`}
                >
                  <CardHeader className={classes.name}>{typename}</CardHeader>
                  <CardBody>
                    No Results
                  </CardBody>
                </Card>
              )
            }

            // If the query is successful, then fill it with data.
            return (
              <Card
                className={classes.category}
                style={{ zIndex: 10 }}
                key={`${resultCategory}${id}`}
              >
                <CardHeader className={classes.name}>{category[0].__typename}</CardHeader>
                <CardBody className={classes.results}>
                  {category.map((content) => {
                    // we may want to refactor this into a switch statement, to allow for domain queries
                    const isUser = resultCategory === 'searchCreator'
                    const result = isUser ? content.name : content.title
                    const link = isUser ?
                      `/${content.name.replace(/\s/g, '')}` :
                      `/boards/${content.domain.key}/content/${content.domain._id}`
                    return (
                      <Grid
                        container
                        key={content._id}
                        component={Link}
                        to={link}
                      >
                        <Grid
                          item
                          xs={12}
                          className={classes.elevation1}
                        >
                          { result }
                        </Grid>
                      </Grid>
                    )
                  })}
                </CardBody>
              </Card>
            )
          })}
          {/* Adds additional spacing so the bottom of the list cna be seen */}
          <div style={{ margin: '64px 0', zIndex: 10 }}>End of Results</div>
        </>
      )}
    </div>
  )
}

const sty = makeStyles({
  progress: {
    zIndex: 20,
    padding: 8,
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
    borderBottomLeftRadius: '6px',
    borderBottomRightRadius: '6px',
  },
  category: {
    display: 'flex',
    flexDirection: 'column',
    background: '#f3f4f5',
  },
  elevation1: {
    borderBottom: '1px solid #f3f4f5',
    padding: '20px',
    '& :last-child': {
      border: 'none',
    },
  },
})
