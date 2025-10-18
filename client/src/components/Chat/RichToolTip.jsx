import {
  Box, ClickAwayListener, Fade, Paper, Popper,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import React from 'react'
import PropTypes from 'prop-types'

const useStyles = (props) => makeStyles((theme) => {
  const color = props.tipColor || theme.palette.background.paper // Feel free to customise this like they do in Tooltip

  return { 
    popoverRoot: {
      backgroundColor: color,
      maxWidth: 1000,
      position: 'relative',
    },
    content: {
      padding: theme.spacing(props.spacing || 0),
      backgroundImage: props.tipBackgroundImage || color,
      borderRadius: '5px',
    },
    // Stolen from https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/Tooltip/Tooltip.js and https://github.com/mui-org/material-ui/blob/4f2a07e140c954b478a6670c009c23a59ec3e2d4/docs/src/pages/components/popper/ScrollPlayground.js
    popper: {
      zIndex: 2000,
      '&[x-placement*="bottom"] $arrow': {
        top: 0,
        left: 0,
        marginTop: '-0.71em',
        marginLeft: 4,
        marginRight: 4,
        '&::before': {
          transformOrigin: '0 100%',
        },
      },
      '&[x-placement*="bottom-start"] $arrow': {
        top: 0,
        left: 0,
        marginTop: '-0.71em',
        marginLeft: 4,
        marginRight: 4,
        '&::before': {
          transformOrigin: '0 100%',
        },
      },
      '&[x-placement*="top"] $arrow': {
        bottom: 0,
        left: 0,
        marginBottom: '-0.71em',
        marginLeft: 4,
        marginRight: 4,
        '&::before': {
          transformOrigin: '100% 0',
        },
      },
      '&[x-placement*="right"] $arrow': {
        left: 0,
        marginLeft: '-0.71em',
        height: '1em',
        width: '0.71em',
        marginTop: 4,
        marginBottom: 4,
        '&::before': {
          transformOrigin: '100% 100%',
        },
      },
      '&[x-placement*="left"] $arrow': {
        right: 0,
        marginRight: '-0.71em',
        height: '1em',
        width: '0.71em',
        marginTop: 4,
        marginBottom: 4,
        '&::before': {
          transformOrigin: '0 0',
        },
      },
    },
    // Stolen from https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/Tooltip/Tooltip.js
    arrow: {
      overflow: 'hidden',
      position: 'absolute',
      width: '1em',
      height: '0.71em' /* = width / sqrt(2) = (length of the hypotenuse) */,
      boxSizing: 'border-box',
      color,
      zIndex: 1,
      '&::before': {
        content: '""',
        margin: 'auto',
        display: 'block',
        width: '100%',
        height: '100%',
        boxShadow: theme.shadows[1],
        backgroundColor: 'currentColor',
        transform: 'rotate(45deg)',
      },
    },
  }
})

const RichTooltip = ({
  placement = 'top',
  arrow = true,
  open,
  onClose = () => {},
  content,
  children,
  ...otherProps
}) => {
  const classes = useStyles(otherProps)()
  const [arrowRef, setArrowRef] = React.useState(null)
  const [childNode, setChildNode] = React.useState(null)

  return (
    <div>
      {React.cloneElement(children, { ...children.props, ref: setChildNode })}
      <Popper
        id="popper-1"
        open={open}
        anchorEl={childNode}
        placement={placement}
        transition
        className={classes.popper}
        modifiers={{
          preventOverflow: {
            enabled: true,
            boundariesElement: 'window',
          },
          arrow: {
            enabled: arrow,
            element: arrowRef,
          },
          offset: {
            enabled: true,
            offset: '0, 8', // Add some offset to prevent overlap
          },
        }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <ClickAwayListener onClickAway={onClose}>
                <Paper className={classes.popoverRoot}>
                  {arrow ? (
                    <span className={classes.arrow} ref={setArrowRef} />
                  ) : null}
                  <Box className={classes.content}>{content}</Box>
                </Paper>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </div>
  )
}
RichTooltip.propTypes = {
  content: PropTypes.any,
  children: PropTypes.any,
  open: PropTypes.any,
  onClose: PropTypes.any,
  arrow: PropTypes.any,
  placement: PropTypes.any,
}

export default RichTooltip
