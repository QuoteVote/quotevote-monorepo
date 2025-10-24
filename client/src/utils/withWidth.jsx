import React from 'react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// Simple withWidth HOC shim to provide width prop ('xs','sm','md','lg','xl')
export default function withWidth() {
  return function WithWidth(Component) {
    return function WithWidthWrapper(props) {
      const theme = useTheme()
      const upXs = useMediaQuery(theme.breakpoints.up('xs'))
      const upSm = useMediaQuery(theme.breakpoints.up('sm'))
      const upMd = useMediaQuery(theme.breakpoints.up('md'))
      const upLg = useMediaQuery(theme.breakpoints.up('lg'))
      const upXl = useMediaQuery(theme.breakpoints.up('xl'))

      let width = 'xs'
      if (upXl) width = 'xl'
      else if (upLg) width = 'lg'
      else if (upMd) width = 'md'
      else if (upSm) width = 'sm'
      else if (upXs) width = 'xs'

      return <Component {...props} width={width} />
    }
  }
}
