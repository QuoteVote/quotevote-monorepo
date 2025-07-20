import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Replacement for the deprecated withWidth HOC
export default function withWidth() {
  return function WithWidth(Component) {
    return function WrappedComponent(props) {
      const theme = useTheme();
      
      // Determine the current breakpoint
      const isXs = useMediaQuery(theme.breakpoints.only('xs'));
      const isSm = useMediaQuery(theme.breakpoints.only('sm'));
      const isMd = useMediaQuery(theme.breakpoints.only('md'));
      const isLg = useMediaQuery(theme.breakpoints.only('lg'));
      const isXl = useMediaQuery(theme.breakpoints.only('xl'));
      
      let width = 'xs';
      if (isXl) width = 'xl';
      else if (isLg) width = 'lg';
      else if (isMd) width = 'md';
      else if (isSm) width = 'sm';
      
      return <Component {...props} width={width} />;
    };
  };
}