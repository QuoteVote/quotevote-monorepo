import React from 'react'
export default function Extension(props){ return React.createElement('span',{ 'data-testid': props['data-testid'] || 'mui-icon-extension', ...props }, null) }
