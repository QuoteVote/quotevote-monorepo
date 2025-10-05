import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

// @material-ui/core components
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'

import styles from 'assets/jss/material-dashboard-pro-react/components/paginationStyle'

const useStyles = makeStyles(styles)

export default function Pagination(props) {
  const classes = useStyles()
  const { pages, color } = props
  return (
    <ul className={classes.pagination}>
      {pages.map((prop, key) => {
        const paginationLink = cx({
          [classes.paginationLink]: true,
          [classes[color]]: prop.active,
          [classes.disabled]: prop.disabled,
        })
        return (
          <li className={classes.paginationItem} key={key}>
            {prop.onClick !== undefined ? (
              <Button onClick={prop.onClick} className={paginationLink}>
                {prop.text}
              </Button>
            ) : (
              <Button
                onClick={() => alert(`you've clicked ${prop.text}`)}
                className={paginationLink}
              >
                {prop.text}
              </Button>
            )}
          </li>
        )
      })}
    </ul>
  )
}

Pagination.defaultProps = {
  color: 'primary',
}

Pagination.propTypes = {
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      active: PropTypes.bool,
      disabled: PropTypes.bool,
      text: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.oneOf(['PREV', 'NEXT', '...']),
      ]).isRequired,
      onClick: PropTypes.func,
    })
  ).isRequired,
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']),
}
