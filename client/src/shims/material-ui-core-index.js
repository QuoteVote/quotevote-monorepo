// Compatibility shim: re-export a subset of @mui/material under the
// legacy '@material-ui/core' package name so Vite/Rollup can statically
// resolve imports coming from older files that still use material-ui v4.
// Keep this file minimal and only add symbols that appear frequently.
export { default as Box } from '@mui/material/Box'
export { default as Grid } from '@mui/material/Grid'
export { default as Button } from '@mui/material/Button'
export { default as IconButton } from '@mui/material/IconButton'
export { default as Typography } from '@mui/material/Typography'
export { default as Divider } from '@mui/material/Divider'
export { default as Fade } from '@mui/material/Fade'
export { default as Hidden } from '@mui/material/Hidden'
export { default as Drawer } from '@mui/material/Drawer'
export { default as Paper } from '@mui/material/Paper'
export { default as Box as default } from '@mui/material/Box'
