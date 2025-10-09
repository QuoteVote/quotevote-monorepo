// Lightweight test shim for @mui/icons-material/* imports.
// Exports a simple React component placeholder so tests that import icons won't open
// dozens/hundreds of real icon files during import-analysis.
import React from 'react'

const MuiIconStub = (props) => React.createElement('span', { 'data-testid': props['data-testid'] || 'mui-icon', className: props.className }, null)

export default MuiIconStub
