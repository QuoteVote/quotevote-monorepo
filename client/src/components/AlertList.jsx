import React from 'react'
import PropTypes from 'prop-types'
import Skeleton from '@mui/material/Skeleton'
import GridList from '@mui/material/GridList'
import GridListTile from '@mui/material/GridListTile'
import { getGridListCols, useWidth } from 'utils/display'
import Alert from './Alert'

function AlertSkeletonLoader({ limit }) {
  const rows = Array.from(Array(limit).keys())
  return (
    <div style={{ width: '90%' }}>
      {
        rows.map(() => (
          <>
            <Skeleton variant="rect" animation="wave" height={50} />
            <br />
          </>
        ))
      }
    </div>
  )
}

AlertSkeletonLoader.propTypes = {
  limit: PropTypes.number.isRequired,
}

function LoadAlertList({ data, width, selectedEvent }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ width: '90%' }}>
        <span>{`There are no results found for ${selectedEvent[0]}`}</span>
        <br></br>
      </div>
    )
  }

  return (
    <GridList cols={getGridListCols[width]}>
      {data.map((item) => (
        <GridListTile key={item.AlertTitle} cols={1}>
          <Alert
            color={item.color}
            AlertTitle={item.AlertTitle}
            AlertBody={item.AlertBody}
            time={item.time}
            points={item.points}
            creator={item.creator}
          />
        </GridListTile>
      ))}
    </GridList>
  )
}
LoadAlertList.propTypes = {
  length: PropTypes.number.isRequired,
  width: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  selectedEvent: PropTypes.array,
}

export default function AlertList({
  Data, loading, limit, selectedEvent,
}) {
  const width = useWidth()
  // console.log('AlertList rendering selectedEvent', selectedEvent)
  if (loading) return <AlertSkeletonLoader limit={limit} />
  return <LoadAlertList selectedEvent={selectedEvent} data={Data} width={width} />
}

AlertList.propTypes = {
  Data: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  limit: PropTypes.number.isRequired,
  selectedEvent: PropTypes.array,
}
