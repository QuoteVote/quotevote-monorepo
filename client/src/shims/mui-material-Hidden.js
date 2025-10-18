import React from 'react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// Minimal, runtime Hidden shim compatible with @mui/material/Hidden usage.
// Supports common props: *Up, *Down, and `only` (string or array of breakpoints).
// Hides children when the corresponding media query matches.
export default function Hidden({
  children,
  xsUp, smUp, mdUp, lgUp, xlUp,
  xsDown, smDown, mdDown, lgDown, xlDown,
  only,
}) {
  const theme = useTheme()
  // Up queries
  const mXsUp = useMediaQuery(theme.breakpoints.up('xs'))
  const mSmUp = useMediaQuery(theme.breakpoints.up('sm'))
  const mMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const mLgUp = useMediaQuery(theme.breakpoints.up('lg'))
  const mXlUp = useMediaQuery(theme.breakpoints.up('xl'))
  // Down queries
  const mXsDown = useMediaQuery(theme.breakpoints.down('xs'))
  const mSmDown = useMediaQuery(theme.breakpoints.down('sm'))
  const mMdDown = useMediaQuery(theme.breakpoints.down('md'))
  const mLgDown = useMediaQuery(theme.breakpoints.down('lg'))
  const mXlDown = useMediaQuery(theme.breakpoints.down('xl'))
  // Only queries
  const mOnlyXs = useMediaQuery(theme.breakpoints.only('xs'))
  const mOnlySm = useMediaQuery(theme.breakpoints.only('sm'))
  const mOnlyMd = useMediaQuery(theme.breakpoints.only('md'))
  const mOnlyLg = useMediaQuery(theme.breakpoints.only('lg'))
  const mOnlyXl = useMediaQuery(theme.breakpoints.only('xl'))

  let hidden = false
  // Up
  if (!hidden && xsUp && mXsUp) hidden = true
  if (!hidden && smUp && mSmUp) hidden = true
  if (!hidden && mdUp && mMdUp) hidden = true
  if (!hidden && lgUp && mLgUp) hidden = true
  if (!hidden && xlUp && mXlUp) hidden = true
  // Down
  if (!hidden && xsDown && mXsDown) hidden = true
  if (!hidden && smDown && mSmDown) hidden = true
  if (!hidden && mdDown && mMdDown) hidden = true
  if (!hidden && lgDown && mLgDown) hidden = true
  if (!hidden && xlDown && mXlDown) hidden = true
  // Only
  if (!hidden && only) {
    const list = Array.isArray(only) ? only : [only]
    hidden = list.some((bp) => (
      (bp === 'xs' && mOnlyXs)
      || (bp === 'sm' && mOnlySm)
      || (bp === 'md' && mOnlyMd)
      || (bp === 'lg' && mOnlyLg)
      || (bp === 'xl' && mOnlyXl)
    ))
  }

  if (hidden) return null
  return React.createElement(React.Fragment, null, children)
}
