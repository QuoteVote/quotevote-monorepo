// Compatibility shim for packages importing v4 '@material-ui/core/Fade'
// Re-export MUI v5/7 Fade component from the current @mui/material package
const Fade = require('@mui/material/Fade')
module.exports = Fade.default || Fade
