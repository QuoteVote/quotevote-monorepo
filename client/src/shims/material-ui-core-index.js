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
// Hidden historically existed in v4; use a local shim that provides
// a lightweight compatibility layer for the legacy import path.
export { default as Hidden } from './material-ui-core-Hidden'
export { default as Drawer } from '@mui/material/Drawer'
export { default as Paper } from '@mui/material/Paper'
export { default as List } from '@mui/material/List'
export { default as ListItem } from '@mui/material/ListItem'
export { default as ListItemAvatar } from '@mui/material/ListItemAvatar'
export { default as ListItemText } from '@mui/material/ListItemText'
export { default as Avatar } from '@mui/material/Avatar'
export { default as CircularProgress } from '@mui/material/CircularProgress'
// Provide a default export that maps to Box for compatibility
export { default } from '@mui/material/Box'
