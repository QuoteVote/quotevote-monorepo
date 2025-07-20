/* eslint-disable react/static-property-placement */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import memoize from 'memoize-one'
import CircularProgress from '@mui/material/CircularProgress'

const DEFAULT_LOADER_STYLE = {
  width: 'auto',
  height: 'auto',
  zIndex: '100',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const ABSOLUTELY_POSITIONED_STYLE = {
  position: 'absolute',
  top: 'calc(50% - 15px)',
  left: 'calc(50% - 36px)',
}

class Loader extends PureComponent {
  static propTypes = {
    size: PropTypes.number,
    loaderStyle: PropTypes.object,
    mergeStyles: PropTypes.bool,
    absolutelyPositioned: PropTypes.bool,
    PulseLoaderProps: PropTypes.object,
    thickness: PropTypes.number,
  }

  static defaultProps = {
    size: 40,
    mergeStyles: false,
    absolutelyPositioned: true,
    PulseLoaderProps: {},
    thickness: 3.6,
  }

  getLoaderStyle = memoize((loaderStyle, mergeStyles, absolutelyPositioned) => {
    if (!mergeStyles && loaderStyle) return loaderStyle

    return {
      ...DEFAULT_LOADER_STYLE,
      ...(absolutelyPositioned ? ABSOLUTELY_POSITIONED_STYLE : {}),
      ...(loaderStyle || {}),
    }
  })

  render() {
    const {
      loaderStyle: a,
      mergeStyles: b,
      absolutelyPositioned: c,
      PulseLoaderProps,
      size,
      thickness,
      // eslint-disable-next-line react/prop-types
      loadingLabel,
    } = this.props

    return (

      <div style={this.getLoaderStyle(a, b, c)}>
        <CircularProgress
          size={size}
          thickness={thickness}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...PulseLoaderProps}
        />
        { loadingLabel && (
          <div style={{ marginLeft: 10 }}>Loading...</div>
        )}
      </div>
    )
  }
}

export default Loader
