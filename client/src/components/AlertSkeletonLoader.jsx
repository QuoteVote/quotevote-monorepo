import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import Skeleton from '@mui/material/Skeleton'
import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from '@mui/material'
import withWidth from 'utils/withWidth'

function AlertSkeletonLoader({ cols, width }) {
  const iterator = cols > 1 ? 12 : 3
  const numberOfRows = Array.from(Array(iterator).keys())
  if (cols > 1) {
    return (
      <ImageList cols={width === 'xs' ? 1 : cols}>
        {numberOfRows.map((item) => (
          <ImageListItem
            key={item}
            cols={1}
            style={{ marginTop: width === 'xs' ? -25 : -50 }}
          >
            <Skeleton animation="wave" height={300} />
          </ImageListItem>
        ))}
      </ImageList>
    )
  }

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="stretch"
      spacing={0}
      style={{ marginTop: -50 }}
    >
      {numberOfRows.map((item) => (
        <Grid item key={item} style={{ marginBottom: -100 }}>
          <Skeleton animation="wave" height={300} />
        </Grid>
      ))}
    </Grid>
  )
}

AlertSkeletonLoader.propTypes = {
  cols: PropTypes.number,
  width: PropTypes.oneOf(['lg', 'md', 'sm', 'xl', 'xs']).isRequired,
}

export default withWidth()(AlertSkeletonLoader)
